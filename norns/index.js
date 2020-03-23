const Discord = require("discord.js")
const client = new Discord.Client()

const CONSTANTS = require('../constants')

module.exports = class Norns {
    constructor () {
        this.$state = {
            client: client,
        }

        this.$props = {
            server: null
        }

        this.$state.client.login(process.env.NORNS_TOKEN)
        this.$state.client.on('ready', () => this.init())
    }

    init () {
        console.log(`Logged in as ${this.$state.client.user.tag}!`)
        
        this.$props.server = this.$state.client.guilds.cache.find(server => server.name === process.env.SERVER)

        this.initEvents()
    }

    initEvents () {
        this.$state.client.on("message", message => {
            if (message.content === "!play") {
                new Game({ message }, this)
            }
        })
    }
}

class Game {  
    constructor (props, parent) {
        this.$props = {
            parent: parent,
            message: props.message,
            member: props.message.member,
            author: props.message.author,
            embed: {
                color: 0x0099ff,
                title: `þriár, ór þeim sal er und þolli stendr; Urð héto eina, aðra Verðandi, Sculd ena þriðio;`,
                description: `Trois, venant de la mer,\nqui s'étend sous l'arbre ;\nL'une est appelée Urd,\nVerdandi, l'autre\nLa troisième est Skuld.`,
                thumbnail: { url: 'https://i.imgur.com/FMWtqte.png' },
                fields: [
                    { name: `Urd :`, value: `🗡 Le passé est gravé sur le bois mais les Hommes oublient vite. Est-ce ton cas ?` },
                    { name: `Verdandi :`, value: `⏳ Le temps file entre tes doigts comme une poignée de sable fin, est-il déjà trop tard ?` },
                    { name: `Skuld :`, value: `🔮 Fais-tu confiance aux fils qui te relient à ton destin ?` }
                ]
            }
        }

        this.$state = {
            listeners: [],
            main: null
        }

        this.init()
    }

    init () {
        
        this.startGame()
    }

    startGame () {
        this.$props.message.channel.send({ embed: this.$props.embed }).then(message => {
            this.$state.main = message

            this.$state.main.react('🗡')
            this.$state.main.react('⏳')
            this.$state.main.react('🔮')

            let listener = {
                action: (reaction, user) => this.onReaction(reaction, user),
                target: this.$state.main.createReactionCollector(v => v, { time: 150000 }),
            }

            this.$state.listeners.push(listener)
            listener.target.on('collect', listener.action)
        })
    }

    onReaction (reaction, user) {
        if (this.$props.member.id == user.id) this.playSkuld()
    }

    playSkuld () {
        this.$state.main.reactions.removeAll()

        this.$state.main.edit({ embed: {
            ...this.$props.embed,
            title: `Skuld, le jeu du futur.`,
            description: `Fais-tu confiance aux fils qui te relient à ton destin ?`,
            thumbnail: { url: 'https://i.imgur.com/0ikY249.png' },
            fields: [
                { name: `Voici dix cartes. Derrière 9 d'entres elles se trouvent la prospérité que tu recherches. Derrière l'une d'elles se trouve la mort.`, value: `1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟` }
            ]
        } })
    }

    destroy () {

    }
}