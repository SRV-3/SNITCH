import { Router } from 'express';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import multer from 'multer';
import {
  createProduct,
  getSellerProducts,
  productDetails,
  getAllProducts,
  addVariants,
} from '../controllers/product.controller.js';
import { createProductValidator } from '../validators/product.validator.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = Router();

router.post('/', authenticateSeller, upload.array('images', 7), createProduct);
router.get('/seller-products', authenticateSeller, getSellerProducts);
router.get('/', getAllProducts);
router.get('/:id', productDetails);
router.post('/:id/variants', authenticateSeller, upload.array('images', 7), addVariants);

export default router;
