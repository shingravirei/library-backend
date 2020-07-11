const Sequelize = require('sequelize');

const AuthorModel = (sequelize) =>
    sequelize.define('author', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        born: {
            type: Sequelize.NUMBER
        }
    });

module.exports = AuthorModel;
