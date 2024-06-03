import { Request, Response } from 'express';
import UserService from '../services/userService';
import userService from '../services/userService';

class UserController {
    async signUp(req: Request, res: Response): Promise<void> {
        try {

            const { name, gender, location, university, interests, email, password } = req.body;
            const existingUser =  await userService.findByEmail(email)
            if (existingUser) {
                res.status(400).json({ error: 'Email already exists' });
                return;
            }
            const user = await UserService.signUp(req.body);
            
            res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }

    async getRecommendations(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const recommendations = await UserService.getRecommendations(userId);
            res.json(recommendations);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }
}

export default new UserController();
