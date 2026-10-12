const express = require('express');
const router = express.Router();
const {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require('../controllers/boardController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/roleMiddleware');

router.post('/', protect, adminOnly, createBoard);
router.get('/', protect, getBoards);
router.get('/:id', protect, getBoardById);
router.put('/:id', protect, adminOnly, updateBoard);
router.delete('/:id', protect, adminOnly, deleteBoard);

module.exports = router;
