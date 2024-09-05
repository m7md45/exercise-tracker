const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  }
}, {collection: "users"});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;