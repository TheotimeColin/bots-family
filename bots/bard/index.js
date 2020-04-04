const R = require('./resources')
const LIBRARY = require('./../../db/songs.json')

const ytdl = require('ytdl-core')
const fs = require('fs')
const Discord = require("discord.js")
const client = new Discord.Client()

const EventManager = require('../../helpers/EventManager')
const EmbedManager = require('../../helpers/EmbedManager')
const ListAction = require('./actions/list')
const AddAction = require('./actions/add')

module.exports = class Bard {
    constructor () {
        this.$props = {
            client: client,
            server: null,
            audioChannel: null,
            textChannel: null,
            connection: null,
            dispatcher: null,
            eventManager: new EventManager(),
            addAction: new AddAction(this),
            listAction: new ListAction(this)
        }

        this.$state = {
            library: LIBRARY,
            queue: [],
            playing: null,
            isPlaying: false
        }

        console.log(this.$state.library)

        this.$props.client.login(process.env.BARD_TOKEN)
        this.$props.client.on('ready', () => this.init())
    }

    async init () {
        console.log(`Logged in as ${this.$props.client.user.tag}!`)
        
        this.$props.server = this.$props.client.guilds.cache.find(server => server.name === process.env.SERVER)
        this.$props.audioChannel = this.$props.server.channels.cache.find(channel => channel.name === R.AUDIO_CHANNEL)
        this.$props.textChannel = this.$props.server.channels.cache.find(channel => channel.name === R.TEXT_CHANNEL)

        const connection = await this.$props.audioChannel.join()
        this.$props.connection = connection

        if (this.$state.library.songs.length > 0) this.play()

        this.initEvents()
    }

    initEvents () {
        this.$props.eventManager.addListener({
            id: 'init',
            event: 'message',
            target: this.$props.client,
            action: (message) => this.onMessage(message)
        })
    } 

    async onMessage (message) {
        if (message.content.includes('!add')) {
            let song = await this.$props.addAction.addSong(message)
            if (song) {
                this.$state.library.songs.push(song)
                this.$state.queue.push(song)

                fs.writeFileSync('./db/songs.json', JSON.stringify(this.$state.library, null, 2))
                
                if (!this.$state.isPlaying) this.play(true)
            }
        }

        if (message.content.includes('!list')) {
            this.$props.listAction.list(message.channel)
        }

        if (message.content.includes('!next')) this.play()
    }

    play (add = false) {
        this.$state.isPlaying = true

        if (this.$state.queue.length <= 0) this.$state.queue = this.$state.library.songs.slice().sort(() => .5 - Math.random())

        this.$state.playing = this.$state.queue[0]
        this.$state.queue.shift()

        this.$props.dispatcher = this.$props.connection.play(ytdl(this.$state.playing.url, { filter: "audioonly" }))

        if (!add) this.onPlay()

        this.$props.dispatcher.on("finish", () => this.play())
    }

    onPlay () {
        if (!this.$state.playing) return

        const embedManager = new EmbedManager({
            title: `Now playing`,
            thumbnail: this.$state.playing.thumbnail,
            description: `
                ${this.$state.playing.title}
                ${this.$state.playing.url}
            `
        })

        embedManager.addField('author', {
            description: `Ajouté par ${this.$state.playing.author}`
        })

        embedManager.sendTo(this.$props.textChannel)
    }
}