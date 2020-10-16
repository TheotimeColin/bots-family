const Discord = require("discord.js")
const client = new Discord.Client()

const EventManager = require('../../helpers/EventManager')
const EmbedManager = require('../../helpers/EmbedManager')

const CLASSIC = require('./questions/classic')
const REFLECT = require('./questions/reflect')
const ABSURD = require('./questions/absurd')
const SPICY = require('./questions/spicy')

module.exports = class Parrot {
    constructor () {
        this.$state = {
            client: client,
            server: null,
            eventManager: new EventManager(),
            lastMessage: new Date(),
        }

        this.$props = {
            channel: null,
            classic: {
                label: '💬  Questions classiques',
                color: '#fd4293',
                questions: CLASSIC
            },
            reflect: {
                label: '💡  Questions réflexions',
                color: '#5d13f3',
                questions: REFLECT
            },
            absurd: {
                label: '🐸  Questions absurdes',
                color: '#fdfeb1',
                questions: ABSURD
            },
            spicy: {
                label: '🌶  Questions pimentées',
                color: '#ff2d42',
                questions: SPICY
            }
        }

        this.$state.client.login(process.env.PARROT_TOKEN)
        this.$state.client.on('ready', () => this.init())
    }

    init () {
        console.log(`Logged in as ${this.$state.client.user.tag}!`)
        
        this.$state.server = this.$state.client.guilds.cache.find(server => server.name === process.env.SERVER)

        this.initEvents()
    }

    initEvents () {
        this.$state.eventManager.addListener({
            id: 'init',
            event: 'message',
            target: this.$state.client,
            action: (message) => this.onMessage(message)
        })
    }

    onMessage (message) {
        if (message.content === '!question') this.sendMessage(message.channel)
        if (message.content === '!question-classique') this.sendMessage(message.channel, 'classic')
        if (message.content === '!question-pimentée') this.sendMessage(message.channel, 'spicy')
        if (message.content === '!question-réflexion') this.sendMessage(message.channel, 'reflect')
        if (message.content === '!question-absurde') this.sendMessage(message.channel, 'absurd')
    }

    sendMessage (channel, category = 'default') {
        let difference = Math.round((new Date().getTime() - this.$state.lastMessage.getTime()) / 1000)
        if (difference <= 30) {
            channel.send(`Pas si vite ! Attends encore ${30 - difference} secondes avant une nouvelle question.`)
            return
        }

        this.$state.lastMessage = new Date()

        let categories = category == 'default' ? [ this.$props.classic, this.$props.classic, this.$props.reflect, this.$props.absurd ] : [ this.$props[category] ]

        let selectedCategory = categories[Math.floor(Math.random() * categories.length)]

        let messages = selectedCategory.questions
        let selected = messages[Math.floor(Math.random() * messages.length)]

        let embed = new EmbedManager({
            color: selectedCategory.color,
            title: selected,
            fields: {
                'question': {
                    description: selectedCategory.label,
                    enabled: true
                }
            }
        })

        embed.sendTo(channel)
    }
}