import { Entity } from './Entity';

export class World {
    _id = 0;
    _entities = {};

    constructor(engine) {
        this.engine = engine;
    }

    createId() {
        return ++this._id;
    }

    createEntity(id = this.createId()) {
        return new Entity(this, id);
    }
}
