const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db_dev.db',
    logging: false
});

const Author = sequelize.define('author', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    born: {
        type: Sequelize.NUMBER
    }
});

module.exports = Author;
