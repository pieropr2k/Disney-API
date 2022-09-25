const { DataTypes } = require('sequelize');
//const sequelize = new Sequelize('sqlite::memory:');
const sequelize = require('../database/database.js');

const Character = sequelize.define('Character', {
    // Model attributes are defined here
    image: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight: {
        type: DataTypes.INTEGER,
        //allowNull: false
    },
    history: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    timestamps: false
});

//Character.belongsToMany(Serie, { through: 'Serie_Character' });

module.exports = Character;