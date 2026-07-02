import express from 'express';
import { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct } from '../controllers/product.controller.js';
import { protect,restrictTo } from '../middleware/auth.middleware.js';
import { upload } from '../config/cloudinary.js';
const router=express.Router();

router.post('/',protect,restrictTo('seller','admin'),upload.array('images',5),createProduct)
router.get('/',getAllProducts)
router.get('/:id',getProductById)
router.put('/:id',protect,restrictTo('seller','admin'),upload.array('images',5),updateProduct)
router.delete('/:id',protect,restrictTo('seller','admin'),deleteProduct)
export default router;