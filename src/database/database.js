const Sequelize = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = require('../utils/config');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    port: 5432
});

module.exports = sequelize;