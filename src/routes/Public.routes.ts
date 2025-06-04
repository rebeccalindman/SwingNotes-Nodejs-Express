import { Router } from 'express';
/* import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from '../controllers/itemController'; */

const router = Router();

router.get('/register', (req, res) => {
  res.render('register');
});

export default router;