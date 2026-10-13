const User = require('../models/User');

// @desc  Admin-only: list regular users, for the "assign to" picker on the
//        admin dashboard. Never returns admins, and never returns passwords.
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('name email').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers };