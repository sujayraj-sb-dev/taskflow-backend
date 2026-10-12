const express = require('express');
const router = express.Router();
const {
  createCard,
  getCards,
  getCardById,
  updateCard,
  deleteCard,
  getUsersProgress,
} = require('../controllers/cardController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');

// Specific route before the /:id routes, otherwise Express would treat
// "progress" as an :id value and send it to getCardById instead.
router.get('/progress/all', protect, adminOnly, getUsersProgress);

router.post('/', protect, adminOnly, createCard);
router.get('/', protect, getCards);
router.get('/:id', protect, getCardById);
router.put('/:id', protect, updateCard);
router.delete('/:id', protect, adminOnly, deleteCard);

module.exports = router;