module.exports = {
    errors: {
        notFound: `cette commande n'existe pas ! Mes commandes sont "!panda-haiku" et !panda-soutien".`,
        generic: `Oops, il y a eu une erreur quelque part. Réessaye ou préviens ton administrateur !`,
        notSetup: `il semblerait que je ne sois pas configuré, préviens ton administrateur !`
    },
    setup: {
        whatChannelWelcome: `J'ai seulement quelques questions à te poser pour démarrer. Sur quel channel souhaiter la bienvenue ?`,
        whatChannelHaiku: `Quel channel pour la publication des bavards ?`,
        whatChannelSupport: `Quel channel pour la publication des bouteilles ?`,
        whatRoleParticipate: `Quel rôle assigner aux participants de l'événement ?`,
        whatRoleBavard: 'Quel rôle pour les bavards ?',
        done: `C'est tout pour moi ! Tu peux commencer à utiliser mes commandes.`,
        alreadyDone: `je suis déjà configuré !`
    },
    reset: {
        success: `J'ai remis ma configuration à zéro.`
    },
    getter: {
        title: `Tu veux un cookie ?`
    },
    welcome: {
        title: `💕 Bienvenue sur le serveur antiswipe !`,
        description: `**C'est ta première fois sur Discord ?**\nPas de panique, il y a un petit temps d'adaptation mais c'est très facile. Il y a simplement plusieurs "salons" où tu peux discuter avec d'autres membres, à l'écrit ou bien à l'oral.\n\n**Par où commencer ?**\nPour débloquer l'accès aux salons, il suffit de cliquer sur le bouton vert ci-dessous. Ensuite, tu pourras démarrer par le salon "#présentations" pour nous parler un peu de toi si tu le souhaites !\n\n**Je suis venu·e pour participer à un événement**\nTu devrais pouvoir voir un salon qui correspond à l'événement en cours. Parfois, tu dois aussi rejoindre un salon vocal pour que tu puisses entendre les animateurs mais **tu n'es pas obligé·e de parler**, le micro est désactivé par défaut.`,
        accept: `Pour débloquer l'accès aux salons, cliques sur le bouton ci-dessous :`
    },
    bavards: {
        title: `💬 Envie de plus de bla bla ?`,
        description: `Tu peux débloquer l'accès à d'autres salons de discussion si tu as envie d'interagir encore plus avec les autres membres de la communauté ! On y parle photographie, cuisine mais aussi musique, jeux-vidéos... Et c'est aussi un lieu d'entraide, de convivialité et de sorties improvisées ! `,
        accept: `Si ça te parle, il suffit de cliquer sur le perroquet ci-dessous !`
    },
    welcomePrivate: {
        title: `💌 Voici le programme !`,
        description: `Sens-toi libre d'aller et venir comme bon te semble, tu n'es pas obligé de participer à tout !`,
        program: {
            free: {
                description: `Tout l'après-midi :`
            },
            haikus: {
                title: `🖌 Écriture de haikus & poèmes`,
                description: `Pour découvrir l'atelier, écris à tout moment "!panda-haiku" ici.`
            },
            support: {
                title: `🎐 Lâcher de lanternes & soutien`,
                description: `Pour découvrir l'atelier, écris à tout moment "!panda-soutien" ici.`
            },
            slot: {
                description: `À des heures précises :`
            },
            slot2: {
                title: `🔘 14h30 : **Le minimalisme @Théotime**`,
                description: `Less is more.`
            },
            slot3: {
                title: `🤲 15h00 : **Retour d'expérience sur le Reiki @Samyu**`,
                description: `Soigner et relaxer grâce aux énergies.`
            },
            slot5: {
                title: `💪 16h00 : **Devenir maître de sa propre vie @Evann**`,
                description: `Soyez l'acteur principal de votre film, autorisez vous à vivre !`
            },
            slot6: {
                title: `🪔 16h30 : **Séance de méditation @Apolline**`,
                description: `Initiation à la pratique de la méditation, plus ou moins conventionnelle.`
            },
            slot7: {
                title: `🧘‍♂️ 17h30 : **Séance d'initiation au yoga vinyasa @Corentin**`,
                description: `Initiation au yoga vinyasa, une forme de yoga qui permet de développer sa force physique et psychique.`
            },
            slot8: {
                title: `☀️ 18h15 : **Se libérer des pensées négatives @Alexandre**`,
                description: `Gérer ses pensées négatives avec la thérapie cognitivo-comportementale.`
            }
        }
    },
    haiku: {
        welcome: {
            title: `🖌 Écriture de haikus & poèmes`,
            description: `Avec cet atelier, tu vas pouvoir t'exprimer, anonymement ou pas. Ne t'en fais pas si c'est la première fois que tu fais ça, il te suffit juste d'un peu d'inspiration ! Nous ne sommes pas là pour juger.`,
            fields: {
                diverse: { description: `Tu peux également partager d'autres formes de poésie ou texte !` },
                knowMore: { description: `❓ Tu ne sais pas ce qu'est un haiku ?\n✅ Prêt(e) à écrire ?` }
            }
        },
        help: {
            title: `❓ Qu'est-ce qu'un haiku ?`,
            description: `Un haïku (俳句) est un  poème extrêmement bref visant à célébrer les petits moments éphéméres d'une vie.`,
            fields: {
                tutorial1: {
                    description: `Il se compose en trois lignes, avec une structure syllabique de 5-7-5. C'est-à-dire que la première ligne comporte 5 syllabes, la deuxième 7 et la dernière 5. Un haïku n'a pas besoin de rimer.`
                },
                tutorial2: {
                    description: `En général, un haïku essaye de capturer un bref moment d'en retranscrire l'émotion ou l'atmosphère. Traditionnellement, il évoque souvent la nature mais sens-toi libre de choisir n'importe quel thème.`
                },
                inpiration: {
                    description: `*premier son de cloche\ndans le boisé de la cour\ndeux brins de muguet*`
                }
            }
        },
        start: {
            title: `🖌 Écriture de haikus & poèmes`,
            description: `Écris ton haiku, poème ou autre.`,
            fields: {
                tutorial: {
                    title: `Pour sauter des lignes sur ordinateur, maintiens la touche MAJ et appuies sur ENTRÉE.`
                }
            }
        },
        inpiration: [
            `premier son de cloche\ndans le boisé de la cour\ndeux brins de muguet`,
            `au vent de la mer\nondulation des épis\nen vagues vertes`,
            `dans la nuit douce\nlongue discussion entre amis\n― rhum arrangé`,
            `le bec planté\ndans une mirabelle\nle chercheur d’or`,
            `départ sans bagage\nprise par le vent d’automne\nune feuille verte`,
            `matin glacial\nface au dernier hêtre\nla tronçonneuse`
        ],
        cancelled: {
            description: `J'ai annulé l'action, reviens quand tu veux 💕`
        },
        confirmed: {
            description: `Ton message a bien été partagé. N'hésite pas à en faire d'autres, the world needs you right now 💕`
        }
    },
    support: {
        welcome: {
            title: `🌊 Bouteilles à la mer`,
            description: `Tu t'apprêtes à écrire un petit message qui apportera très certainement de la chaleur dans le coeur d'un autre être humain. Sois positif avant tout !`,
            fields: {
                tutorial: {
                    description: `✅ Répondre à une question aléatoire\n☑️ Écrire un message libre`
                }
            }
        },
        free: `Que souhaites-tu dire au monde entier ?`,
        elaborate: `Peux-tu élaborer un peu ta réponse ? Imagines que tu t'adresse à quelqu'un en face de toi 🤗`,
        share: `Qu'en penses-tu ? Puis-je le partager aux autres ?`,
        confirmed: {
            description: `Ton message a bien été partagé. N'hésite pas à en faire d'autres, the world needs you right now 💕`
        },
        questions: [
            `Que dirais-tu à un ami qui vient de perdre un être cher ?`,
            `Que dirais-tu à une amie qui ne trouve pas sa passion ?`,
            `Que dirais-tu à une amie qui désespère en amour ?`,
            `Que dirais-tu à un ami pour qui la vie s’acharne sur lui ?`,
            `Que dirais-tu à une amie qui a du mal à tourner la page ?`,
            `Que dirais-tu à un ami qui n’arrive pas à lâcher prise ?`,
            `Que dirais-tu à une amie tourmentée par la peur ?`,
            `Que dirais-tu à un ami déprimé ?`,
            `Que dirais-tu à une amie qui se sent seul ?`,
            `Que dirais-tu à un ami qui ne trouve pas de travail ?`,
            `Que dirais-tu à une amie qui vient d'être humiliée ?`,
            `Que dirais-tu à un ami qui vient de subir une rupture douloureuse ?`,
            `Que dirais-tu à une amie qui se sent perdue dans sa vie ?`,
            `Que dirais-tu à un ami qui se trouve moche ?`,
            `Que dirais-tu à une amie qui s'ennuie terriblement ?`
        ]
    }
}