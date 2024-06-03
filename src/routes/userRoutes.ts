import { Router } from 'express';
import UserController from '../controllers/userController';

const router = Router();

router.post('/signup', UserController.signUp);
router.get('/recommendations/:id', UserController.getRecommendations);

export default router;
