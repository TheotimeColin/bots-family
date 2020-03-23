if (userMessage.content === "!spotted") {
    let start = true

    userMessage.reply(`Que souhaites-tu partager en anonyme ?\n**Merci de rester bienveillant et de te limiter à 1 message par jour.**`)

    client.on('message', (message) => {
        if (message.author == userMessage.author && start && message.channel == userMessage.channel) {
            const spottedMessage = message
            
            const newEmbed = new Discord.MessageEmbed({
                title: `Je vais publier ce message sur le channel #🧨-spotted, tu en es certain ?`,
                description: `"${spottedMessage}"`,
            })

            message.reply(newEmbed)
            .then(message => {
                message.react('✅')
                message.react('❌')

                const filter = (v) => v
                const collector = message.createReactionCollector(filter, { time: 150000 });

                collector.on('collect', (reaction, user) => {
                    if (user.id == userMessage.author.id && start) {
                        if (reaction.emoji.name == '✅') {
                            message.channel.send(`Et voilà, c'est fait !`)

                            const server = client.guilds.cache.find(s => s.name === SERVER_NAME)
                            const channel = server.channels.cache.find(channel => channel.name === SPOTTED_CHANNEL)
                            
                            const newEmbed = new Discord.MessageEmbed({
                                title: `Quelqu'un m'a demandé de vous transmettre ce message`,
                                description: `"${spottedMessage}"`,
                            })

                            channel.send(newEmbed)
                        } else {
                            message.channel.send(`D'accord, je laisse tomber.`)
                        }

                        start = false
                    }
                })
            })
        }
    })
}