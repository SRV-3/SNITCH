import express from 'express';
const router = express.Router();
import { authenticateUser } from '../middleware/auth.middleware.js';
import { addToCart, getCart } from '../controllers/cart.controller.js';

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post('/add/:productId/:variantId', authenticateUser, addToCart);

/**
 * @route GET /api/cart/
 * @desc Get all cart items
 * @access Private to all
 */
router.get('/', authenticateUser, getCart);

export default router;
