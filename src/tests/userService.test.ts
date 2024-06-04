import UserService from '../services/userService';
import UserRepository from '../repositories/userRepository';
import { UserCreationAttributes, UserAttributes } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('uuid');
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

describe('UserService', () => {
    const mockUser: UserCreationAttributes & { id: string } = {
        id: '1',
        name: 'John Doe',
        gender: 'male',
        location: 'New York',
        university: 'NYU',
        interests: ['coding', 'music'],
        email: 'johndoe@example.com',
        password: 'password123'
    };

    // Helper function to mock Sequelize model instance
    const mockSequelizeModel = (data: any) => ({
        ...data,
        toJSON: () => data
    });

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
            (UserRepository.create as jest.Mock).mockResolvedValue(mockSequelizeModel(mockUserWithId));

            const createdUser = await UserService.signUp(mockUser);
            expect(createdUser.id).toBe(mockUserWithId.id);
            expect(createdUser.email).toBe(mockUser.email);
        });
    });

    describe('login', () => {
        it('should return a token and user without password on successful login', async () => {
            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockSequelizeModel(mockUser));
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mockToken');

            const result = await UserService.login('johndoe@example.com', 'password123');

            expect(result.token).toBe('mockToken');
            expect(result.user).toEqual({
                id: '1',
                name: 'John Doe',
                gender: 'male',
                location: 'New York',
                university: 'NYU',
                interests: ['coding', 'music'],
                email: 'johndoe@example.com'
            });
        });

        it('should throw an error if email is not found', async () => {
            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

            await expect(UserService.login('johndoe@example.com', 'password123'))
                .rejects
                .toThrow('Invalid email or password');
        });

        it('should throw an error if password does not match', async () => {
            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockSequelizeModel(mockUser));
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(UserService.login('johndoe@example.com', 'password123'))
                .rejects
                .toThrow('Invalid email or password');
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

            (UserRepository.findById as jest.Mock).mockResolvedValue(mockSequelizeModel(mockUser));
            (UserRepository.findRecommendations as jest.Mock).mockResolvedValue([mockSequelizeModel(mockUser)]);

            const recommendations = await UserService.getRecommendations(mockUser.id);
            expect(recommendations).toHaveLength(1);
            expect(recommendations[0].name).toBe('John Doe');
        });
    });
});
