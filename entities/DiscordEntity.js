const mongoose = require('mongoose')

const DiscordEntityConf = new mongoose.Schema({
    name: {
        type: String
    },
    id: {
        type: String,
    },
    botId: {
        type: String
    },
    guildId: {
        type: String
    },
    type: {
        type: String
    }
})

module.exports = mongoose.model('DiscordEntity', DiscordEntityConf)
