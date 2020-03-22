const questions = [
    {
        title: "Quelle réponse t'inspire le plus ?",
        value: 2,
        options: [
            {
                reaction: "🌠",
                title: "Possibilités illimitées",
                house: 1
            },
            {
                reaction: "🔳",
                title: "Miroir d'infini",
                house: 2
            },
            {
                reaction: "🌌",
                title: "Boucle spatio-temporelle",
                house: 3
            }
        ]
    }, {
        title: "Quel plat t'attire le plus ?",
        value: 2,
        options: [
            {
                reaction: "🥩",
                title: "Un steak saignant",
                house: 1
            },
            {
                reaction: "🍣",
                title: "Un plateau de sushis",
                house: 2
            },
            {
                reaction: "🥧",
                title: "Une tarte aux fraises",
                house: 3
            }
        ]
    }, {
        title: "Comment voudrais-tu qu'on se souvienne de toi ?",
        value: 2,
        options: [
            {
                reaction: "✊",
                title: "Le Courageux",
                house: 1
            },
            {
                reaction: "✌️",
                title: "L'Inventeur",
                house: 2
            },
            {
                reaction: "🤲",
                title: "Le Généreux",
                house: 3
            }
        ]
    }, {
        title: "Qu'est-ce qui t'énerve le plus chez les gens ?",
        value: 2,
        options: [
            {
                reaction: "👀",
                title: "La lâcheté",
                house: 1
            },
            {
                reaction: "🗣",
                title: "La malhonnêteté",
                house: 2
            },
            {
                reaction: "👁",
                title: "L'égoïsme",
                house: 3
            }
        ]
    }, {
        title: "Quel mot t'inspire le plus ?",
        value: 2,
        options: [
            {
                reaction: "🌄",
                title: "Découverte du monde",
                house: 1
            },
            {
                reaction: "🌊",
                title: "Évolution constante",
                house: 2
            },
            {
                reaction: "🌸",
                title: "Paix intérieure",
                house: 3
            }
        ]
    }, {
        title: "Quel réponse t'inspire le plus ?",
        value: 2,
        options: [
            {
                reaction: "✈️",
                title: "Voyage lointain",
                house: 1
            },
            {
                reaction: "⚒",
                title: "Projet ambitieux",
                house: 2
            },
            {
                reaction: "❤️",
                title: "Chaleur du foyer",
                house: 3
            }
        ]
    }, {
        title: "Quelle odeur t'attire le plus ?",
        value: 2,
        options: [
            {
                reaction: "🌲",
                title: "Les sous-bois d'une forêt",
                house: 1
            },
            {
                reaction: "🔥",
                title: "Un feu de cheminée",
                house: 2
            },
            {
                reaction: "📖",
                title: "Les pages d'un livre",
                house: 3
            }
        ]
    }, {
        title: "C'est l'apocalypse. Quelle est la première chose que tu emportes avec toi ?",
        value: 2,
        options: [
            {
                reaction: "🏕",
                title: "Une tente",
                house: 1
            },
            {
                reaction: "🥫",
                title: "Des boîtes de conserve",
                house: 2
            },
            {
                reaction: "🧰",
                title: "Une trousse de premier secours",
                house: 3
            }
        ]
    }, {
        title: "Quel est ton critère le plus important pour choisir des chaussures ?",
        value: 2,
        options: [
            {
                reaction: "👠",
                title: "Le style",
                house: 1
            },
            {
                reaction: "🥾",
                title: "L'étanchéité",
                house: 2
            },
            {
                reaction: "👟",
                title: "Le confort",
                house: 3
            }
        ]
    }, {
        title: "Quelle est ta relation au sport ?",
        value: 2,
        options: [
            {
                reaction: "🚵‍♂️",
                title: "J'ai du mal à m'en passer",
                house: 1
            },
            {
                reaction: "🏃‍♀️",
                title: "J'en fais car je pense que c'est important",
                house: 2
            },
            {
                reaction: "🙇‍♂️",
                title: "J'aimerais en faire, mais...",
                house: 3
            }
        ]
    }, {
        title: "Tu trouves un restaurant que tu adores, que fais-tu ?",
        value: 2,
        options: [
            {
                reaction: "🔎",
                title: "Je cherche d'autres restaurants dans le même style",
                house: 1
            },
            {
                reaction: "📱",
                title: "Je partage le bon plan sur mes réseaux sociaux",
                house: 2
            },
            {
                reaction: "🏃‍♂️",
                title: "J'y invite mes amis dès la semaine prochaine",
                house: 3
            }
        ]
    }, {
        title: "Quelle est la chose la plus dure à supporter pour toi ?",
        value: 2,
        options: [
            {
                reaction: "😐",
                title: "L'ennui",
                house: 1
            },
            {
                reaction: "😡",
                title: "L'injustice",
                house: 3
            },
            {
                reaction: "😖",
                title: "La jalousie",
                house: 2
            },
            {
                reaction: "😱",
                title: "La peur",
                house: 3
            },
            {
                reaction: "😨",
                title: "La honte",
                house: 2
            },
            {
                reaction: "😞",
                title: "La solitude",
                house: 1
            }
        ]
    }, {
        title: "Quel mot t'inspire le plus ?",
        value: 2,
        options: [
            {
                reaction: "🎒",
                title: "Exploration",
                house: 1
            },
            {
                reaction: "😌",
                title: "Compassion",
                house: 2
            },
            {
                reaction: "🤝",
                title: "Partage",
                house: 3
            }
        ]
    }, {
        title: "Qu'est-ce qui ne cessera jamais te t'impressionner ?",
        value: 2,
        options: [
            {
                reaction: "🏞",
                title: "La beauté d'un paysage naturel",
                house: 1
            },
            {
                reaction: "🌌",
                title: "L'immensité de l'univers",
                house: 2
            },
            {
                reaction: "💕",
                title: "La solidarité humaine",
                house: 3
            }
        ]
    }, {
        title: "Quel est ton rapport vis-à-vis de la loi ?",
        value: 2,
        options: [
            {
                reaction: "🤜",
                title: "Je n'aime pas qu'on exerce du contrôle sur moi",
                house: 1
            },
            {
                reaction: "✊",
                title: "On peut contourner la loi si nos intentions sont justes",
                house: 2
            },
            {
                reaction: "☝️",
                title: "La loi nous protège tous et doit être respectée",
                house: 3
            }
        ]
    }, {
        title: "Quel balade te tente le plus ?",
        value: 1,
        options: [
            {
                reaction: "🏞",
                title: "Une randonnée dans une forêt ombragée",
                house: 1
            },
            {
                reaction: "🌅",
                title: "Une marche le long de la plage un soir d'été",
                house: 2
            },
            {
                reaction: "🎡",
                title: "Un rue marchande illuminée et pleine de vie",
                house: 3
            },
            {
                reaction: "🏯",
                title: "Un parcours parmi les lieux historiques d'un pays étranger",
                house: 3
            }
        ]
    }, {
        title: "Qu'est-ce qui t'inspire le plus ?",
        value: 1,
        options: [
            {
                reaction: "🌅",
                title: "Un lever de soleil",
                house: 1
            },
            {
                reaction: "🌄",
                title: "Un coucher de soleil",
                house: 2
            }
        ]
    }, {
        title: "Qu'est-ce qui t'inspire le plus ?",
        value: 1,
        options: [
            {
                reaction: "🦅",
                title: "Vie aérienne",
                house: 3
            },
            {
                reaction: "🐟",
                title: "Vie sous-marine",
                house: 2
            }
        ]
    }, {
        title: "Qu'est-ce qui t'inspire le plus ?",
        value: 1,
        options: [
            {
                reaction: "🌷",
                title: "Le printemps",
                house: 1
            },
            {
                reaction: "🍂",
                title: "L'automne",
                house: 3
            }
        ]
    }, {
        title: "On te donne une mission. Quelle est ton approche ?",
        value: 2,
        options: [
            {
                reaction: "💥",
                title: "Je fonce et j’avise après",
                house: 1
            },
            {
                reaction: "💡",
                title: "Je trouve une manière ingénieuse d’y arriver",
                house: 2
            },
            {
                reaction: "🕴",
                title: "Je me fais le plus discret possible",
                house: 3
            }
        ]
    }, {
        title: "Pourquoi t’es-tu inscrit sur antiswipe ?",
        value: 2,
        options: [
            {
                reaction: "✨",
                title: "Découvrir de nouveaux lieux et activités",
                house: 1
            },
            {
                reaction: "💥",
                title: "Me sortir de la routine",
                house: 2
            },
            {
                reaction: "👋",
                title: "Pour rencontrer de belles personnes",
                house: 3
            }
        ]
    }, {
        title: "Qu’est-ce qui différencie un bon plat et un plat exceptionnel ?",
        value: 2,
        options: [
            {
                reaction: "✨",
                title: "Y ajouter sa petite touche personnelle",
                house: 1
            },
            {
                reaction: "🥑",
                title: "Sélectionner les meilleurs ingrédients",
                house: 2
            },
            {
                reaction: "❤️",
                title: "Le faire avec amour et attention",
                house: 3
            }
        ]
    }, {
        title: "Des amis te servent un plat mais tu le trouves horrible :",
        value: 2,
        options: [
            {
                reaction: "🤭",
                title: "Tu leur avoues que tu aurais mis moins de sel",
                house: 1
            },
            {
                reaction: "😅",
                title: "Tu prétextes que tu n’as pas très faim",
                house: 2
            },
            {
                reaction: "🤢",
                title: "Tu te forces à tout finir",
                house: 3
            }
        ]
    }, {
        title: "Qu’est-ce qui différencie un ami et un ami proche ?",
        value: 2,
        options: [
            {
                reaction: "😊",
                title: "Tu lui voues une confiance sans faille",
                house: 1
            },
            {
                reaction: "😅",
                title: "Il te challenge toujours avec bienveillance",
                house: 2
            },
            {
                reaction: "🤣",
                title: "Tu n’es jamais à court de conversation avec",
                house: 3
            }
        ]
    }, {
        title: "Tu organises une soirée chez toi :",
        value: 2,
        options: [
            {
                reaction: "🥳",
                title: "On verra le jour-même selon le mood général",
                house: 1
            },
            {
                reaction: "🤓",
                title: "Tu réfléchis au menu et aux activités deux semaines avant",
                house: 2
            },
            {
                reaction: "🤭",
                title: "Tu prépares ça la veille, l’important c’est de voir mes amis",
                house: 3
            }
        ]
    }, {
        title: "Quelle est la différence entre un bon film et un chef d’oeuvre ?",
        value: 2,
        options: [
            {
                reaction: "😱",
                title: "Un scénario complètement inattendu",
                house: 1
            },
            {
                reaction: "😵",
                title: "Une bande-son exceptionnelle",
                house: 2
            },
            {
                reaction: "😍",
                title: "Des personnages incroyablement attachants",
                house: 3
            }
        ]
    }, {
        title: "Quel genre de super-pouvoir choisirais-tu ?",
        value: 2,
        options: [
            {
                reaction: "💪",
                title: "Une force surhumaine",
                house: 1
            },
            {
                reaction: "🤸‍♂️",
                title: "Une agilité incroyable",
                house: 1
            },
            {
                reaction: "🧘‍♂️",
                title: "La lévitation",
                house: 2
            },
            {
                reaction: "🌀",
                title: "La télékinesie",
                house: 2
            },
            {
                reaction: "💨",
                title: "L'invisibilité",
                house: 3
            },
            {
                reaction: "🕳",
                title: "Passer à travers les murs",
                house: 3
            }
        ]
    }, {
        title: "Jerry des Totally Spies te convoque, quel gadget choisis-tu ?",
        value: 2,
        options: [
            {
                reaction: "💅",
                title: "Le vernis à ongle ultra durcissant",
                house: 1
            },
            {
                reaction: "💄",
                title: "Le rouge à lèvres laser",
                house: 2
            },
            {
                reaction: "💍",
                title: "La bague étourdissante",
                house: 3
            }
        ]
    }, {
        title: "Tu es en confinement suite à une urgence sanitaire, comment réagis-tu ?",
        value: 2,
        options: [
            {
                reaction: "🤯",
                title: "OMG je dois sortir sinon je vais exploser",
                house: 1
            },
            {
                reaction: "🧘‍♀️",
                title: "Je recherche la paix intérieure à travers la méditation",
                house: 2
            },
            {
                reaction: "🤷‍♂️",
                title: "C'est comme d’habitude non ?",
                house: 3
            }
        ]
    }, {
        title: "Si tu devrais ouvrir une chaine YouTube, le thème serait...",
        value: 2,
        options: [
            {
                reaction: "🗺",
                title: "Lifestyle & voyage",
                house: 1
            },
            {
                reaction: "🎉",
                title: "Humour",
                house: 1
            },
            {
                reaction: "🧬",
                title: "Vulgarisation scientifique",
                house: 2
            },
            {
                reaction: "🎮",
                title: "Gaming",
                house: 2
            },
            {
                reaction: "🍛",
                title: "Recettes de cuisine",
                house: 3
            },
            {
                reaction: "🏵",
                title: "Relaxation & ASMR",
                house: 3
            }
        ]
    }
]

module.exports = questions;