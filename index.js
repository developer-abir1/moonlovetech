const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0huctp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollation = client.db('moonlovetech').collection('product');

    app.get('/products', async (req, res) => {
      const cousor = productCollation.find({});
      const product = await cousor.toArray();
      res.send({ status: 'success', data: product });
    });
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await productCollation.findOne(query);
      res.send(booking);
    });

    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await productCollation.insertOne(product);
      res.send(result);
    });
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollation.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    console.log('database is connected');
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World! how to do work in my ');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
