require("dotenv").config()

const Capybara = require('./capybara')
const Pangolin = require('./pangolin')
const Norns = require('./norns')

const capybaraBot = new Capybara()
const pangolinBot = new Pangolin()
const nornsBot = new Norns()