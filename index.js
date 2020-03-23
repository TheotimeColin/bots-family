const Discord = require("discord.js")
const client = new Discord.Client()
const questions = require('./house-select/questions')

const PERMISSION_ROLE = 'Peut choisir une maison'

const HOUSES = {
    1: ':zap: Fennecs Aventureux',
    2: ':rocket: Macareux Cosmiques',
    3: ':sparkles: Axolotls Scintillants'
}

const VALUES = {
    1: 'rencontres - aventure - persévérance',
    2: 'pragmatisme - ambition - fidélité',
    3: 'rêve - amour - créativité'
}

const ROLES = [
    `⚡ Fennecs Aventureux`,
    `🚀 Macareux Cosmiques`,
    `✨ Axolotls Scintillants`
]

const RESULTS = [
    `Après mûre réflexion, j'ai enfin fait mon choix.`,
    `La décision ne fut pas aisée, ton esprit est complexe.`,
    `Finalement j'ai changé d'avis à ton propos...`,
    `Tu seras peut-être supris par mon choix, mais c'est le bon.`,
    `J'ai longtemps hésité entre deux Maisons, mais celle-ci l'emporte.`,
    `Je pense que tu vas beaucoup te plaire dans cette Maison.`,
    `Je l'ai senti dès le début, et tes réponses me l'ont confirmé.`,
    `Je me suis trompé à ton propos, je n'aurais pas dû me fier aux apparences.`,
    `Ce choix te paraîtra comme une évidence, tu verras.`,
    `On pourrait croire que cette Maison a été créée spécialement pour toi.`,
    `J'ai senti qu'au fond c'était cette Maison que tu voulais intégrer.`,
    `Tu pourrais appartenir aux trois. Mais celle-ci te convient le mieux.`
]

const ROOMS = {
    1: '⚡-la-tanière-des-fennecs-aventureux',
    2: '🚀-le-labo-des-macareux-cosmiques',
    3: '✨-l-atelier-des-axolotls-scintillants'
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", userMessage => {
    if (userMessage.content === "!choix" || userMessage.content === "!test") {
        const test = userMessage.content === "!test"

        if (userMessage.member.roles.cache.some(r => ROLES.includes(r.name)) && !test) {
            userMessage.reply('Tu as déjà une Maison !')
        } else {
            const userId = userMessage.author.id
            const selectedQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10)
            let started = false

            let points = {
                1: test ? 0 : 2,
                2: 0,
                3: 0
            }

            const embed = new Discord.MessageEmbed({
                color: '#EF476F',
                title: `Moi, grand Maître Capybara, vais choisir ta Maison...`,
                description: 'Je perçois déjà vers quelle Maison te diriger... Mais je vais quand même te poser quelques questions pour en être certain.\n\nApaise ton esprit, concentre-toi et réponds avec la plus grande sincérité possible.\n\n**Es-tu prêt ?**',
                footer: { text: 'Pour répondre, clique ci-dessous'}
            });

            userMessage.channel.send(embed).then((message) => {
                message.react('✅')

                const filter = (v) => v
                const collector = message.createReactionCollector(filter, { time: 150000 });

                collector.on('collect', (reaction, user) => {
                    if (user.id == userId && !started) {
                        started = true
                        startQuizz({ embed, points, message, userMessage, userId, selectedQuestions, test })
                    }
                })
            }).catch();
        }
    }
})

const startQuizz = async ({ embed, points, message, userMessage, userId, selectedQuestions, test }) => {
    message.reactions.removeAll()

    let i = 0

    for (const question of selectedQuestions) {
        i += 1
        result = await askQuestion({ question, embed, message, userId, i, total: selectedQuestions.length })
        message.reactions.removeAll()
        points[result.house] += result.points
    }

    giveResult({ embed, points, message, userMessage, test })
}

const askQuestion = ({ question, embed, message, userId, i, total }) => {
    return new Promise((res, rej) => {
        let result = { house: 0, points: 0 }
        const options = question.options.sort(() => Math.random() - 0.5)

        const newEmbed = new Discord.MessageEmbed({
            ...embed,
            description: `Suis ton instinct, ne réfléchis pas trop. La Maison qui te correspond le mieux est gravée en toi, je le sens.`,
            footer: { text: `Question ${i} / ${total}` },
            fields: [{
                name: `\u200B`,
                value: `**${question.title}**`
            }, {
                name: `\u200B`,
                value: options.map((v) => `${v.reaction} **${v.title}**`).join('\n')
            }]
        })

        message.edit(newEmbed)
        
        options.forEach(option => {
            message.react(option.reaction)
        })
        
        const filter = (v) => v
        const collector = message.createReactionCollector(filter, { time: 150000 });

        collector.on('collect', (reaction, user) => {
            if (user.id == userId) {
                options.forEach(option => {
                    if (option.reaction == reaction.emoji.name) {
                        result = {
                            house: option.house,
                            points: question.value
                        }

                        res(result)
                    }
                })
            }
        })
    })
}

const giveResult = ({ embed, points, message, userMessage, test }) => {
    let results = []
    let highest = 0

    Object.keys(points).forEach(house => {
        const value = points[house]

        if (value > highest) results = []
        
        if (value >= highest) {
            highest = value
            results.push(house);
        }
    })

    let finalResult = results[Math.floor(Math.random() * results.length)]

    const newEmbed = new Discord.MessageEmbed({
        ...embed,
        title: RESULTS[Math.floor(Math.random() * RESULTS.length)],
        description: `${userMessage.author.toString()},\ntu fais désormais partie des **${HOUSES[finalResult]}** !`,
        thumbnail: {
            url: userMessage.author.avatarURL(),
        },
        footer: { text: VALUES[finalResult] }
    })
    
    message.edit(newEmbed)

    if (!test) {
        const permissionRole = message.guild.roles.cache.find(role => role.name === PERMISSION_ROLE)
        userMessage.member.roles.remove(permissionRole.id)

        const role = message.guild.roles.cache.find(role => role.name === ROLES[finalResult - 1])
        userMessage.member.roles.add(role.id)

        const channel = client.channels.cache.find(channel => channel.name === ROOMS[finalResult])
        channel.send(`${role}, je vous demande d'accueillir ${userMessage.author.toString()} qui intègre votre Maison !`)
    }
}

client.login("NjkxMjU1NjkxMTg4MzcxNTM3.XndUPw.ldK1QEwEbOlg2Ar4EVKRZThOE9A")