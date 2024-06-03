import express from 'express';
import sequelize from './models';
import userRoutes from './routes/userRoutes';
import config from './utils/config';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();

export default app;
