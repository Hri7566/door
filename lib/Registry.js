module.exports = class Registry {
    constructor (data) {
        if (typeof(data) !== "undefined") {
            this.register = data;
        } else {
            this.register = {};
        }
    }

    registerObject(namespace, obj) {
        this.register[`${namespace}`] = obj;
    }
}