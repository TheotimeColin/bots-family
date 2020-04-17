const Discord = require("discord.js")
const client = new Discord.Client()

const { searchOne } = require('../../helpers/helpers')
const trans = require('./translations.fr')
const BotConf = require('../../entities/BotConf')
const Channel = require('../../entities/Channel')
const NamedChannel = require('../../entities/NamedChannel')
const MessageManager = require('../../helpers/MessageManager')

module.exports = class Panda {
    constructor () {
        this.$props = {
            client: client,
            prefix: '!panda',
            configuration: null,
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
                    case 'reset':
                        this.reset(message); break;
                    case 'init':
                        this.initGetter(message); break;
                    default:
                        message.reply(trans.errors.notFound)
                }
            }
        })
    }

    checkSetup (message) {
        const botId = this.$props.client.user.id
        const guildId = message.guild.id

        return new Promise(async resolve => {
            try {
                if (this.$state.isSetup) resolve(true)

                const configuration = await BotConf.findOne({ botId, guildId }).populate({
                    path: 'channels', populate: { path: 'channel' }
                })

                if (configuration) {
                    this.$state.isSetup = true


                    configuration.dGuild = this.$props.client.guilds.cache.get(configuration.guildId)
                    configuration.dChannels = {}

                    configuration.channels.forEach(channel => {
                        configuration.dChannels[channel.id] = configuration.dGuild.channels.cache.get(channel.channel.id)
                    })

                    this.$props.configuration = configuration

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
                
                let searchChannelId = await this.$managers.message.awaitAnswerTo(trans.setup.whatChannelCookies, {
                    client: this.$props.client,
                    channel: message.channel,
                    from: message.author.id
                })

                const channel = message.guild.channels.cache.get(searchChannelId.replace(/\D+/g, ''))
                const exists = await Channel.findOne({ id: channel.id })
                const channelEntity = exists ? exists : await Channel.create({ id: channel.id })

                const namedChannelEntity = await NamedChannel.create({
                    id: 'cookies', botId, guildId, channel: channelEntity._id
                })
                
                await BotConf.create({ botId, guildId, channels: [ namedChannelEntity._id ] })
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
            await NamedChannel.findByIdAndDelete(channel)
        })

        await BotConf.findOneAndDelete({ botId, guildId })

        this.$state.isSetup = false
        this.$props.configuration = null

        message.channel.send(trans.reset.success)
    }

    initGetter (message) {
        try {
            this.$managers.message.getReactionsTo(trans.getter.title, {
                client: this.$props.client,
                channel: this.$props.configuration.dChannels['cookies'],
                reactions: [
                    { emoji: '🤑', action: () => console.log('lol') }
                ]
            })
        } catch (e) {
            console.error(e)
            message.channel.send(trans.errors.generic)
        }
    }
}