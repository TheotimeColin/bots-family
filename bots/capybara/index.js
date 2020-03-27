const Discord = require("discord.js")
const client = new Discord.Client()

const CONSTANTS = require('../../constants')
const QUESTIONS = require('./questions')

module.exports = class Capybara {
    constructor () {
        this.$state = {
            client: client
        }

        this.$state.client.login(process.env.CAPYBARA_TOKEN)
        this.$state.client.on('ready', () => this.init())
    }

    init () {
        console.log(`Logged in as ${this.$state.client.user.tag}!`)

        this.initEvents()
    }

    initEvents () {
        this.$state.client.on("message", message => {
            if (message.content === "!choix" || message.content === "!test") {

                new Quizz({
                    test: message.content === "!test",
                    message: message
                }, this)
            }
        })
    }
}

class Quizz {  
    constructor (props, parent) {
        this.$props = {
            parent: parent,
            test: props.test,
            message: props.message,
            member: props.message.member,
            author: props.message.author
        }
        
        console.log('rebuild')

        this.$state = {
            started: false,
            questions: QUESTIONS.sort(() => Math.random() - 0.5).slice(0, 10),
            embed: new Discord.MessageEmbed({
                color: '#EF476F',
                title: `Moi, grand Maître Capybara, vais choisir ta Maison...`,
                description: 'Je perçois déjà vers quelle Maison te diriger... Mais je vais quand même te poser quelques questions pour en être certain.\n\nApaise ton esprit, concentre-toi et réponds avec la plus grande sincérité possible.\n\n**Es-tu prêt(e) ?**',
                footer: { text: 'Pour répondre, clique ci-dessous'}
            }),
            main: null,
            points: {
                1: 0,
                2: 0,
                3: 0
            }
        }

        this.init()
    }

    init () {
        if (this.$props.member.roles.cache.some(role => CONSTANTS.ROLES.includes(role.name)) && !this.$props.test) {
            this.$props.message.reply('Tu as déjà une Maison !')
        } else {
            this.$props.message.channel.send(this.$state.embed).then((message) => {
                this.$state.main = message
                this.$state.main.react('🆗')

                const collector = this.$state.main.createReactionCollector((v) => v, { time: 150000 })
                collector.on('collect', (reaction, user) => {
                    if (this.$props.member.id == user.id && !this.$state.started) {
                        this.$state.started = true
                        this.startQuizz()
                    }
                })
            }).catch()
        }
    }

    async startQuizz() {
        this.$state.main.reactions.removeAll()

        let i = 0

        for (const question of this.$state.questions) {
            i += 1

            await this.askQuestion(question, i)
            this.$state.main.reactions.removeAll()
        }

        this.giveResult()
    }

    askQuestion (question, i) {
        return new Promise((resolve, reject) => {
            const options = question.options.sort(() => Math.random() - 0.5)

            const newEmbed = new Discord.MessageEmbed({
                ...this.$state.embed,
                description: `Suis ton instinct, ne réfléchis pas trop. La Maison qui te correspond le mieux est gravée en toi, je le sens.`,
                footer: { text: `Question ${i} / ${this.$state.questions.length}` },
                fields: [{
                    name: `\u200B`,
                    value: `**${question.title}**`
                }, {
                    name: `\u200B`,
                    value: options.map((v) => `${v.reaction} **${v.title}**`).join('\n')
                }]
            })

            this.$state.main.edit(newEmbed)
            
            options.forEach(option => {
                this.$state.main.react(option.reaction)
            })
            
            const collector = this.$state.main.createReactionCollector((v) => v, { time: 150000 })
            collector.on('collect', (reaction, user) => {
                if (this.$props.member.id == user.id) {
                    options.forEach(option => {
                        if (option.reaction == reaction.emoji.name) {
                            this.$state.points[option.house] += question.value
                            resolve()
                        }
                    })
                }
            })
        })
    }

    giveResult () {
        let results = []
        let highest = 0

        Object.keys(this.$state.points).forEach(house => {
            const value = this.$state.points[house]

            if (value > highest) results = []
            
            if (value >= highest) {
                highest = value
                results.push(house)
            }
        })

        let finalResult = results[Math.floor(Math.random() * results.length)]

        const newEmbed = new Discord.MessageEmbed({
            ...this.$state.embed,
            title: CONSTANTS.RESULTS[Math.floor(Math.random() * CONSTANTS.RESULTS.length)],
            description: `${this.$props.author.toString()},\ntu fais désormais partie des **${CONSTANTS.HOUSES[finalResult]}** !`,
            thumbnail: {
                url: this.$props.author.avatarURL(),
            },
            footer: { text: CONSTANTS.VALUES[finalResult] }
        })
        
        this.$state.main.edit(newEmbed)

        if (!this.$props.test) {
            const permissionRole = this.$props.message.guild.roles.cache.find(role => role.name === CONSTANTS.PERMISSION_ROLE)
            this.$props.member.roles.remove(permissionRole.id)

            const role = this.$props.message.guild.roles.cache.find(role => role.name === CONSTANTS.ROLES[finalResult - 1])
            this.$props.member.roles.add(role.id)

            const channel = this.$props.parent.$state.client.channels.cache.find(channel => channel.name === CONSTANTS.ROOMS[finalResult])

            channel.send(`${CONSTANTS.HOUSES[finalResult]}, je vous demande d'accueillir ${this.$props.author.toString()} qui intègre votre Maison !`)
        }
    }
}