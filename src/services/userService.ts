import UserRepository from '../repositories/userRepository';
import { UserCreationAttributes, UserAttributes, User } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import config from '../utils/config';

class UserService {

    async signUp(user: UserCreationAttributes): Promise<Omit<UserAttributes, 'password'>> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await UserRepository.create({ ...user, id: uuidv4(), password: hashedPassword });
        const { password, ...userWithoutPassword } = newUser.toJSON();
        return userWithoutPassword;
    }

    async login(email: string, password: string): Promise<{ user: Omit<UserAttributes, 'password'>; token: string }> {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });
        const { password: userPassword, ...userWithoutPassword } = user.toJSON();
        return { user: userWithoutPassword, token };
    }

    async getProfile(userId: string): Promise<{ user: Omit<UserAttributes, 'password'>; recommendations: Omit<UserAttributes, 'password'>[] }> {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const recommendations = await UserRepository.findRecommendations(user.id, user.gender, user.university, user.interests);
        const { password, ...userWithoutPassword } = user.toJSON();
        const recommendationsWithoutPasswords = recommendations.map(rec => {
            const { password: recPassword, ...recWithoutPassword } = rec.toJSON();
            return recWithoutPassword;
        });
        return { user: userWithoutPassword, recommendations: recommendationsWithoutPasswords };
    }

    async getRecommendations(userId: string): Promise<UserAttributes[]> {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const { gender, university, interests } = user;
        return UserRepository.findRecommendations(userId, gender, university, interests);
    }

    async findByEmail(email: string): Promise<UserAttributes | null> {
        const user = await UserRepository.findByEmail(email);
        return user ? user.toJSON() as UserAttributes : null; // Handle null and ensure type conformity
    }
}

export default new UserService();
