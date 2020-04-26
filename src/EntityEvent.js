export default class EntityEvent {
    data = {};
    #prevented = false;
    #handled = false;

    get prevented() {
        return this.#prevented;
    }

    get handled() {
        return this.#handled;
    }

    constructor(name, data = {}) {
        this.name = name;
        this.data = data;
    }

    is(name) {
        return this.name === name;
    }

    handle() {
        this.#handled = true;
        this.#prevented = true;
    }

    prevent() {
        this.#prevented = true;
    }
}
