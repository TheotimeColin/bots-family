const mongoose = require('mongoose')

const BotConfSchema = new mongoose.Schema({
  botId: {
    type: String,
  },
  guildId: {
    type: String
  },
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NamedChannel'
  }]
})

module.exports = mongoose.model('BotConf', BotConfSchema)
