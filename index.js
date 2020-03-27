require("dotenv").config()

const Capybara = require('./bots/capybara')
const Pangolin = require('./bots/pangolin')
const Norns = require('./bots/norns')
const Ellieth = require('./bots/ellieth')

const capybaraBot = new Capybara()
const pangolinBot = new Pangolin()
const nornsBot = new Norns()
const elliethBot = new Ellieth()