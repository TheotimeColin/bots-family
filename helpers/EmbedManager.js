module.exports = class EmbedManager {

    constructor ({ color, title, description, thumbnail, fields = {} }) {
        this.$props = {}

        Object.keys(fields).forEach(id => {
            fields[id] = {
                enabled: fields[id].enabled === false ? false : true,
                ...fields[id]
            }
        })

        this.$state = {
            message: null,
            color,
            title,
            description,
            thumbnail,
            fields: fields
        }
    }

    editInfo (params, update = true) {
        this.$state = {
            ...this.$state,
            ...params
        }

        if (update) this.update()
    }
    
    addFields (fields) {
        Object.keys(fields).forEach(id => {
            this.$state.fields[id] = {
                enabled: fields[id].enabled === false ? false : true,
                ...fields[id]
            }
        })

        this.update()
    }

    addField (id, params) {
        this.$state.fields[id] = {
            enabled: params.enabled === false ? false : true,
            ...params
        }

        this.update()
    }

    editField (id, params) {
        this.$state.fields[id] = {
            ...this.$state.fields[id],
            ...params
        }

        this.update()
    }

    editFields (params) {
        new Promise (async resolve => {
            Object.keys(params).forEach(key => {
                this.$state.fields[key] = {
                    ...this.$state.fields[key],
                    ...params[key]
                }
            })
        
            await this.update()

            resolve(true)
        })
    }

    toggleFields (ids, action) {
        ids.forEach(id => {
            this.$state.fields[id].enabled = action
        })

        this.update()
    }

    toggleField (id, action) {
        this.$state.fields[id].enabled = action

        this.update()
    }

    getEmbed () {
        let fields = Object.keys(this.$state.fields).filter(id => this.$state.fields[id].enabled)
        console.log(fields)
        return {
            color: this.$state.color,
            title: this.$state.title,
            description: this.$state.description,
            thumbnail: { url: this.$state.thumbnail },
            fields: fields.map(id => ({ name: this.$state.fields[id].title ? this.$state.fields[id].title : '\u200B', value: this.$state.fields[id].description ? this.$state.fields[id].description : '\u200B' }))
        }
    }

    sendTo (channel) {
        return new Promise(resolve => {
            channel.send({ embed: this.getEmbed() }).then(message => {
                this.$state.message = message
                resolve(message)

                return message
            })
        })
    }

    update () {
        if (this.$state.message) {
            new Promise (resolve => {
                this.$state.message.edit({ embed: this.getEmbed() }).then(() => {
                    resolve(true)
                })
            })
        }
    }
}