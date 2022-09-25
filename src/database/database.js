const Sequelize = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize('disney_db', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;