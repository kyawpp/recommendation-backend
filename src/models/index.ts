import { Sequelize } from 'sequelize';
import config from '../utils/config';

const sequelize = new Sequelize(config.databaseUrl, {
    dialect: 'postgres',
    logging: false
});

export default sequelize;
