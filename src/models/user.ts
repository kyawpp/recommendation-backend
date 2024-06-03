import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './index';

interface UserAttributes {
    id: string;
    name: string;
    gender: string;
    location: string;
    university: string;
    interests: string[];
    email: string;
    password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public gender!: string;
    public location!: string;
    public university!: string;
    public interests!: string[];
    public email!: string;
    public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        university: {
            type: DataTypes.STRING,
            allowNull: false
        },
        interests: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'users',
        defaultScope: {
            attributes: { exclude: ['password'] }
        },
        scopes: {
            withPassword: {
                attributes: {include: ['password'] }
            }
        }
    }
);

export { User, UserAttributes, UserCreationAttributes };
