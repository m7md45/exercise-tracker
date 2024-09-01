const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
//connection
const conn = process.env.db_conn;
const client = new MongoClient(conn);
const db = client.db('exercise_tracker');
const users = db.collection('users');
const exercise = db.collection('exercise');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async (req, res) => {
  const username = req.body.username;
  try {
    const result = await users.insertOne({
      username: username
    })
    const insertedId = result.insertedId;
    res.json({
      _id: insertedId,
      username: username
    });
  }catch(err){
    console.log(err)
  }
 })



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
