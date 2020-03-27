module.exports = {
    title: '⚗️ Alchimie & potions',
    color: '#27f7f7',
    questions: [
        {
            title: "Il existe plusieurs manières de confectionner des philtres d'Amour. Voici plusieurs ingrédients réputés aphrodisiaques. Mais parmi eux se trouve **un ingrédient anaphrodisiaque (supprime le désir), lequel ?**",
            level: 1,
            thumbnail: "https://i.imgur.com/OoUhU83.png",
            options: [
                {
                    reaction: "🌹", title: "Rose", value: false
                },
                {
                    reaction: "🌿", title: "Marjolaine", value: true
                },
                {
                    reaction: "🍠", title: "Gingembre", value: false
                }
            ]
        },
        {
            title: "La pierre philosophale (lapis philosophorum) est substance alchimique bien connue qui apporte plusieurs bienfaits. **Parmi ces bienfaits, un est erroné, lequel ?**",
            level: 1,
            thumbnail: "https://i.imgur.com/jPHUF0m.png",
            options: [
                {
                    reaction: "⏱", title: "Prolonge la vie humaine", value: false
                },
                {
                    reaction: "🧪", title: "Guérit de toutes les maladies", value: false
                },
                {
                    reaction: "🧠", title: "Donne un savoir et une sagesse infinie", value: true
                }
            ]
        },
        {
            title: "En alchimie, l'or est associé au Soleil. **À quel astre l’argent est-il associé ?**",
            level: 1,
            thumbnail: "https://i.imgur.com/SEHspLC.png",
            numbered: true,
            options: [
                {
                    reaction: "1️⃣", title: "La Lune", value: true
                },
                {
                    reaction: "2️⃣", title: "Jupiter", value: false
                },
                {
                    reaction: "3️⃣", title: "Mars", value: false
                }
            ]
        },
        {
            title: "**Qu’appelle-t-on la Langue des oiseaux ?**",
            level: 2,
            options: [
                {
                    reaction: "🔎", title: "La recherche et l’interprétation des sens cachés des mots et des noms", value: true
                },
                {
                    reaction: "⚗️", title: "Un ingrédient légendaire permettant de concevoir la Potion de Vie", value: false
                },
                {
                    reaction: "🌿", title: "L’étude du langage animalier et des secrets de la Nature", value: false
                }
            ]
        },
        {
            title: "**Comment s'appelle le four de laboratoire utilisé par l'alchimiste ?**",
            level: 2,
            thumbnail: "https://i.imgur.com/32sJnFX.png",
            numbered: true,
            options: [
                {
                    reaction: "1️⃣", title: "L’Athanor (le fourneau cosmique)", value: true
                },
                {
                    reaction: "2️⃣", title: "Le Fornacem Deos (Le fourneau des Dieux)", value: false
                },
                {
                    reaction: "3️⃣", title: "Le Murajil 'iilhi (le chaudron divin)", value: false
                }
            ]
        }
    ]
}