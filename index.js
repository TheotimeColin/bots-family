require("dotenv").config()

const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const moment = require('moment')
const Panda = require('./bots/panda')
const Quokka = require('./bots/quokka')
const Parrot = require('./bots/parrot')
// const Capybara = require('./bots/capybara')
// const Pangolin = require('./bots/pangolin')
// const Bard = require('./bots/bard')
//const Wendigo = require('./bots/wendigo')
//const Ellieth = require('./bots/ellieth')
//const Bridgette = require('./bots/bridgette')

moment.locale('fr')

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    // const capybaraBot = new Capybara()
    // const pangolinBot = new Pangolin()
    // const bardBot = new Bard()
    const quokkaBot = new Quokka()
    const parrotBot = new Parrot()
    // const pandaBot = new Panda()
    //const wendigoBot = new Wendigo()
    //const elliethBot = new Ellieth()
    //const bridgetteBot = new Bridgette()
})