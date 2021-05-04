const express = require('express');
const graphqlHTTP = require('express-graphql');
const jwt = require("jsonwebtoken");
const authorize = require("./authorization-middleware");
const config = require("./config");
const schema = require('./schema.js');
const moesif = require('moesif-nodejs');

// 2. Set the options, the only required field is applicationId
const moesifMiddleware = moesif({
  applicationId: 'eyJhcHAiOiIxOTg6MTI5OCIsInZlciI6IjIuMCIsIm9yZyI6Ijg4OjE4MDEiLCJpYXQiOjE2MTQ1NTY4MDB9.yN6IE7U75Nnj6aU-IorQLYe-wVY20JT74D_Lc9EiISQ',

  // Optional hook to link API calls to users
  identifyUser: function (req, res) {
    return req.user ? req.user.id : undefined;
  },
});


const app = express();

app.get("/token", (req, res) => {
  const payload = {
    name: "kevin",
    scopes: "customer:read"
  };

  const token = jwt.sign(payload, config.JWT_SECRET);
  res.send(token);
});

app.get("/user", authorize("customer:read"), (req, res) => {
  res.send("Selamat Datang");
});

app.use('/graphql', moesifMiddleware,  graphqlHTTP({
    schema:schema,
    graphiql:true,
}));


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});