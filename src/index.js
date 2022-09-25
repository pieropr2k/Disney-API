const app = require("./app.js");
require('dotenv').config()
const sequelize = require("./database/database.js");
require('./models/character.js')
require('./models/serie.js')

const main = async () => {
    try {
        await sequelize.sync({ force: false });
        //.sync({ alter: true })
        //await sequelize.authenticate();
        app.listen(process.env.DB_PORT);
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main()