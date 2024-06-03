import UserService from '../services/userService';
import UserRepository from '../repositories/userRepository';
import { UserAttributes, UserCreationAttributes } from '../models/user';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('uuid');

describe('UserService', () => {
    describe('signUp', () => {
        it('should create a new user', async () => {
            const mockUser: UserCreationAttributes = {
                name: 'John Doe',
                gender: 'male',
                location: 'New York',
                university: 'NYU',
                interests: ['coding', 'music'],
                email: 'john.doe@example.com',
                password: 'password123'
            };

            const mockUserWithId: UserAttributes = {
                ...mockUser,
                id: uuidv4(),
                password: 'hashedPassword'
            };

            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (uuidv4 as jest.Mock).mockReturnValue(mockUserWithId.id);
            (UserRepository.create as jest.Mock).mockResolvedValue(mockUserWithId);

            const createdUser = await UserService.signUp(mockUser);
            expect(createdUser.id).toBe(mockUserWithId.id);
            expect(createdUser.email).toBe(mockUser.email);
        });
    });

    describe('getRecommendations', () => {
        it('should return recommendations for a user', async () => {
            const mockUser: UserAttributes = {
                id: uuidv4(),
                name: 'John Doe',
                gender: 'male',
                location: 'New York',
                university: 'NYU',
                interests: ['coding', 'music'],
                email: 'john.doe@example.com',
                password: 'hashedPassword'
            };

            (UserRepository.findById as jest.Mock).mockResolvedValue(mockUser);
            (UserRepository.findRecommendations as jest.Mock).mockResolvedValue([mockUser]);

            const recommendations = await UserService.getRecommendations(mockUser.id);
            expect(recommendations).toHaveLength(1);
            expect(recommendations[0].name).toBe('John Doe');
        });
    });
});
