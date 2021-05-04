const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');
const startDatabase = require('./database');
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
const isTokenValid = require('./validate');
const moesif = require('moesif-nodejs');


// Create a context for holding contextual data
const context = async req => {
  const db = await startDatabase();
  const { authorization: token } = req.headers;

  return { db, token };
};

// Provide resolver functions for your schema fields
const resolvers = {
  events: async (_, context) => {
    const { db, token } = await context();

    const { error } = await isTokenValid(token);

    const events = db.collection('events').find();

    return !error
      ? events.toArray()
      : events.project({ attendants: null }).toArray();
  },
  event: async ({ id }, context) => {
    const { db, token } = await context();

    const { error, decoded } = await isTokenValid(token);

    const event = await db.collection('events').findOne({ id });

    const canEdit = decoded
      ? decoded.permissions && decoded.permissions.includes('edit:events')
      : false;

    return { ...event, attendants: !error ? event.attendants : null, canEdit };
  },
  editEvent: async ({ id, title, description }, context) => {
    const { db, token } = await context();

    const { error } = await isTokenValid(token);

    if (error) {
      throw new Error(error);
    }

    return db
      .collection('events')
      .findOneAndUpdate(
        { id },
        { $set: { title, description } },
        { returnOriginal: false },
      )
      .then(resp => resp.value);
  },
};
// 2. Set the options, the only required field is applicationId
const moesifMiddleware = moesif({
  applicationId: 'eyJhcHAiOiIxOTg6MTI5OCIsInZlciI6IjIuMCIsIm9yZyI6Ijg4OjE4MDEiLCJpYXQiOjE2MTQ1NTY4MDB9.yN6IE7U75Nnj6aU-IorQLYe-wVY20JT74D_Lc9EiISQ',

  // Optional hook to link API calls to users
  identifyUser: function (req, res) {
    return req.user ? req.user.id : undefined;
  },
});

// 3. Enable the Moesif middleware to start logging incoming API Calls
const app = express();
app.use(
  '/graphql',
  moesifMiddleware,
  cors(),
  graphqlHTTP(async req => ({
    schema,
    rootValue: resolvers,
    context: () => context(req),
  })),
);
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
app.listen(4000);

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
