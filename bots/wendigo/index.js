const Discord = require("discord.js")
const client = new Discord.Client()

const EventManager = require('../../helpers/EventManager')
const EmbedManager = require('../../helpers/EmbedManager')

const R = require('./ressources')

module.exports = class Wendigo {
    constructor () {
        this.$state = {
            client: client,
        }

        this.$props = {
            server: null,
            channel: null
        }

        this.$state.client.login(process.env.WENDIGO_TOKEN)
        this.$state.client.on('ready', () => this.init())
    }

    init () {
        console.log(`Logged in as ${this.$state.client.user.tag}!`)
        
        this.$props.server = this.$state.client.guilds.cache.find(server => server.name === process.env.SERVER)
        this.$props.channel = this.$props.server.channels.cache.find(channel => channel.name === R.CHANNEL)

        this.initEvents()
    }

    initEvents () {
        this.$state.client.on("message", message => {
            if (message.content === "!entrer" && message.channel.id === this.$props.channel.id) {
                if (message.member.roles.cache.find((r) => r.name === R.PLAYED_ROLE)) {
                    message.reply(`tu as déjà tenté ta chance dans l'antre du Wendigo.`)
                } else {
                    new Game({ message }, this)
                }
            }
        })
    }
}

class Game {  
    constructor (props, parent) {
        this.$props = {
            parent: parent,
            message: props.message,
            member: props.message.member,
            author: props.message.author
        }

        this.$state = {
            eventManager: new EventManager(),
            main: null,
            embedManager: new EmbedManager({
                color: 0x0099ff,
                title: `Tu pénétres dans l'antre du Wendigo...`,
                description: `Le Wendigo est associé aux péchés de cupidité. Il n'est jamais satisfait et se met constamment à la recherche de nouvelles victimes. Quiconque est dominé par la cupidité pourrait se transformer en Wendigo.`,
                thumbnail: 'https://i.imgur.com/tehYupC.png'
            })
        }

        this.init()
    }

    init () {
        const role = this.$props.message.guild.roles.cache.find(role => role.name === R.PLAYED_ROLE)
        this.$props.member.roles.add(role.id)

        this.$state.embedManager.addFields({
            'intro': {
                description: `Tu as la possibilité de récupérer les nombreux trésors laissés par les victimes du Wendigo.`
            },
            'goal': {
                description: `**${this.$props.author.toString()}, sauras-tu t'arrêter à temps ?**`
            }
        })

         this.startGame()
    }

    async startGame () {
        const message = await this.$state.embedManager.sendTo(this.$props.message.channel)

        this.$state.main = message
        this.$state.main.react('💀')

        this.$state.eventManager.addListener({
            id: 'start-game',
            event: 'collect',
            target: this.$state.main.createReactionCollector(v => v, { time: 150000 }),
            action: (reaction, user) => this.onReaction(reaction, user)
        })
    }

    onReaction (reaction, user) {
        if (this.$props.member.id == user.id) {
            new SkuldGame({ main: this.$state.main, embedManager: this.$state.embedManager, ...this.$props })
            this.$state.eventManager.removeListener('start-game')
        }
    }

    destroy () {

    }
}

class SkuldGame {

    constructor (props) {
        this.$props = {
            ...props
        }

        this.$state = {
            step: 'start',
            embedManager: props.embedManager,
            eventManager: new EventManager(),
            urns: [],
            urnNumber: 6,
            roundNumber: 0,
            pointsToEarn: R.points[0],
            points: 0
        }

        this.init()
    }

    init () {
        this.$state.embedManager.editInfo({
            description: `${this.$props.author.toString()}, fais-tu confiance en ton instinct ?`,
            thumbnail: null
        })

        this.$state.embedManager.toggleFields(['intro', 'goal'], false)

        this.$state.embedManager.addFields({
            'wendigo-intro': {
                title: `Plusieurs chemins s'offrent à toi. ${this.$state.urnNumber - 1} d'entre eux mènent à un trésor. L'autre te mène vers le Wendigo. Tu gagnes ${this.$state.pointsToEarn} amulettes si tu fais le bon choix.`
            },
            'wendigo-urns': { enabled: false },
            'wendigo-result': {
                enabled: true,
                description: `Nombre d'amulettes accumulées : ${this.$state.points}`
            }
        })

        this.startGame()
    }

    async startGame () {
        this.$state.pointsToEarn = R.points[this.$state.roundNumber]

        if (this.$state.urnNumber == 2) {
            this.$state.embedManager.editField('wendigo-intro', {
                title: `Tu arrives au fin fond de la caverne, il n'y a plus que deux chemin. L'un d'eux te mènera vers le Wendigo, l'autre vers un trésor encore plus grand que les précédents !`,
                description: `Tu gagnes ${this.$state.pointsToEarn} amulettes si tu choisis le bon chemin, mais tu peux aussi repartir avec les ${this.$state.points} amulettes que tu as déjà trouvé !
`
            })
        } else if (this.$state.roundNumber > 0) {
            this.$state.embedManager.editField('wendigo-intro', {
                title: `Tu t'enfonces un peu plus dans la caverne et tu arrives à un autre croisement. Choisiras-tu de continuer ton aventure ?`,
                description: `Tu gagnes ${this.$state.pointsToEarn} amulettes si tu choisis le bon chemin, mais tu peux aussi repartir avec les ${this.$state.points} amulettes que tu as déjà trouvé !
`
            })
        }

        let continueGame = await new Promise(resolve => this.startRound(resolve, {
            urnNumber: this.$state.urnNumber
        }))
        
        if (continueGame) {
            this.$state.roundNumber++
            this.$state.urnNumber--

            if (this.$state.urnNumber > 1) {
                this.startGame()
            } else {
                this.endScreen()
            }
        } else {
            this.endScreen()
        }
    }

    startRound (resolve, { urnNumber = 10 }) {
        this.$props.main.reactions.removeAll()
        this.$state.urns = []

        for (let i = 0; i < urnNumber; i++) {
            this.$state.urns.push({
                id: i,
                value: 1,
                revealed: false,
                selected: false
            })

            this.$props.main.react(R.numbers[i])
        }

        if (this.$state.roundNumber > 0) this.$props.main.react('🛑')

        this.$state.urns[Math.floor(Math.random() * this.$state.urns.length)].value = 0

        this.$state.embedManager.editFields({
            'wendigo-urns': {
                enabled: true,
                title: this.$state.urns.map(v => '🚪').join(' '),
                description: this.$state.urns.map(v => '➖').join(' ') + '➖🚶‍♀️'
            }
        })

        this.$state.eventManager.addListener({
            id: 'make-selection',
            event: 'collect',
            action: (reaction, user) => this.onUrnSelect(resolve, reaction, user),
            target: this.$props.main.createReactionCollector(v => v, { time: 150000 })
        })
    }

    async onUrnSelect (resolve, reaction, user) {
        if (this.$props.member.id === user.id && reaction.emoji.name !== '🛑') {
            this.$state.eventManager.removeListener('make-selection')
            this.$props.main.reactions.removeAll()
            this.$state.embedManager.editFields({
                'wendigo-player': { enabled: false }
            })

            let selected = null
            R.numbers.forEach((number, i) => {
                if (reaction.emoji.name == number) selected = i
            })

            this.$state.urns[selected].selected = true

            await new Promise(resolve => this.revealCards(resolve))

            this.giveResult(this.$state.urns[selected].value, resolve)
        } else if (this.$props.member.id === user.id && reaction.emoji.name == '🛑') {
            this.$state.eventManager.removeListener('make-selection')
            resolve(false)
        }
    }

    revealCards (resolve) {
        let position = 0
        let skulls = 1
        
        setInterval(async () => {
            if (position < this.$state.urns.length) {
                let toReveal = null
                let notRevealed = this.$state.urns.filter(c => !c.revealed)

                notRevealed.sort(() => Math.random() - 0.5).forEach(urn => {
                    if (toReveal === null) {
                        if (notRevealed.length - 1 > skulls) {
                            if (urn.value && !urn.selected) toReveal = urn.id
                        } else if (notRevealed.length <= skulls + 1 && !urn.selected) {
                            toReveal = urn.id
                        } else if (notRevealed.length == 1) {
                            toReveal = urn.id
                        }
                    }
                })

                this.$state.urns.forEach(urn => {
                    if (urn.id == toReveal) urn.revealed = true
                })

                await this.$state.embedManager.editFields({
                    'wendigo-urns': {
                        enabled: true,
                        title: this.$state.urns.map(v => v.revealed ? (v.value ? '📿' : '💀') : '🚪').join(' '),
                        description: this.$state.urns.map(v => v.selected ? '🚶‍♀️' : '➖').join(' ')
                    }
                })

                position++
            } else {
                resolve(true)
            }
        }, 1000)
    }

    giveResult (result, resolve) {
        if (result) {
            this.$state.points += this.$state.pointsToEarn

            this.$state.embedManager.editFields({
                'wendigo-intro': {
                    title: `Tu arrives dans une cavité de la grotte. Le sol est jonché de squelettes. L’un d’eux est appuyé sur un coffre. Tu l’ouvres et récupère ${this.$state.pointsToEarn} précieuses amulettes de plus !`, description: false
                },
                'wendigo-result': {
                    enabled: true,
                    description: `Nombre d'amulettes accumulées : ${this.$state.points}`
                }
            })
        } else {
            this.$state.points = 0

            this.$state.embedManager.editFields({
                'wendigo-intro': {
                    title: `Tu arrives dans une cavité de la grotte. Le sol est jonché de squelettes. L’un d’eux est appuyé sur un coffre. Tu l’ouvres et récupère 500 amulettes ! Mais tu as à peine le temps de te retourner, que le Wendigo t’as déjà dévoré !`,
                    description: false
                },
                'wendigo-result': {
                    enabled: true,
                    description: `Nombre d'amulettes accumulées : ${this.$state.points}`
                }
            })
        }

        this.$props.main.react('🆗')

        this.$state.eventManager.addListener({
            id: 'continue-to-next',
            event: 'collect',
            action: (reaction, user) => {
                if (reaction.emoji.name === '🆗' && this.$props.member.id === user.id) {
                    this.$state.eventManager.removeListener('continue-to-next')
                    resolve(result)
                }
            },
            target: this.$props.main.createReactionCollector(v => v, { time: 150000 })
        })
    }

    endScreen () {
        this.$props.main.reactions.removeAll()
        
        this.$state.embedManager.toggleFields(['wendigo-intro', 'wendigo-urns', 'wendigo-result'], false)

        if (this.$state.urnNumber == 1) {
            this.$state.embedManager.editInfo({
                title: `Quelle témérité !`,
                description: `Impressionnant, ${this.$props.author.toString()}. Tu as exploré la caverne, sans croiser le Wendigo une seule fois, et tu repars avec ${this.$state.points} amulettes !`
            })
        } else if (this.$state.points > 0) {
            this.$state.embedManager.editInfo({
                title: `Quelle sagesse.`,
                description: `${this.$props.author.toString()}, malgré ton courage infaillible, rebrousser chemin me semble avoir été la bonne décision. Tu repars de la caverne avec ${this.$state.points} amulettes.`
            })
        } else {
            this.$state.embedManager.editInfo({
                title: `Petit ange parti trop tôt.`,
                description: `${this.$props.author.toString()}, tu as été dévoré par le Wendigo. Tes restes reposent parmi les autres aventuriers imprudents. Les amulettes que tu avais récupérées jonchent désormais le sol de la caverne. Dommage !`
            })
        }
    }
}