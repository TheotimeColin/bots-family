const EventManager = require('./EventManager')
const { getId } = require('./helpers')

module.exports = class MessageManager {

    constructor () {
        this.$props = {}
        this.$state = {}
        this.$managers = {
            event: new EventManager()
        }
    }

    awaitAnswerTo (text, { client, channel, from }) {
        return new Promise(resolve => {
            const id = getId()
            channel.send(text)

            this.$managers.event.addListener({
                id: id,
                event: 'message',
                target: client,
                action: (message) => {
                    if (message.author.id == from) {
                        this.$managers.event.removeListener(id)
                        resolve(message.content)
                    }
                }
            })
        })
    }

    async getReactionsTo (text, { client, channel, reactions }) {
        const id = getId()
        const sent = await channel.send(text)

        reactions.forEach(reaction => {
            sent.react(reaction.emoji)
        })

        this.$managers.event.addReactionListener({
            id: id,
            target: sent,
            action: (receivedReaction, user) => {
                if (user.id !== sent.author.id) {
                    reactions.forEach(reaction => {
                        if (receivedReaction.emoji.name === reaction.emoji) reaction.action()
                    })
                }
            }
        })
    }
}