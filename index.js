const express = require('express');
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;




app.use(express.json())
app.use(cors())



app.get('/', (req, res) => {
  res.send('server is running')
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mi7otul.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const collageCollection = client.db("collage-task").collection("collageTaskData")
    const collageCollectionPage = client.db("collage-task").collection("collageinfo")
    const applicationDataCollection = client.db("collage-task").collection("myCollage")

    app.get('/collageData', async (req, res) => {
      const collageData = await collageCollection.find().toArray();
      res.send(collageData);
    })

    app.get('/collageData/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const data = await collageCollection.findOne(filter)
      res.send(data);
    })

    app.get('/collage', async (req, res) => {
      const collage = await collageCollectionPage.find().toArray();
      res.send(collage);
    })

    app.get('/collage/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const data = await collageCollectionPage.findOne(filter)
      res.send(data);
    })
    app.get('/myCollage', async (req, res) => {
      const collage = await applicationDataCollection.find().toArray();
      res.send(collage);
    })

    app.post('/myCollage', async(req, res) => {
      const applationData = req.body;
      const result = await applicationDataCollection.insertOne(applationData);
      res.send(result);
    })

    app.put('/collage/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateStatus = req.body;
      console.log(id)
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          review: updateStatus.review
        },
      };

      const result = await applicationDataCollection.updateOne(filter, updateDoc,options);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`server is running port ${port}`)
})