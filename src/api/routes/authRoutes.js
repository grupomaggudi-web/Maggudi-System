import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import authController from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
import { createAuthSchema, loginSchema } from '../validations/authValidation.js';

const router = express.Router();

// Autenticación tradicional
router.post('/register', validateRequest(createAuthSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// OAuth con Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

// OAuth con GitHub
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api/auth/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  },
);

export default router;
