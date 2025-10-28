import { Router } from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
} from '../controllers/contactsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getContacts);
router.get('/:id', getContactById);
router.post('/', protect, createContact);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);
router.delete('/', protect, deleteAllContacts);

export default router;
