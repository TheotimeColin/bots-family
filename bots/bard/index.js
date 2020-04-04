const R = require('./resources')
const Song = require('../../entities/Song')

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
            library: [],
            queue: [],
            playing: null,
            isPlaying: false
        }

        this.$props.client.login(process.env.BARD_TOKEN)
        this.$props.client.on('ready', () => this.init())
    }

    async init () {
        console.log(`Logged in as ${this.$props.client.user.tag}!`)
        
        this.$props.server = this.$props.client.guilds.cache.find(server => server.name === process.env.SERVER)
        this.$props.audioChannel = this.$props.server.channels.cache.find(channel => channel.name === R.AUDIO_CHANNEL)
        this.$props.textChannel = this.$props.server.channels.cache.find(channel => channel.name === R.TEXT_CHANNEL)

        this.connect()

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
        if (message.channel.id === this.$props.textChannel.id) {

            if (message.content == '!connect') {
                this.connect()
            }

            if (this.$props.connection) {
                if (message.content.includes('!add')) {
                    this.add(message)
                }

                if (message.content == '!list') {
                    this.$props.listAction.list(message.channel)
                }

                if (message.content == '!next') this.play()

                if (message.content == '!shuffle') this.shuffle()
            
                if (message.content.includes('!remove')) this.remove(message)

                if (message.content == '!reset' && message.author.id === process.env.ADMIN_ID) this.reset()
            }
        }
    }

    async add (message) {
        let song = await this.$props.addAction.addSong(message)
        if (song) {
            await Song.create(song)
            
            let position = Math.round(Math.min(Math.random() * this.$state.queue.length) + 2)
            this.$state.queue.splice(Math.min(position, 5), 0, song)
            
            if (!this.$state.isPlaying) this.play(true)
        }
    }

    async connect () {
        const connection = await this.$props.audioChannel.join()
        this.$props.connection = connection

        this.play()
    }

    async remove (message) {
        let search = message.content.replace('!remove ', '')
        let result = await Song.findOneAndDelete({ "title" : { $regex: search, $options: 'i' } })
        
        if (!result) {
            const embedManager = new EmbedManager({
                title: `Je n'ai pas trouvé la chanson à supprimer.`
            })

            embedManager.sendTo(this.$props.textChannel)
        } else {
            const embedManager = new EmbedManager({
                title: `Chanson supprimée.`,
                description: `${result.title}`
            })

            embedManager.sendTo(this.$props.textChannel)

            this.$state.queue = this.$state.queue.filter(song => !song.title.toLowerCase().includes(search))
            
            console.log(this.$state.playing.title, result.title)
            if (this.$state.playing.title === result.title) this.play()
        }
    }

    async play (add = false) {
        this.$state.isPlaying = true

        if (this.$state.queue.length <= 0) {
            this.$state.library = await Song.find()
            this.$state.queue = this.$state.library.slice().sort(() => .5 - Math.random())
        }

        this.$state.playing = this.$state.queue[0]
        this.$state.queue.push(this.$state.playing)
        this.$state.queue.shift()

        if (this.$state.playing) {
            this.$props.dispatcher = this.$props.connection.play(ytdl(this.$state.playing.url, { filter: "audioonly" }))

            if (!add) this.onPlay()

            this.$props.dispatcher.on("finish", () => this.play())
        }
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

    shuffle () {
        this.$state.isPlaying = false
        this.$state.queue = []
        this.$state.playing = null
        
        this.play()
    }

    reset () {

    }
}