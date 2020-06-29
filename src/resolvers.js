const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { Op } = require('sequelize');
const { User, Author, Book } = require('./models/db');
const { JWT_SECRET } = require('./config');

const resolvers = {
    Query: {
        me: async (root, args, context) => {
            const { username } = context.username;

            const user = await User.findOne({
                where: {
                    username
                }
            });

            return user;
        },

        bookCount: async () => {
            const { count } = await Book.findAndCountAll();

            return count;
        },
        authorCount: async () => {
            const { count } = await Author.findAndCountAll();

            return count;
        },

        allBooks: async (root, args) => {
            const { author, genre } = args;

            if (!author && !genre) {
                const books = await Book.findAll({
                    include: [Author],
                    raw: true,
                    nest: true
                });

                return books;
            }

            if (genre) {
                const books = await Book.findAll({
                    where: {
                        genres: {
                            [Op.like]: `%${genre}%`
                        }
                    }
                });

                return books;
            }

            const books = await Book.findAll({
                include: [
                    {
                        model: Author,
                        where: {
                            name: author
                        }
                    }
                ]
            });

            return books;
        },

        allAuthors: async () => {
            const authors = await Author.findAll({
                attributes: ['id', 'name', 'born']
            });

            return authors;
        }
    },

    Mutation: {
        createUser: async (root, args) => {
            const { username, favoriteGenre } = args;
            const password = 'password';

            const user = await User.create({
                username,
                password,
                favoriteGenre
            });

            return user;
        },

        login: async (root, args) => {
            const { username, password } = args;

            const user = await User.findOne({
                where: { username }
            });

            if (!user || password !== 'password') {
                throw new UserInputError('Wrong credentials!');
            }

            const userForToken = {
                id: user.id,
                username: user.username
            };

            const token = jwt.sign(userForToken, JWT_SECRET);

            return { value: token };
        },
        addBook: async (root, args, context) => {
            // TODO: maybe add a helper function here
            const { username } = context;

            if (!username) {
                throw new UserInputError('User must be logged in!');
            }

            // eslint-disable-next-line object-curly-newline
            const { author, title, published, genres } = args;

            // If the author is not in the library, we add him to the records
            const findAuthor = await Author.findOrCreate({
                where: { name: author }
            });

            const book = await Book.findOne({
                where: {
                    title
                }
            });

            if (book) {
                throw new UserInputError('Book already in library');
            }

            const newBook = Book.create({
                title,
                published,
                genres,
                authorId: findAuthor.id
            });

            return newBook;
        },

        editAuthor: async (root, args, context) => {
            const { username } = context;

            if (!username) {
                throw new UserInputError('User must be logged in!');
            }

            const { name, setBornTo } = args;

            const author = await Author.findOne({ where: { name } });

            if (!author) {
                return null;
            }

            await author.update({ born: setBornTo }, { fields: ['born'] });

            return author;
        }
    }
};

module.exports = resolvers;
