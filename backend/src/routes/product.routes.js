import { Router } from 'express';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import multer from 'multer';
import {
  createProduct,
  getSellerProducts,
  productDetails,
  getAllProducts,
  addVariants,
  updateProduct,
} from '../controllers/product.controller.js';
import { createProductValidator } from '../validators/product.validator.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = Router();

/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller only)
 */
router.post('/', authenticateSeller, upload.array('images', 7), createProduct);

/**
 * @route GET /api/products/seller-products
 * @description Get all products of the authenticated seller
 * @access Private (Seller only)
 */
router.get('/seller-products', authenticateSeller, getSellerProducts);

/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */
router.get('/', getAllProducts);

/**
 * @route GET /api/products/:id
 * @description Get product details by ID
 * @access Public
 */
router.get('/:id', productDetails);

/**
 * @route post /api/products/:id/variants
 * @description Add a new variant to a product
 * @access Private (Seller only)
 */
router.post('/:id/variants', authenticateSeller, upload.array('images', 7), addVariants);

/**
 * @route patch /api/products/:id
 * @description Update the existing product
 * @access Private (Seller only)
 */
router.patch('/:id', authenticateSeller, upload.array('images', 7), updateProduct);

export default router;
