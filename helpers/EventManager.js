module.exports = class EventManager {

    constructor () {
        this.$listeners = {}
    }

    addListener({ id, event, target, action }) {
        this.$listeners[id] = { event, target, action }
        target.on(event, action)
    }

    removeListener(id) {
        let listener = this.$listeners[id]
        listener.target.removeListener(listener.event, listener.action),
        this.$listeners[id] = null
    }

}