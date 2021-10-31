const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mern-shop.yuqfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('niloy-tour-agency');
    const serviceCollection = database.collection('services');
    const orderCollection = database.collection('orders');

    //GET ALL Services API
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      services = await cursor.toArray();
      res.send(services);
    });
    

    //GET Single Service API
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
  })

    // POST Service API
    app.post('/services', async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.json(result);
    });

    // Use POST to get data by keys
    app.get('/myOrders/:uid', async (req, res) => {
      const id = req.params.uid;
      const query = { userId: id.toString()  }
      const orders = await orderCollection.find(query).toArray();
      res.json(orders);
    });
 //GET ALL Orders API
 app.get('/orders', async (req, res) => {
  const cursor = orderCollection.find({});
  orders = await cursor.toArray();
  res.send(orders);
});
    // ORDER POST API
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    })

    //ORDER DELETE API 
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
  })

    //UPDATE ORDER API
    app.put('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              orderStatus: "Approved"
          },
      };
      const result = await orderCollection.updateOne(filter, updateDoc, options)
      res.json(result)
  })

  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Niloy Travel Agency server is running');
});

app.listen(port, () => {
  console.log('Server running at port', port);
})