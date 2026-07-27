import express from 'express';
import authController from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
import { createAuthSchema, loginSchema } from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', validateRequest(createAuthSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
