const express = require('express');
const expressGraphql = require('express-graphql');
const moesif = require("moesif-express");

const applicationId = "<MOESIF_APPLICATION_ID>";
const schema = ;

const moesifMiddleware = moesif({ applicationId });
const graphqlMiddleware = expressGraphql({ schema });

const app = express();
app.use(moesifMiddleware);
app.use("/graphql", graphqlMiddleware);

app.listen(8888);