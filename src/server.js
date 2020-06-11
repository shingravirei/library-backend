const { ApolloServer, gql } = require('apollo-server');
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

            if (genre) return books.filter(book => book.genres.includes(genre));

            return books.filter(book => book.author === author);
        },

        allAuthors: () => {
            const authorsWithBookCount = authors.map(author => {
                const authorBooks = books.filter(
                    book => book.author === author.name
                );

                const bookCount = authorBooks.length;

                return { ...author, bookCount };
            });

            return authorsWithBookCount;
        }
    },

    Mutation: {
        addBook: (root, args) => {
            const { author, setBornTo } = args;

            // If the author is not in the library, we add him to the records
            if (!authors.find(a => a.name === author)) {
                const newAuthor = { name: author, id: uuid() };

                authors = authors.concat(newAuthor);
            }

            const newBook = { ...args, id: uuid() };

            books = books.concat(newBook);

            return newBook;
        },

        editAuthor: (root, args) => {
            const { name, setBornTo } = args;

            if (!authors.find(author => author.name === name)) {
                return null;
            }

            authors = authors.map(author =>
                author.name === name ? { ...author, born: setBornTo } : author
            );

            return authors.find(author => author.name === name);
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
