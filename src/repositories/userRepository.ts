import { User, UserCreationAttributes } from '../models/user';
import sequelize from '../models/index';
import { Op } from 'sequelize';

class UserRepository {
    async create(user: UserCreationAttributes): Promise<User> {
        return User.create(user);
    }

    async findById(id: string): Promise<User | null> {
        return User.findByPk(id);
    }

    async findByEmail(email: string): Promise<User | null>{
        return User.scope('withPassword').findOne({ where: { email } });
    }

    async findRecommendations(userId: string, gender: string, university: string, interests: string[]): Promise<User[]> {
        return User.findAll({
            where: {
                id: { [Op.ne]: userId },
                gender: { [Op.ne]: gender },
                interests: { [Op.overlap]: interests }
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt'],
                include: [
                    [
                        sequelize.literal(`
                            (
                                (CASE WHEN university = '${university}' THEN 3 ELSE 0 END) +
                                (CASE WHEN interests && ARRAY[${interests.map(interest => `'${interest}'`)}]::varchar[] THEN 2 ELSE 0 END) +
                                RANDOM()
                            )`),
                        'score'
                    ]
                ]
            },
            order: [[sequelize.literal('score'), 'DESC']],
            limit: 10
        });
    }
}

export default new UserRepository();
