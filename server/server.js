const express = require('express');

// add apollo server dependencies
const { ApolloServer } = require('apollo-server-express');
// add typeDefs and resolvers 
const { typeDefs, resolvers } = require('./schemas');
const path = require('path');
const db = require('./config/connection');
const { authMiddleware } = require("./utils/auth")

// required servers
const server = new ApolloServer({
  typeDefs,
  resolvers
});


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// add new apollo server with graphql schema function required
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });


db.once('open', () => {
  app.listen(PORT, () => {
    console.log('API server running on port ${PORT}');
    console.log('Use GraphQL at http://localhost:${PORT}{server.graphqlPath}');
  })
});
};

// for starting the server function
startApolloServer(typeDefs, resolvers);
