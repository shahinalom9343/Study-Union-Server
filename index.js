const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin:['http://localhost:5173'],
  credentials:true,
  optionSuccessStatus : 200,
}

// middleware
app.use(cors(corsOptions))
app.use(express.json())

// mongodb driver code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.43teffq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const studyCollection = client.db("studyUnion").collection("assignments");
    const submittedCollection = client.db("studyUnion").collection("submittedAssignments");

    // get all assignments
    app.get("/assignments", async(req,res)=>{
      const cursor = studyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // get submitted assignments
    app.get("/mysubmitted", async(req,res)=>{
      const cursor = submittedCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // get specific assignment for assignment details
    app.get("/assignments/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await studyCollection.findOne(query);
      res.send(result);
    })
    
    // update assignment info
    app.put("/assignments/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
            const options = {upsert : true};
      const updatedInfo = req.body;
      const updated = {
        $set:{
           titleName : updatedInfo.titleName,
           marks: updatedInfo.marks,
           thumbnail: updatedInfo.thumbnail,
           difficulty: updatedInfo.difficulty,
           descriptions: updatedInfo.descriptions,
           time: updatedInfo.time,
           visitors: updatedInfo.visitors,
        }
      }
      const result = await studyCollection.updateOne(filter,updated,options);
      res.send(result);
      
    })

    // delete assignment
    app.delete("/assignments/:id",async(req,res)=>{
      const id = req.params.id;
      // console.log(id);
      const query ={_id: new ObjectId(id)};
      const result = await studyCollection.deleteOne(query);
      res.send(result);
    })


    // post created assignment
    app.post("/assignments",async(req,res)=>{
      const newAssignment = req.body;
      const result = await studyCollection.insertOne(newAssignment);
      res.send(result);
    })

    // post submitted assignments
    app.post("/mysubmitted",async(req,res)=>{
      const newSubmittedAssignment = req.body;
      const result = await submittedCollection.insertOne(newSubmittedAssignment);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res)=>{
  res.send("Study Union is Running")
})

app.listen(port,()=>{
  console.log(`Study Union server is running on port : ${port}`);
})