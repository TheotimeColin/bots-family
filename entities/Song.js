const mongoose = require('mongoose')

const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  author: {
    type: String
  }
})

module.exports = mongoose.model('Song', SongSchema)
