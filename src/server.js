const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');

const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');
const { JWT_SECRET } = require('./config');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // eslint-disable-next-line consistent-return
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;

        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);

            return { username: decodedToken.username };
        }
    }
});

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
