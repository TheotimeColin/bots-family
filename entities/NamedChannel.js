const mongoose = require('mongoose')

const NamedChannelConf = new mongoose.Schema({
    id: {
        type: String
    },
    botId: {
        type: String,
    },
    guildId: {
        type: String
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }
})

module.exports = mongoose.model('NamedChannel', NamedChannelConf)
