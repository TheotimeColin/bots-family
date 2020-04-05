const mongoose = require('mongoose')

const CredentialsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  content: {
    type: String
  }
})

module.exports = mongoose.model('Credentials', CredentialsSchema)
