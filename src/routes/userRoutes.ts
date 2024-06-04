import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticateJWT } from '../middlewares/authMiddleware';
import userController from '../controllers/userController';

const router = Router();

router.post('/signup', UserController.signUp);
router.post('/login', UserController.login)
router.get('/profile', authenticateJWT, userController.getProfile)

export default router;
