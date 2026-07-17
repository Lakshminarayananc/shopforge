import express from 'express';
import { addToCart, getCart,removeFromCart,updateQuantity,clearCart } from '../controllers/cart.controller.js';
import Product from '../models/product.model.js';

import { protect } from '../middleware/auth.middleware.js';


const router=express.Router();

router.post('/add',protect,addToCart)
router.get('/',protect,getCart)
router.delete('/remove/:id', protect, removeFromCart);
router.put('/update', protect, updateQuantity);
router.delete('/clear', protect, clearCart);

export default router