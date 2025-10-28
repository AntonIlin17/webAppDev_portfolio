import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  register,
  login,
  logout,
  me,
} from '../controllers/usersController.js';

const router = Router();

// Auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

// CRUD
router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.post('/', protect, createUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.delete('/', protect, deleteAllUsers);

export default router;
