import express from'express';
import { register,login,refresh } from '../controllers/auth.controller.js';

import { protect,restrictTo } from '../middleware/auth.middleware.js';


const router=express.Router();

// Protected route — get my profile
router.get('/me', protect, (req, res) => {
  res.json({ success: true, data: req.user });
});
router.delete('/users/:id', protect, restrictTo('admin'), (req, res) => {
  res.json({ success: true, message: 'User deleted' });
});

router.post('/refresh-token', refresh);

router.post('/register', register);
router.post('/login', login);

export default router;