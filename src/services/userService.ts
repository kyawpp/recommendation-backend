import UserRepository from '../repositories/userRepository';
import { UserCreationAttributes, UserAttributes, User } from '../models/user';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

class UserService {

    async signUp(user: UserCreationAttributes): Promise<Omit<UserAttributes, 'password'>> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await UserRepository.create({ ...user, id: uuidv4(), password: hashedPassword });
        const { password, ...userWithoutPassword } = newUser.toJSON();
        return userWithoutPassword;
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
