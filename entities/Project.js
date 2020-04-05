const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    channelId: {
        type: String
    },
    folderId: {
        type: String
    },
    lastModifications: {
        type: Date
    }
})

module.exports = mongoose.model('Project', ProjectSchema)
