const Sequelize = require('sequelize');
const User = require('./User');
const Author = require('./Author');
const Book = require('./Book');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db_dev.db',
    logging: false
});

Author.hasMany(Book);
Book.belongsTo(Author);

// Author.sync({ force: true }).then((res) => {
//     console.log('user, works');
// });

// Book.sync({ force: true }).then((res) => {
//     console.log('book, works');
// });

// User.sync({ force: true }).then(() => {
//     console.log('User table createad!');
// });

module.exports = {
    User,
    Author,
    Book,
    sequelize
};
