const Card = require('../models/Card');
const User = require('../models/User');

// @desc  Create a card and assign it to a user (admin only)
const createCard = async (req, res) => {
  try {
    const { title, description, board, assignedTo } = req.body;

    if (!title || !board || !assignedTo) {
      return res.status(400).json({ message: 'title, board, and assignedTo are required' });
    }

    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(400).json({ message: 'assignedTo must be a valid user id' });
    }

    const card = await Card.create({
      title,
      description,
      board,
      assignedTo,
      createdBy: req.user._id,
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Get cards. Admin sees every card, a regular user sees only their own.
const getCards = async (req, res) => {
  try {
    // This is the core RBAC rule for this whole module: the query differs
    // only by req.user.role, decided here, before any data is fetched.
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };

    const cards = await Card.find(filter)
      .populate('assignedTo', 'name email')
      .populate('board', 'title')
      .sort({ createdAt: -1 });

    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Get one card by id. A regular user can only fetch their own.
const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('board', 'title');

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const isOwner = card.assignedTo._id.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Access denied, this card is not assigned to you' });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Update a card. Admin can edit everything including reassignment.
//        A regular user may only move their own card between statuses.
const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const isOwner = card.assignedTo.toString() === req.user._id.toString();

    if (req.user.role === 'admin') {
      card.title = req.body.title ?? card.title;
      card.description = req.body.description ?? card.description;
      card.status = req.body.status ?? card.status;
      card.assignedTo = req.body.assignedTo ?? card.assignedTo;
    } else {
      if (!isOwner) {
        return res.status(403).json({ message: 'Access denied, this card is not assigned to you' });
      }
      if (!req.body.status) {
        return res.status(400).json({ message: 'Only the status field can be updated' });
      }
      card.status = req.body.status;
    }

    const updatedCard = await card.save();
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Delete a card (admin only)
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    await card.deleteOne();
    res.json({ message: 'Card deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc  Admin-only: every user's task counts by status, for the progress overview.
const getUsersProgress = async (req, res) => {
  try {
    const progress = await Card.aggregate([
      {
        $group: {
          _id: { user: '$assignedTo', status: '$status' },
          count: { $sum: 1 },
        },
      },
    ]);

    const users = await User.find({ role: 'user' }).select('name email');

    const result = users.map((user) => {
      const userProgress = { todo: 0, 'in-progress': 0, done: 0 };

      progress
        .filter((p) => p._id.user.toString() === user._id.toString())
        .forEach((p) => {
          userProgress[p._id.status] = p.count;
        });

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        progress: userProgress,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createCard, getCards, getCardById, updateCard, deleteCard, getUsersProgress };
