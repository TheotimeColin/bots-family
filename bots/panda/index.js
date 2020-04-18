const Discord = require("discord.js")
const client = new Discord.Client()

const { searchOne, random } = require('../../helpers/helpers')
const trans = require('./translations.fr')
const BotConf = require('../../entities/BotConf')
const DiscordEntity = require('../../entities/DiscordEntity')
const MessageManager = require('../../helpers/MessageManager')
const EmbedManager = require('../../helpers/EmbedManager')

module.exports = class Panda {
    constructor () {
        this.$props = {
            client: client,
            prefix: '!panda',
            conf: null,
        }

        this.$state = {
            isSetup: false
        }

        this.$managers = {
            message: new MessageManager()
        }

        this.$props.client.login(process.env.PANDA_TOKEN)
        this.$props.client.on('ready', () => this.init())
    }

    init () {
        console.log(`Logged in as ${this.$props.client.user.tag}!`)
        
        this.initEvents()
    }

    initEvents () {
        this.$props.client.on('message', async message => {
            if (message.content.startsWith(this.$props.prefix)) {
                await this.checkSetup(message) 

                if (message.content == this.$props.prefix + '-setup') {
                    this.setup(message)
                    return
                }

                if (!this.$state.isSetup) {
                    message.reply(trans.errors.notSetup)
                    return
                }

                switch (message.content.replace(this.$props.prefix + '-', '')) {
                    case 'reset': this.reset(message); break;
                    case 'init': this.initWelcome(message); break;
                    case 'haiku': new Haiku(message, this.$props); break;
                    case 'soutien': new Support(message, this.$props); break;
                    default: message.reply(trans.errors.notFound)
                }
            }
        })
    }

    checkSetup (message) {

        return new Promise(async resolve => {
            try {
                if (this.$state.isSetup) {
                    resolve(true)
                    return
                }

                const botId = this.$props.client.user.id
                const guildId = message.guild.id

                let storedConf = await BotConf.findOne({ botId, guildId }).populate('channels').populate('roles')
                let conf = {}

                if (storedConf) {
                    this.$state.isSetup = true

                    conf.guild = await this.$props.client.guilds.cache.get(storedConf.guildId)

                    conf.channels = await Promise.all(storedConf.channels.map(channel => {
                        return new Promise(async resolve => {
                            let entity = await conf.guild.channels.cache.get(channel.id)
                            resolve({ name: channel.name, entity })
                        })
                    }))

                    conf.roles = await Promise.all(storedConf.roles.map(role => {
                        return new Promise(async resolve => {
                            let entity = await conf.guild.roles.cache.get(role.id)
                            resolve({ name: role.name, entity })
                        })
                    }))

                    this.$props.conf = conf

                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch (e) {
                console.error(e)
                message.channel.send(trans.errors.generic)
            }
        })
    }

    setup (message) {
        return new Promise(async resolve => {
            try {
                if (this.$state.isSetup) {
                    message.reply(trans.setup.alreadyDone)
                    resolve(false)
                    return
                }

                const botId = this.$props.client.user.id
                const guildId = message.guild.id

                /* WELCOME CHANNEL */
                
                let searchChannelId = await this.$managers.message.awaitAnswerTo(trans.setup.whatChannelWelcome, {
                    client: this.$props.client,
                    channel: message.channel,
                    from: message.author.id
                })

                const channel = message.guild.channels.cache.get(searchChannelId.replace(/\D+/g, ''))
                const channelExists = await DiscordEntity.findOne({ id: channel.id, guildId })
                const channelEntity = channelExists ? channelExists : await DiscordEntity.create({
                    id: channel.id, name: 'welcome', type: 'channel', botId, guildId
                })

                /* HAIKU CHANNEL */
                
                searchChannelId = await this.$managers.message.awaitAnswerTo(trans.setup.whatChannelHaiku, {
                    client: this.$props.client,
                    channel: message.channel,
                    from: message.author.id
                })

                const hChannel = message.guild.channels.cache.get(searchChannelId.replace(/\D+/g, ''))
                const hChannelExists = await DiscordEntity.findOne({ id: hChannel.id, guildId })
                const hChannelEntity = hChannelExists ? hChannelExists : await DiscordEntity.create({
                    id: hChannel.id, name: 'haiku', type: 'channel', botId, guildId
                })

                /* SUPPORT CHANNEL */
                
                searchChannelId = await this.$managers.message.awaitAnswerTo(trans.setup.whatChannelSupport, {
                    client: this.$props.client,
                    channel: message.channel,
                    from: message.author.id
                })

                const sChannel = message.guild.channels.cache.get(searchChannelId.replace(/\D+/g, ''))
                const sChannelExists = await DiscordEntity.findOne({ id: sChannel.id, guildId })
                const sChannelEntity = sChannelExists ? hChannelExists : await DiscordEntity.create({
                    id: sChannel.id, name: 'support', type: 'channel', botId, guildId
                })

                /* PARTICIPANT ROLE */

                let searchRoleId = await this.$managers.message.awaitAnswerTo(trans.setup.whatRoleParticipate, {
                    client: this.$props.client,
                    channel: message.channel,
                    from: message.author.id
                })

                searchRoleId = searchRoleId.replace(/\D+/g, '')
                const role = message.guild.roles.cache.get(searchRoleId)
                const roleExists = await DiscordEntity.findOne({ id: role.id, guildId })
                const roleEntity = roleExists ? roleExists : await DiscordEntity.create({
                    id: role.id, name: 'participant', type: 'role', botId, guildId
                })
                
                await BotConf.create({
                    channels: [ channelEntity._id, hChannelEntity._id, sChannelEntity._id ],
                    roles: [ roleEntity._id ],
                    botId, guildId, 
                })

                message.channel.send(trans.setup.done)
            } catch (e) {
                console.error(e)
                message.channel.send(trans.errors.generic)
            }
        })
    }

    async reset (message) {
        const botId = this.$props.client.user.id
        const guildId = message.guild.id

        const conf = await BotConf.findOne({ botId, guildId })

        conf.channels.forEach(async channel => {
            await DiscordEntity.findByIdAndDelete(channel)
        })

        conf.roles.forEach(async role => {
            await DiscordEntity.findByIdAndDelete(role)
        })

        await BotConf.findOneAndDelete({ botId, guildId })

        this.$state.isSetup = false
        this.$props.conf = null

        message.channel.send(trans.reset.success)
    }

    initWelcome (message) {
        try {
            let embed = new EmbedManager({
                title: trans.welcome.title,
                description: trans.welcome.description,
                fields: {
                    footer: { description: trans.welcome.accept, enabled: true }
                }
            })

            this.$managers.message.getReactionsTo({ embed: embed.getEmbed() } , {
                client: this.$props.client,
                channel: searchOne(this.$props.conf.channels, { name: 'welcome' }, 'entity'),
                infinite: true,
                reactions: [
                    { emoji: '✅', action: async (user) => {
                        let role = searchOne(this.$props.conf.roles, { name: 'participant' }, 'entity')
                        user = await this.$props.conf.guild.members.cache.get(user.id)
                        user.roles.add(role.id)

                        setTimeout(() => {
                            let embed = new EmbedManager({
                                title: trans.welcomePrivate.title,
                                description: trans.welcomePrivate.description,
                                fields: trans.welcomePrivate.program
                            })

                            user.send({ embed: embed.getEmbed() })
                        }, 3000)
                    } }
                ]
            })
        } catch (e) {
            console.error(e)
            message.channel.send(trans.errors.generic)
        }
    }
}

class Haiku {
    constructor (message, props) {
        this.$props = {
            message,
            ...props
        }

        this.$state = {

        }

        this.$managers = {
            message: new MessageManager()
        }

        this.init()
    }

    init () {
        let embed = new EmbedManager(trans.haiku.welcome)

        this.$managers.message.getReactionsTo({ embed: embed.getEmbed() } , {
            client: this.$props.client,
            channel: this.$props.message.channel,
            reactions: [
                { emoji: '✅', action: () => this.onStart() },
                { emoji: '❓', action: () => this.onHelp() },
                { emoji: '🛑', action: () => this.reset() }
            ]
        })
    }

    async onStart () {
        let embed = new EmbedManager(trans.haiku.start)

        let answer = await this.$managers.message.awaitAnswerTo({ embed: embed.getEmbed() } , {
            from: this.$props.message.author.id,
            client: this.$props.client,
            channel: this.$props.message.channel
        })

        this.onSign(answer)
    }

    async onSign (message) {
        let embed = new EmbedManager({
            title: 'Souhaites-tu signer ton écrit ? Si tu veux rester anonyme, clique sur 👁'
        })

        let author = await this.$managers.message.awaitAnswerOrReactionsTo({ embed: embed.getEmbed() } , {
            from: this.$props.message.author.id,
            client: this.$props.client,
            channel: this.$props.message.channel,
            reactions: [
                { emoji: '👁', action: () => this.onRecap(message) },
                { emoji: '🛑', action: () => this.reset() }
            ]
        })

        if (author) this.onRecap(message, author)
    }

    onRecap (message, author) {
        let userMessage = {
            fields: {
                content: { description: `*${message}*` },
                author: { title: author ? '⎯ ' + author : '⎯ anonyme' }
            }
        }

        let embed = new EmbedManager({
            description: `Qu'en penses-tu ? Puis-je le partager aux autres ? C'est anonyme.`,
            ...userMessage
        })

        this.$managers.message.getReactionsTo({ embed: embed.getEmbed() } , {
            client: this.$props.client,
            channel: this.$props.message.channel,
            reactions: [
                { emoji: '✅', action: () => this.onConfirm(userMessage) },
                { emoji: '🛑', action: () => this.reset() }
            ]
        })
    }

    async onConfirm (embed) {
        let channel = searchOne(this.$props.conf.channels, { name: 'haiku' }, 'entity')

        embed = new EmbedManager(embed)
        let result = await channel.send({ embed: embed.getEmbed() })

        await result.react('❤️')

        let confirmed = new EmbedManager(trans.haiku.confirmed)
        this.$props.message.channel.send({ embed: confirmed.getEmbed() })
    }

    onHelp () {
        let embed = new EmbedManager(trans.haiku.help)

        this.$managers.message.getReactionsTo(embed, {
            type: 'embed',
            channel: this.$props.message.channel,
            client: this.$props.client,
            reactions: [
                { emoji: '✅', action: () => this.onStart() }
            ]
        })
    }

    reset () {
        let embed = new EmbedManager(trans.haiku.cancelled)
        embed.sendTo(this.$props.message.channel)

        this.$managers.message.reset()
    }
}

class Support {
    constructor (message, props) {
        this.$props = {
            message,
            ...props
        }

        this.$state = {

        }

        this.$managers = {
            message: new MessageManager()
        }

        this.init()
    }

    init () {
        let embed = new EmbedManager(trans.support.welcome)

        this.$managers.message.getReactionsTo({ embed: embed.getEmbed() } , {
            client: this.$props.client,
            channel: this.$props.message.channel,
            reactions: [
                { emoji: '✅', action: () => this.onQuestionMessage() },
                { emoji: '☑️', action: () => this.onFreeMessage() },
                { emoji: '🛑', action: () => this.reset() }
            ]
        })
    }

    async onQuestionMessage (question = false, more = false) {
        question = question ? question : trans.support.questions[random(0, trans.support.questions.length)]
        
        let embed = new EmbedManager({
            title: question
        })

        if (more) embed.addField('more', { description: trans.support.elaborate })

        let answer = await this.$managers.message.awaitAnswerOrReactionsTo({ embed: embed.getEmbed() } , {
            from: this.$props.message.author.id,
            client: this.$props.client,
            channel: this.$props.message.channel,
            reactions: [
                { emoji: '🔁', action: () => this.onQuestionMessage() },
                { emoji: '🛑', action: () => this.reset() }
            ]
        })

        if (answer && answer.length >= 20) {
            this.onSign(question, answer)
        } else if (answer) {
            this.onQuestionMessage(question, true)
        }        
    }

    async onFreeMessage (more = false) {
        let embed = new EmbedManager({
            title: trans.support.free
        })

        if (more) embed.addField('more', { description: trans.support.elaborate })

        let answer = await this.$managers.message.awaitAnswerOrReactionsTo({ embed: embed.getEmbed() } , {
            from: this.$props.message.author.id,
            client: this.$props.client,
            channel: this.$props.message.channel,
            reactions: [
                { emoji: '🛑', action: () => this.reset() }
            ]
        })
        
        if (answer && answer.length >= 20) {
            this.onSign(false, answer)
        } else if (answer) {
            this.onFreeMessage(true)
        }
    }

    async onSign (question, message) {
        let embed = new EmbedManager({
            title: 'Souhaites-tu signer ton écrit ? Si tu veux rester anonyme, clique sur 👁'
        })

        let author = await this.$managers.message.awaitAnswerOrReactionsTo({ embed: embed.getEmbed() } , {
            from: this.$props.message.author.id,
            client: this.$props.client,
            channel: this.$props.message.channel,
            reactions: [
                { emoji: '👁', action: () => this.onRecap(question, message, false) },
                { emoji: '🛑', action: () => this.reset() }
            ]
        })

        if (author) this.onRecap(question, message, author)
    }

    onRecap (question = false, message, author = false) {
        let userMessage = {
            fields: {
                user: {
                    title: question ? question : 'Bouteille à la mer :',
                    description: `*${message}*`
                },
                author: {
                    title: author ? '⎯ ' + author : '⎯ anonyme'
                }
            }
        }

        let embed = new EmbedManager({
            description: trans.support.share,
            ...userMessage
        })

        this.$managers.message.getReactionsTo({ embed: embed.getEmbed() } , {
            client: this.$props.client,
            channel: this.$props.message.channel,
            reactions: [
                { emoji: '✅', action: () => this.onConfirm(userMessage) },
                { emoji: '🛑', action: () => this.reset() }
            ]
        })
    }

    async onConfirm (embed) {
        let channel = searchOne(this.$props.conf.channels, { name: 'support' }, 'entity')

        embed = new EmbedManager(embed)
        let result = await channel.send({ embed: embed.getEmbed() })

        await result.react('❤️')

        let confirm = new EmbedManager(trans.haiku.confirmed)
        this.$props.message.channel.send({ embed: confirm.getEmbed() })
    }

    reset () {
        let embed = new EmbedManager(trans.haiku.cancelled)
        embed.sendTo(this.$props.message.channel)

        this.$managers.message.reset()
    }
}