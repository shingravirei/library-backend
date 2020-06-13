const { ApolloServer, UserInputError } = require('apollo-server');
const { v4: uuid } = require('uuid');

const typeDefs = require('./typedefs');
let { authors, books } = require('./library');

const resolvers = {
    Query: {
        bookCount: () => books.length,
        authorCount: () => authors.length,

        allBooks: (root, args) => {
            const { author, genre } = args;

            if (!author && !genre) return books;

            if (genre) {
                return books.filter((book) => book.genres.includes(genre));
            }

            return books.filter((book) => book.author === author);
        },

        allAuthors: () => authors
    },

    Mutation: {
        addBook: (root, args) => {
            const { author, title } = args;

            // If the author is not in the library, we add him to the records
            if (!authors.find((a) => a.name === author)) {
                const newAuthor = { name: author, id: uuid() };

                authors = authors.concat(newAuthor);
            }

            if (books.find((book) => book.title === title)) {
                throw new UserInputError('Book already in library');
            }

            const newBook = { ...args, id: uuid() };

            books = books.concat(newBook);

            return newBook;
        },

        editAuthor: (root, args) => {
            const { name, setBornTo } = args;

            if (!authors.find((author) => author.name === name)) {
                return null;
            }

            authors = authors.map((author) => {
                if (author.name === name) return { ...author, born: setBornTo };

                return author;
            });

            return authors.find((author) => author.name === name);
        }
    },

    Author: {
        bookCount: (parent) =>
            books.filter((book) => book.author === parent.name).length
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
