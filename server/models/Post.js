const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',                        
    required: true
  }
});

module.exports = mongoose.model('Posts', postSchema, 'Posts');