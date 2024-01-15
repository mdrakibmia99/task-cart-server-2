const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
const uri  = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@taskmaster.xualaxs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

async function run() {
  try {
    await client.connect();
    const db = await client.db('task-cart');
    const tasksCollection = db.collection('attachments');

    // get all attachment
    app.get('/tasks', async (req, res) => {
      const tasks = await tasksCollection.find({}).toArray();
      res.json(tasks);

    });

    app.post('/upload',  upload.array('attachments'),async (req, res) => {
      try {
        const files = req.files?.map((file) => ({
          filename: file.filename,
          path: file.path,
        }));
        console.log(req?.files,"files value")
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
  res.send('task cart server is Running-->')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
