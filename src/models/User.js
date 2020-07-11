const Sequelize = require('sequelize');

const UserModel = (sequelize) =>
    sequelize.define('user', {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        favoriteGenre: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

module.exports = UserModel;
