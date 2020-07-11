const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const AuthorModel = require('./models/Author');
const BookModel = require('./models/Book');
const { DB_PATH } = require('./config');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_PATH,
    logging: false
});

const User = UserModel(sequelize);
const Author = AuthorModel(sequelize);
const Book = BookModel(sequelize);

Author.hasMany(Book);
Book.belongsTo(Author);

if (process.argv[2] === 'migrate:up') {
    Author.sync({ force: true }).then(() => {
        console.log('Author table created');
    });

    Book.sync({ force: true }).then(() => {
        console.log('Book table created');
    });

    User.sync({ force: true }).then(() => {
        console.log('User table createad');
    });
}

module.exports = {
    User,
    Author,
    Book,
    sequelize
};
