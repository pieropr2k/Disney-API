const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

const Serie = sequelize.define('Serie', {
    // Model attributes are defined here
    image: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    creationDate: {
        type: DataTypes.DATEONLY
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // Other model options go here
    timestamps: false
});

//Serie.belongsToMany(Character, { through: 'Serie_Character' });

module.exports = Serie;