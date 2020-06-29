const { UserInputError } = require('apollo-server');
const { Op } = require('sequelize');
const { Author, Book } = require('./models/db');

const resolvers = {
    Query: {
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

                console.log(books);

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
        addBook: async (root, args) => {
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

        editAuthor: async (root, args) => {
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
