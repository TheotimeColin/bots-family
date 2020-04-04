const ytdl = require('ytdl-core')
const ytsr = require('ytsr')

const EventManager = require('../../../helpers/EventManager')
const EmbedManager = require('../../../helpers/EmbedManager')

module.exports = class List {

    constructor (parent) {
        this.$parent = parent
    }

    addSong (message) {
        return new Promise(resolve => {
            let search = message.content.replace('!add ', '')
            ytsr(search, { filter: 'audioonly', limit: 1 }, async (err, searchResults) => {
                let result = searchResults.items[0].link
    
                let songInfo = await ytdl.getInfo(result)
                const song = {
                    title: songInfo.title,
                    url: songInfo.video_url,
                    thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
                    author: message.author.username
                }

                console.log(message.author)

                this.onAddSong(message, song)

                resolve(song)
            })
        })
    }

    onAddSong (message, song) {
        const embedManager = new EmbedManager({
            title: `J'ai ajouté cette musique à la playlist, enjoy !`,
            thumbnail: song.thumbnail,
            description: `
                ${song.title}
                ${song.url}
            `
        })

        embedManager.sendTo(message.channel)
    }
}