const { DataTypes } = require('sequelize');
const Serie = require('./serie');
const sequelize = require('../database/database.js');

const Gender = sequelize.define('Gender', {
    // Model attributes are defined here
    image: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    timestamps: false
});

Gender.hasMany(Serie, {
    foreinkey: "genderId",
    sourceKey: "id",
});

module.exports = Gender;