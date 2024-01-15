const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); 
const uri  = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@taskcart.ijdx8nu.mongodb.net/taskCart?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



async function run() {
  try {
    await client.connect();
    const db = await client.db('taskCart');
    const tasksCollection = db.collection('attachments');

    // get all attachment
    app.get('/tasks', async (req, res) => {
      try {
        const tasks = await tasksCollection.find({}).toArray();
        res.json(tasks);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
      

    });

    app.post('/upload',async (req, res) => {
      try {
        const files = req.body;
        const result = await tasksCollection.insertOne({files});
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

  } finally {
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send(`${uri} task cart server is Running-->`)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
