const { gql } = require('apollo-server');

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        favoriteGenre: String!
    }

    type Token {
        value: String!
    }

    type Book {
        id: ID!
        title: String!
        author: Author!
        published: Int!
        genres: [String!]!
    }

    type Author {
        id: ID!
        name: String!
        born: Int
        bookCount: Int!
    }

    type Query {
        me: User
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        createUser(
            username: String!
            favoriteGenre: String!
        )
        login(
            username: String!
            password: String!
        )
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editAuthor(name: String!, setBornTo: Int!): Author
    }
`;

module.exports = typeDefs;
