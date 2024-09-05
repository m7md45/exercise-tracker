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
  const id = await User.findById(req.body[":_id"]);
  const description = req.body.description;
  const duration = req.body.duration;
  let date;
  if (!req.body.date) {
    date = new Date();
  } else {
    date = new Date(req.body.date);
  }

  try {
    let exerciseEntry = await Exercise.findById(id["_id"]);

    if (exerciseEntry) {
      // If exercise entry exists, push new log entry to the log array
      exerciseEntry.log.push({
        description,
        duration,
        date,
      });

      const updatedExercise = await exerciseEntry.save();

      res.json({
        _id: updatedExercise._id,
        description:
          updatedExercise.log[updatedExercise.log.length - 1].description,
        duration: updatedExercise.log[updatedExercise.log.length - 1].duration,
        date: updatedExercise.log[updatedExercise.log.length - 1].date,
      });
    } else {
      // If exercise entry does not exist, create a new one
      const newExercise = new Exercise({
        _id: id["_id"],
        log: [
          {
            description,
            duration,
            date,
          },
        ],
      });

      const result = await newExercise.save();

      res.json({
        _id: result._id,
        description: result.log[0].description,
        duration: result.log[0].duration,
        date: result.log[0].date,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

app.get("/api/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
