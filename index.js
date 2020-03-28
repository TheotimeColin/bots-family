require("dotenv").config()

const Capybara = require('./bots/capybara')
const Pangolin = require('./bots/pangolin')
const Wendigo = require('./bots/wendigo')
const Ellieth = require('./bots/ellieth')
const Bridgette = require('./bots/bridgette')

const capybaraBot = new Capybara()
const pangolinBot = new Pangolin()
const wendigoBot = new Wendigo()
const elliethBot = new Ellieth()
const bridgetteBot = new Bridgette()