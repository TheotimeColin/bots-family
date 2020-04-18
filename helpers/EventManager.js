module.exports = class EventManager {

    constructor () {
        this.$listeners = {}
    }

    addListener({ id, event, target, action }) {
        this.$listeners[id] = { event, target, action }
        target.on(event, action)
    }

    addReactionListener({ id, target, action }) {
        let event = 'collect'
        target = target.createReactionCollector(v => v, { time: 99999999 })

        this.$listeners[id] = { event, target, action }
        target.on(event, action)    
    }

    removeListener(id) {
        let listener = this.$listeners[id]
        listener.target.removeListener(listener.event, listener.action),
        delete this.$listeners[id]
    }

    reset () {
        Object.keys(this.$listeners).forEach(key => {
            console.log(key)
            this.removeListener(key)
        })
    }

}