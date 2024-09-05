const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the user schema
const exerciseSchema = new Schema({
  _id: { type: String },
  log: [{
    _id: false,
    description: { type: String, required: true },
    duration: { type: String, required: true },
    date: { type: Date }
  }]
}, {collection: "exercise"}, {versionKey: false});


// Create the model
const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;
