const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db_dev.db',
    logging: false
});

const Book = sequelize.define('book', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    published: {
        type: Sequelize.NUMBER
    },
    genres: {
        type: Sequelize.JSON
    }
});

module.exports = Book;
