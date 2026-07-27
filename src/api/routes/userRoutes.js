import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { createUserSchema, updateUserSchema } from '../validations/authValidation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateRequest(createUserSchema), userController.createUser);
router.put('/:id', validateRequest(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
