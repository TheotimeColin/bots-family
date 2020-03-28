const Discord = require("discord.js")
const client = new Discord.Client()

const EventManager = require('../../helpers/EventManager')
const EmbedManager = require('../../helpers/EmbedManager')

const R = require('./resources')
const ALCHEMY = require('./alchemy')
const CREATURES = require('./creatures')
const DIVINATION = require('./divination')

module.exports = class Ellieth {
    constructor () {
        this.$state = {
            client: client,
            server: null,
            eventManager: new EventManager()
        }

        this.$props = {
            channel: null
        }

        this.$state.client.login(process.env.ELLIETH_TOKEN)
        this.$state.client.on('ready', () => this.init())
    }

    init () {
        console.log(`Logged in as ${this.$state.client.user.tag}!`)
        
        this.$state.server = this.$state.client.guilds.cache.find(server => server.name === process.env.SERVER)
        this.$props.channel = this.$state.server.channels.cache.find(channel => channel.name === R.TEST_CHANNEL)

        this.initEvents()
    }

    initEvents () {
        this.$state.eventManager.addListener({
            id: 'init',
            event: 'message',
            target: this.$state.client,
            action: (message) => this.onMessage(message)
        })
    }

    onMessage (message) {
        if (message.content === "!exam" && message.channel.id === this.$props.channel.id) {
            if (message.member.roles.cache.find((r) => r.name === R.PLAYED_ROLE)) {
                message.reply(`vous avez déjà passé l'examen d'admission.`)
            } else {
                new Quizz({ message }, this)
            }
        }

        // if (message.content === "!blanc") new Quizz({ message, test: true }, this)
    }
}

class Quizz {  
    constructor (props, parent) {
        this.$props = {
            parent: parent,
            test: props.test ? true : false,
            message: props.message,
            member: props.message.member,
            author: props.message.author,
            easyQuestions: 3,
            hardQuestions: 1,
            admissionPoints: 8
        }

        this.$state = {
            main: null,
            eventManager: new EventManager(),
            embedManager: new EmbedManager({
                color: '#f7b763',
                title: `🦉 Académie de Magie de Clerbonne`,
                description: `L'examen se déroule en **trois catégories**. Il y a **${this.$props.easyQuestions + this.$props.hardQuestions} questions** par catégorie. Cela ne devrait pas durer plus de 5 minutes au total.
                
                **${ALCHEMY.title}**
                **${CREATURES.title}**
                **${DIVINATION.title}**
                
                Pour être admis(e), vous devez obtenir au moins **${this.$props.admissionPoints} points**. Les futurs étudiant(e)s remportent **30 amulettes** en bonus.
                
                **${this.$props.author.toString()}, êtes-vous prêt(e) ?**`
            }),
            category: 'alchemy',
            categories: {
                'alchemy': { main: ALCHEMY, points: 0 },
                'creatures': { main: CREATURES, points: 0 },
                'divination': { main: DIVINATION, points: 0 }
            }
        }

        this.$state.embedManager.addFields({
            'question': { enabled: false },
            'answers': { enabled: false },
            'steps':  { enabled: false },
            'admission': { enabled: false },
            'results': { enabled: false }
        })

        this.init()
    }

    async init () {
        this.$state.main = await this.$state.embedManager.sendTo(this.$props.message.channel)

        this.$state.main.react('🆗')

        this.$state.eventManager.addListener({
            id: 'start-quizz',
            event: 'collect',
            target: this.$state.main.createReactionCollector(v => v, { time: 150000 }),
            action: (reaction, user) => this.onStartQuizz(reaction, user)
        })
    }

    async onStartQuizz (reaction, user) {
        if (reaction.emoji.name === '🆗' && this.$props.member.id == user.id) {
            this.$state.eventManager.removeListener('start-quizz')
            this.$state.main.reactions.removeAll()

            if (!this.$props.test) {
                const role = this.$props.message.guild.roles.cache.find(role => role.name === R.PLAYED_ROLE)
                this.$props.member.roles.add(role.id)
            }

            for (const category of ['alchemy', 'creatures', 'divination']) {
                this.$state.category = category
                
                await new Promise(resolve => this.startCategory(this.$state.categories[this.$state.category].main, resolve))
            }

            this.endGame()
        }
    }

    async startCategory (category, resolve) {
        this.$state.embedManager.editInfo({
            title: category.title,
            color: category.color,
            description: `Bonne chance. Il y a ${this.$props.easyQuestions + this.$props.hardQuestions} questions dans cette catégorie.`
        })

        let questions = [
            ...category.questions.filter(c => c.level == 1).sort(() => Math.random() - 0.5).slice(0, this.$props.easyQuestions),
            ...category.questions.filter(c => c.level == 2).sort(() => Math.random() - 0.5).slice(0, this.$props.hardQuestions)
        ]

        let i = 0
        for (const question of questions) {
            i += 1

            await this.askQuestion(question, i)
            this.$state.main.reactions.removeAll()
        }

        resolve()
    }

    askQuestion (question, i) {
        return new Promise(async resolve => {
            let options = question.options
            if (!question.numbered) options = options.sort(() => Math.random() - 0.5)

            this.$state.embedManager.editInfo({
                thumbnail: question.thumbnail ? question.thumbnail : null
            }, false)

            this.$state.embedManager.editFields({
                'question': { description: question.title, enabled: true },
                'answers': { description: options.map(o => o.reaction + '  ' + o.title).join('\n'), enabled: true },
                'steps': { description: `Cette question vaut **${question.level} ${question.level > 1 ? 'points' : 'point'}**.`, enabled: true }
            })

            for (const option of options) {
                this.$state.main.react(option.reaction)
            }

            this.$state.eventManager.addListener({
                id: 'collect-answer',
                event: 'collect',
                target: this.$state.main.createReactionCollector(v => v, { time: 150000 }),
                action: (reaction, user) => {
                    if (this.$props.member.id == user.id) {
                        this.$state.eventManager.removeListener('collect-answer')

                        options.forEach(option => {
                            if (option.reaction == reaction.emoji.name) {
                                this.$state.categories[this.$state.category].points += option.value ? question.level : 0
                                resolve()
                            }
                        })
                    }
                }
            })
        })
    }

    endGame () {
        this.$state.embedManager.toggleFields(['question', 'answers', 'steps'], false)

        this.$state.embedManager.editInfo({
            title: `🦉 Académie de Magie de Clerbonne`,
            color: '#d8d8d8',
            description: `Laissez-moi calculer vos points, ${this.$props.author.toString()}. Il fallait obtenir ${this.$props.admissionPoints} points pour être admis à l'Académie, et vous avez obtenu...`
        })

        const total = Object.keys(this.$state.categories).map(key => this.$state.categories[key].points).reduce((a, b) => a + b)

        setTimeout(() => {
            if (total >= this.$props.admissionPoints) {
                this.$state.embedManager.editInfo({
                    color: '#fd9e1e',
                    thumbnail: this.$props.author.avatarURL()
                })

                this.$state.embedManager.editFields({
                    'admission': {
                        enabled: true,
                        title: `...un total de ${total} points.`,
                        description: `Vous êtes admis(e) !`
                    }, 'results': {
                        enabled: true,
                        description: `${Object.keys(this.$state.categories).map(key => `${this.$state.categories[key].main.title} : **${this.$state.categories[key].points}** / ${this.$props.easyQuestions + (this.$props.hardQuestions * 2)}`).join('\n')}`
                    }
                })

                if (!this.$props.test) {
                    const role = this.$props.message.guild.roles.cache.find(role => role.name === R.MAGIC_ROLE)
                    this.$props.member.roles.add(role.id)

                    setTimeout(async () => {
                        const examRoom = this.$props.parent.$state.client.channels.cache.find(channel => channel.name === R.EXAM_CHANNEL)
                        await this.$state.embedManager.sendTo(examRoom)

                        this.$state.embedManager.editInfo({
                            title: `🦉 Académie de Magie de Clerbonne`,
                            color: '#fd9e1e',
                            description: `${this.$props.author.toString()} vient d'être admis(e) à l'Académie de Magie de Clerbonne avec **${total} points.** Félicitations !`
                        })
        
                        this.$state.embedManager.editFields({
                            'admission': {
                                enabled: false
                            }, 'results': {
                                enabled: true,
                                description: `${Object.keys(this.$state.categories).map(key => `${this.$state.categories[key].main.title} : **${this.$state.categories[key].points}** / ${this.$props.easyQuestions + (this.$props.hardQuestions * 2)}`).join('\n')}`
                            }
                        })

                        const magicRoom = this.$props.parent.$state.client.channels.cache.find(channel => channel.name === R.MAGIC_CHANNEL)
                        await this.$state.embedManager.sendTo(magicRoom)
                        
                        this.$state.embedManager.toggleFields(['admission', 'results'], false)
                        
                        this.$state.embedManager.editInfo({
                            title: `🦉 Académie de Magie de Clerbonne`,
                            color: '#fd9e1e',
                            description: `Veuillez accueillir chaleureusement ${this.$props.author.toString()} qui vient de réussir son test d'admission avec **${total} points !**`
                        })
                    }, 5000)
                }
            } else {
                this.$state.embedManager.editInfo({
                    color: '#8f5f5f',
                    thumbnail: this.$props.author.avatarURL()
                })

                this.$state.embedManager.editFields({
                    'admission': {
                        enabled: true,
                        title: `...un total de ${total} points.`,
                        description: `Malheureusement, ce sera pour la prochaine fois.`
                    }, 'results': {
                        enabled: true,
                        description: `${Object.keys(this.$state.categories).map(key => `${this.$state.categories[key].main.title} : **${this.$state.categories[key].points}** / ${this.$props.easyQuestions + (this.$props.hardQuestions * 2)}`).join('\n')}`
                    }
                })

                if (!this.$props.test) {
                    setTimeout(async () => {
                        const examRoom = this.$props.parent.$state.client.channels.cache.find(channel => channel.name === R.EXAM_CHANNEL)
                        await this.$state.embedManager.sendTo(examRoom)

                        this.$state.embedManager.editInfo({
                            title: `🦉 Académie de Magie de Clerbonne`,
                            color: '#8f5f5f',
                            description: `Malheureusement, ${this.$props.author.toString()} n'a pas réussi son test d'admission avec un total de **${total} points** sur les ${this.$props.admissionPoints} points requis.`
                        })
        
                        this.$state.embedManager.editFields({
                            'admission': {
                                enabled: false
                            }, 'results': {
                                enabled: true,
                                description: `${Object.keys(this.$state.categories).map(key => `${this.$state.categories[key].main.title} : **${this.$state.categories[key].points}** / ${this.$props.easyQuestions + (this.$props.hardQuestions * 2)}`).join('\n')}`
                            }
                        })
                    }, 5000)
                }
            }
        }, 4000)
    }
}