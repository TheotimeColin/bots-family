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
                    if (message.author.id == from && message.channel.id == channel.id) {
                        this.$managers.event.removeListener(id)
                        resolve(message.content)
                    }
                }
            })
        })
    }

    async getReactionsTo (text, { channel, reactions, type, infinite = false }) {
        const id = getId()
        let sent = null

        if (type == 'embed') {
            sent = await text.sendTo(channel)
        } else {
            sent = await channel.send(text)
        }

        reactions.forEach(reaction => {
            sent.react(reaction.emoji)
        })

        this.$managers.event.addReactionListener({
            id: id,
            target: sent,
            action: (receivedReaction, user) => {
                if (user.id !== sent.author.id) {
                    if (!infinite) this.$managers.event.removeListener(id)
                    
                    reactions.forEach(reaction => {
                        if (receivedReaction.emoji.name === reaction.emoji) reaction.action(user)
                    })
                }
            }
        })
    }

    awaitAnswerOrReactionsTo (text, { client, channel, from, reactions, type }) {
        return new Promise(async resolve => {
            const id = getId()
            let sent = null

            if (type == 'embed') {
                sent = await text.sendTo(channel)
            } else {
                sent = await channel.send(text)
            }

            reactions.forEach(reaction => {
                sent.react(reaction.emoji)
            })
    
            this.$managers.event.addReactionListener({
                id: id,
                target: sent,
                action: (receivedReaction, user) => {
                    if (user.id !== sent.author.id) {
                        this.$managers.event.removeListener(id)
                        
                        reactions.forEach(reaction => {
                            if (receivedReaction.emoji.name === reaction.emoji) reaction.action(user)
                        })

                        resolve(false)
                    }
                }
            })

            this.$managers.event.addListener({
                id: id,
                event: 'message',
                target: client,
                action: (message) => {
                    if (message.author.id == from && message.channel.id == channel.id) {
                        this.$managers.event.removeListener(id)
                        resolve(message.content)
                    }
                }
            })
        })
    }

    reset () {
        this.$managers.event.reset()
    }
}