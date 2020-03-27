const Discord = require("discord.js")
const client = new Discord.Client()

const EventManager = require('../../helpers/EventManager')
const EmbedManager = require('../../helpers/EmbedManager')

const R = require('./ressources')

module.exports = class Norns {
    constructor () {
        this.$state = {
            client: client,
        }

        this.$props = {
            server: null
        }

        this.$state.client.login(process.env.NORNS_TOKEN)
        this.$state.client.on('ready', () => this.init())
    }

    init () {
        console.log(`Logged in as ${this.$state.client.user.tag}!`)
        
        this.$props.server = this.$state.client.guilds.cache.find(server => server.name === process.env.SERVER)

        this.initEvents()
    }

    initEvents () {
        this.$state.client.on("message", message => {
            if (message.content === "!play") {
                new Game({ message }, this)
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
                title: `þriár, ór þeim sal er und þolli stendr; Urð héto eina, aðra Verðandi, Sculd ena þriðio;`,
                description: `Trois, venant de la mer,\nqui s'étend sous l'arbre ;\nL'une est appelée Urd,\nVerdandi, l'autre\nLa troisième est Skuld.`,
                thumbnail: 'https://i.imgur.com/FMWtqte.png'
            })
        }

        this.init()
    }

    init () {
        this.$state.embedManager.addFields({
            'urd' : {
                title: `Urd :`,
                description: `🗡 Le passé est gravé sur le bois mais les Hommes oublient vite. Est-ce ton cas ?`
            },
            'verdandi': {
                title: `Verdandi :`,
                description: `⏳ Le temps file entre tes doigts comme une poignée de sable fin, est-il déjà trop tard ?`
            },
            'skuld': {
                title: `Skuld :`,
                description: `🔮 Fais-tu confiance aux fils qui te relient à ton destin ?`
            }
        })

         this.startGame()
    }

    async startGame () {
        const message = await this.$state.embedManager.sendTo(this.$props.message.channel)

        this.$state.main = message
        this.$state.main.react('🗡')
        this.$state.main.react('⏳')
        this.$state.main.react('🔮')

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
            title: `L'épreuve de Skuld, la divination.`,
            description: `${this.$props.author.toString()}, fais-tu confiance en ton instinct ?`,
            thumbnail: null
        })

        this.$state.embedManager.toggleFields(['urd', 'verdandi', 'skuld'], false)

        this.$state.embedManager.addFields({
            'skuld-intro': {
                title: `þær lög lögðo, þær líf kuro alda börnom, ørlög seggia.`,
                description: `Dans ${this.$state.urnNumber - 1} de ces urnes se trouve la prospérité que tu recherches. Dans l'une, se trouve la mort. Je t'offre ${this.$state.pointsToEarn} amulette si passes cette épreuve.`
            },
            'skuld-selector': { enabled: false },
            'skuld-urns': { enabled: false },
            'skuld-result': {
                enabled: true,
                description: `Nombre d'amulettes accumulées dans l'antre de Skuld : ${this.$state.points}`
            }
        })

        this.startGame()
    }

    async startGame () {
        this.$state.pointsToEarn = R.points[this.$state.roundNumber]

        if (this.$state.urnNumber == 2) {
            this.$state.embedManager.editField('skuld-intro', {
                title: `þær lög lögðo, þær líf kuro alda börnom, ørlög seggia.`,
                description: `Crois-tu réellement à ton destin ou bien n'était-ce qu'un coup de chance ? Prouve-le, maintenant. Je double ta mise et t'offre ${this.$state.pointsToEarn} amulettes supplémentaires si tu passe cette dernière épreuve.`
            })
        } else if (this.$state.roundNumber > 0) {
            this.$state.embedManager.editField('skuld-intro', {
                title: `þær lög lögðo, þær líf kuro alda börnom, ørlög seggia.`,
                description: `Tu ne penses quand même pas qu'on allait s'arrêter en si bon chemin ?\nTon choix se réduit mais je t'offre ${this.$state.pointsToEarn} amulettes si tu réussis. Si tu échoues, tu perds tout ce que tu as accumulé ici.\n\nTu peux aussi tout arrêter et repartir avec tes gains.`
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
            'skuld-selector': {
                enabled: true,
                description: this.$state.urns.map(v => R.numbers[v.id]).join(' ')
            },
            'skuld-urns': {
                enabled: true,
                title: this.$state.urns.map(v => (this.$state.urnNumber == 2 ? '🏺' : '⚱️')).join(' '),
                description: this.$state.urns.map(v => '➖').join(' ')
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
        
        setInterval(() => {
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

                this.$state.embedManager.editFields({
                    'skuld-selector': {
                        enabled: true,
                        description: this.$state.urns.map(v => v.selected ? '🔻' : '➖').join(' ')
                    },
                    'skuld-urns': {
                        enabled: true,
                        title: this.$state.urns.map(v => v.revealed ? '💥' : (this.$state.urnNumber == 2 ? '🏺' : '⚱️')).join(' '),
                        description: this.$state.urns.map(v => v.revealed ? (v.value ? '💎' : '💀') : '➖').join(' ')
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
                'skuld-intro': {
                    title: `On dirait que le destin te sourit.`,
                    description: `Comme promis, voici tes ${this.$state.pointsToEarn} précieuses amulettes.`
                },
                'skuld-result': {
                    enabled: true,
                    description: `Nombre d'amulettes accumulées dans l'antre de Skuld : ${this.$state.points}`
                }
            })
        } else {
            this.$state.points = 0

            this.$state.embedManager.editFields({
                'skuld-intro': {
                    title: `Ta destinée te fait défaut.`,
                    description: `Tu repars d'ici les mains vides.`
                },
                'skuld-result': {
                    enabled: true,
                    description: `Nombre d'amulettes accumulées dans l'antre de Skuld : ${this.$state.points}`
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
        
        this.$state.embedManager.toggleFields(['skuld-intro', 'skuld-selector', 'skuld-urns', 'skuld-result'], false)

        if (this.$state.urnNumber == 1) {
            this.$state.embedManager.editInfo({
                description: `Impressionnant, ${this.$props.author.toString()}. Tu as tenté le tout pour le tout et tu repars avec ${this.$state.points} amulettes.`
            })
        } else if (this.$state.points > 0) {
            this.$state.embedManager.editInfo({
                description: `${this.$props.author.toString()}, tu repars de l'antre de Skuld avec ${this.$state.points} amulette(s). Peut-être pourras-tu en remporter plus auprès des autres Nornes ?`
            })
        } else {
            this.$state.embedManager.editInfo({
                description: `${this.$props.author.toString()}, tu repars de l'antre de Skuld les mains vides. Mais tu auras peut-être plus de chance avec les autres Nornes.`
            })
        }
    }
}