const EventManager = require('../../../helpers/EventManager')
const EmbedManager = require('../../../helpers/EmbedManager')

module.exports = class List {

    constructor (parent) {
        this.$parent = parent
    }

    list (channel) {
        const embedManager = new EmbedManager({
            title: `Now playing`,
        })

        if (this.$parent.$state.playing) {
            embedManager.editInfo({
                description: `
                    ▶️ ${this.$parent.$state.playing.title}\n

                    **À venir :**
                ${this.$parent.$state.queue.map((song, i) => `⏩ ${i + 1}. ${song.title}`).join('\n')}
                `
            })
        } else {
            embedManager.editInfo({
                description: `Pas de chanson en cours.`
            })
        }

        embedManager.sendTo(channel)
    }
}