import { camelString } from './util/string-util';

export class EntityEvent {
    data = {};
    prevented = false;
    handled = false;

    constructor(name, data = {}) {
        this.name = name;
        this.data = data;
        this.handlerName = camelString(`on ${this.name}`);
    }

    is(name) {
        return this.name === name;
    }

    handle() {
        this.handled = true;
        this.prevented = true;
    }

    prevent() {
        this.prevented = true;
    }
}
