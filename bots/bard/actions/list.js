const EventManager = require('../../../helpers/EventManager')
const EmbedManager = require('../../../helpers/EmbedManager')

module.exports = class List {

    constructor (parent) {
        this.$parent = parent
    }

    list (channel) {
        const embedManager = new EmbedManager({
            title: `Now playing`,
            description: `
                ▶️ ${this.$parent.$state.playing.title}\n

                **À venir :**
            ${this.$parent.$state.queue.map((song, i) => `⏩ ${i + 1}. ${song.title}`).join('\n')}
            `
        })

        embedManager.sendTo(channel)
    }
}