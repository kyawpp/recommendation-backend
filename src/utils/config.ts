import * as dotenv from 'dotenv';

dotenv.config();

export default {
    databaseUrl: process.env.DATABASE_URL || '',
    port: process.env.PORT || 3000,
    secretKey: process.env.SECRET_KEY || '',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret'
};
