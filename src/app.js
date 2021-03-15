const express = require('express');
const graphqlHTTP = require('express-graphql');
const jwt = require("jsonwebtoken");
const authorize = require("./authorization-middleware");
const config = require("./config");
const schema = require('./schema.js');

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
  res.send("Nama kevin");
});

app.use('/graphql',  graphqlHTTP({
    schema:schema,
    graphiql:true
}));


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});