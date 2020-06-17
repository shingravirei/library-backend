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
        type: Sequelize.JSON,
        get() {
            return JSON.parse(this.getDataValue('genres'));
        },
        set(value) {
            // TODO: maybe add some validation here
            this.setDataValue('genres', JSON.stringify(value));
        }
    }
});

module.exports = Book;
