const Discord = require("discord.js")
const client = new Discord.Client()

const CONSTANTS = require('../constants')

module.exports = class Capybara {
    constructor () {
        this.$state = {
            client: client,
        }

        this.$props = {
            server: null,
            spottedChannel: null
        }

        this.$state.client.login(process.env.PANGOLIN_TOKEN)
        this.$state.client.on('ready', () => this.init())
        
    }

    init () {
        console.log(`Logged in as ${this.$state.client.user.tag}!`)

        this.$props.server = this.$state.client.guilds.cache.find(server => server.name === CONSTANTS.SERVER_NAME)
        this.$props.spottedChannel = this.$props.server.channels.cache.find(channel => channel.name === CONSTANTS.SPOTTED_CHANNEL)

        this.initEvents()
    }

    initEvents () {
        this.$state.client.on("message", message => {
            if (message.content === "!spotted") {
                new Spotted({ message }, this)
            }
        })
    }
}

class Spotted {  
    constructor (props, parent) {
        this.$props = {
            parent: parent,
            message: props.message,
            member: props.message.member,
            author: props.message.author
        }

        this.$state = {
            spottedMessage: null,
            messageListener: null,
            reactionListener: null
        }

        this.init()
    }

    init () {
        this.$props.message.reply(`Que souhaites-tu partager en anonyme ?\n**Merci de rester bienveillant et de te limiter à 1 message par jour.**`)
        
        this.$state.messageListener = (message) => this.onMessage(message)
        this.$props.parent.$state.client.on('message', this.$state.messageListener)
    }

    onMessage (message) {
        if (message.author == this.$props.author && message.channel == this.$props.message.channel) {
            this.$state.spottedMessage = message
            
            const newEmbed = new Discord.MessageEmbed({
                title: `Je vais publier ce message sur le channel #🧨-spotted, tu en es certain ?`,
                description: `"${this.$state.spottedMessage}"`,
            })

            message.reply(newEmbed).then(message => {
                message.react('✅')
                message.react('❌')

                this.$state.reactionCollector = message.createReactionCollector(v => v, { time: 150000 });
                this.$state.reactionListener = (reaction, user) => this.onReaction(reaction, user, message)
                this.$state.reactionCollector.on('collect', this.$state.reactionListener)
            })
        }
    }

    onReaction (reaction, user, message) {
        if (this.$props.author.id == user.id) {
            if (reaction.emoji.name == '✅') {
                message.channel.send(`Et voilà, c'est fait !`)

                const newEmbed = new Discord.MessageEmbed({
                    title: `Quelqu'un m'a demandé de vous transmettre ce message`,
                    description: `"${this.$state.spottedMessage}"`,
                })

                this.$props.parent.$props.spottedChannel.send(newEmbed)
            } else {
                message.channel.send(`D'accord, je laisse tomber.`)
            }

            this.destroy()
        }
    }

    destroy () {
        if (this.$state.messageListener) this.$props.parent.$state.client.removeListener('message', this.$state.messageListener)
        if (this.$state.reactionListener) this.$state.reactionCollector.removeListener('collect', this.$state.reactionListener)
    }
}