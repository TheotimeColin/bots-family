const mongoose = require('mongoose')

const ChannelSchema = new mongoose.Schema({
  id: {
    type: String,
  }
})

module.exports = mongoose.model('Channel', ChannelSchema)