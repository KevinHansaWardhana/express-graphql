const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let database = null;

async function startDatabase() {
  const mongo = new MongoMemoryServer();
  const mongoDBURL = await mongo.getConnectionString();
  const connection = await MongoClient.connect(mongoDBURL, {
    useNewUrlParser: true,
  });

  if (!database) {
    database = connection.db();

    await database.collection('events').insertMany([
      {
        id: 1,
        title: 'Coba auth',
        description: 'Introductionary night to GraphQL',
        date: '2021',
        attendants: [
          {
            id: 1,
            name: 'Kevin Hansa Wardhana',
            age: 20,
            address: 'Sukoharjo',
          },
          {
            id: 2,
            name: 'Sang aji',
            age: 21,
            address:'Sukoharjo',
          },
        ],
      },
      {
        id: 2,
        title: 'GraphQL Introduction Night #2',
        description: 'Introductionary night to GraphQL',
        date: '2021',
        attendants: [
          {
            id: 3,
            name: 'Alfarez',
            age: null,
            address: 'Sukoharjo',
          },
        ],
      },
    ]);
  }

  return database;
}

module.exports = startDatabase;
