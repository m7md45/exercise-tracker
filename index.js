const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");
const User = require("./models/users.js");
const Exercise = require("./models/exercise.js");
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
const conn = process.env.db_conn;
mongoose.connect(conn);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async (req, res) => {
  const username = req.body.username;

  try {
    // Create a new user document
    const newUser = new User({ username });
    // Save the user document
    const result = await newUser.save();

    res.json({
      _id: result._id,
      username: result.username,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({error: err });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.body[":_id"];
  const description = req.body.description;
  const duration = req.body.duration;
  let date;
  if(!req.body.date){
    date = new Date();
  }else{
    date = new Date(req.body.date);
  }

  try{
    const newExercise = new Exercise({
      id,
      description,
      duration,
      date
    });
    const result = await newExercise.save();

    res.json({
      _id: result.id,
      description: result.description,
      duration: result.duration,
      date: result.date
    })
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({error: err });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
