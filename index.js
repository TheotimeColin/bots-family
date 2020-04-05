require("dotenv").config()

const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const moment = require('moment')
const Capybara = require('./bots/capybara')
const Pangolin = require('./bots/pangolin')
const Bard = require('./bots/bard')
const Quokka = require('./bots/quokka')
//const Wendigo = require('./bots/wendigo')
//const Ellieth = require('./bots/ellieth')
//const Bridgette = require('./bots/bridgette')

moment.locale('fr')

mongoose.connect(process.env.MONGO);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    const capybaraBot = new Capybara()
    const pangolinBot = new Pangolin()
    const bardBot = new Bard()
    const quokkaBot = new Quokka()
    //const wendigoBot = new Wendigo()
    //const elliethBot = new Ellieth()
    //const bridgetteBot = new Bridgette()
})