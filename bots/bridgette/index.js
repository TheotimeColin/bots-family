const Discord = require("discord.js")
const client = new Discord.Client()

const EventManager = require('../../helpers/EventManager')
const EmbedManager = require('../../helpers/EmbedManager')

const R = require('./resources')

module.exports = class Bridgette {
    constructor () {
        this.$state = {
            client: client,
            server: null,
            eventManager: new EventManager(),
            awaitingResponse: true,
            isQuiet: false,
            quietRounds: 0,
            messages: R.MESSAGES.map(message => ({
                content: message,
                done: false
            }))
        }

        this.$props = {
            channel: null
        }

        this.$state.client.login(process.env.BRIDGETTE_TOKEN)
        this.$state.client.on('ready', () => this.init())
    }

    init () {
        console.log(`Logged in as ${this.$state.client.user.tag}!`)
        
        this.$state.server = this.$state.client.guilds.cache.find(server => server.name === process.env.SERVER)
        this.$props.channel = this.$state.server.channels.cache.find(channel => channel.name === R.CHANNEL)

        this.initEvents()
    }

    initEvents () {
        setInterval(() => {
            if (!this.$state.awaitingResponse && this.$state.isQuiet) {
                this.$state.awaitingResponse = true
                this.$state.isQuiet = false
                this.sendMessage()
            }

            if (!this.$state.awaitingResponse) this.$state.quietRounds += 1

            if (this.$state.quietRounds > 40) {
                this.$state.isQuiet = true
                this.$state.quietRounds = 0
            }
        }, 5000)

        this.$state.eventManager.addListener({
            id: 'init',
            event: 'message',
            target: this.$state.client,
            action: (message) => this.onMessage(message)
        })
    }

    onMessage (message) {
        if (message.author.id !== this.$state.client.user.id && message.channel.id == this.$props.channel.id) {
            this.$state.awaitingResponse = false
            this.$state.quietRounds = 0
            this.$state.isQuiet = false
        }

        if (message.channel.id == this.$props.channel.id && message.content === '!question') {
            this.$state.awaitingResponse = true
            this.$state.isQuiet = false
            this.sendMessage()
        }

        if (message.channel.id == this.$props.channel.id && message.content === '!reset') {
            this.$state.messages = this.$state.messages.map(m => ({ ...m, done: false }))
        }
    }

    sendMessage () {
        let messages = this.$state.messages.filter(m => !m.done)
        if (messages.length == 0) {
            this.$state.messages = this.$state.messages.map(m => ({ ...m, done: false }))
            messages = this.$state.messages
        }

        let selected = messages[Math.floor(Math.random() * messages.length)]
        selected.done = true

        let message = this.$props.channel.send({ embed: {
            title: selected.content
        } })
    }
}