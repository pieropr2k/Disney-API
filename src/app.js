const express = require("express");
const cors = require('cors')
const characterRouter = require("./routes/character");
const genderRouter = require("./routes/gender");
const serieRouter = require("./routes/serie");
const sequelize = require("./database/database");
const Character = require("./models/character");
const Serie = require("./models/serie");
const middleware = require('./utils/middleware')

const app = express();

app.use(cors())
app.use(express.json());

// To declare the Many to Many relation between Serie and Character
const Serie_Character = sequelize.define('Serie_Character', {}, { timestamps: false });
Serie.belongsToMany(Character, { through: Serie_Character });
Character.belongsToMany(Serie, { through: Serie_Character });

app.use('/api/characters', characterRouter)
app.use('/api/movies', serieRouter)
app.use('/api/genders', genderRouter)

app.use(middleware.unknownEndpoint)

module.exports = app;