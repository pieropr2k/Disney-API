const app = require("./app.js");
const sequelize = require("./database/database.js");
const { DB_PORT } = require("./utils/config.js");
require('./models/character.js')
require('./models/serie.js')
const PORT = DB_PORT || 4000

const main = async () => {
    try {
        await sequelize.sync({ force: false });
        //.sync({ alter: true })
        //await sequelize.authenticate();
        app.listen(PORT);
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main()