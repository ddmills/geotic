export default class EntityEvent {
    data = {};
    _prevented = false;
    _handled = false;

    get prevented() {
        return this._prevented;
    }

    get handled() {
        return this._handled;
    }

    constructor(name, data = {}) {
        this.name = name;
        this.data = data;
    }

    is(name) {
        return this.name === name;
    }

    handle() {
        this._handled = true;
        this._prevented = true;
    }

    prevent() {
        this._prevented = true;
    }
}
