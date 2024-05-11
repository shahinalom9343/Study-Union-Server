const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req,res)=>{
  res.send("Study Union is Running")
})

app.listen(port,()=>{
  console.log(`Study Union server is running on port : ${port}`);
})