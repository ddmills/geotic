import { ComponentRegistry } from './ComponentRegistry';
import { World } from './World';

export class Engine {
    _components = new ComponentRegistry();

    registerComponent(clazz) {
        this._components.register(clazz);
    }

    createWorld() {
        return new World(this);
    }
}
