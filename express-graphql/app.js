const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
 
const fakeDatabase = []

const schema = buildSchema(`
  type User {
    id: ID
    name: String
    hobby: String
  }

  type Query {
    getUser(id: ID): User,
    getUsers: [User]
  }

  type Mutation {
    createUser(id: ID, name: String, hobby: String): User
  }
`)

const root = {
  getUser: (user) => {
    const result = fakeDatabase.map(databaseUser => {
      if (databaseUser.id == user.id) {
        return databaseUser
      }
    })

    return result[0]
  },
  getUsers: () => {
    return fakeDatabase
  },
  createUser: (user) => {
    fakeDatabase.push({
      id: user.id,
      name: user.name,
      hobby: user.hobby
    })

    return user
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))

app.listen(4000, console.log('Server Ready on http://localhost:4000/graphql'))