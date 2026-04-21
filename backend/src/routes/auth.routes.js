import { Router } from 'express';
import { validateRegisterUser, validateLoginUser } from '../validators/auth.validator.js';
import { registerController, loginController, googleCallback, getMe } from '../controllers/auth.controller.js';
import passport from 'passport';
import { config } from '../config/config.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register new user
 * @access Public
 */
router.post('/register', validateRegisterUser, registerController);

/**
 * @route POST /api/auth/login
 * @description Login existing user
 * @access Public
 */
router.post('/login', validateLoginUser, loginController);

/**
 * @route get /api/auth/google
 * @description Open google accoounts page to register and login
 * @access Public
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @route get /api/auth/google/callback
 * @description Send auth token and register/login the user
 * @access Public
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: config.NODE_ENV == 'development' ? 'http://localhost:5173/login' : '/login',
  }),

  googleCallback
);

/**
 * @route GET /api/auth/me
 * @description Get the authenticated user's profile
 * @access Private
 */
router.get('/me', authenticateUser, getMe);
export default router;
