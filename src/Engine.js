import { ComponentRegistry } from './ComponentRegistry';
import { PrefabRegistry } from './PrefabRegistry';
import { World } from './World';

export class Engine {
    _components = new ComponentRegistry();
    _prefabs = new PrefabRegistry(this);

    registerComponent(clazz) {
        this._components.register(clazz);
    }

    registerPrefab(data) {
        this._prefabs.register(data);
    }

    createWorld() {
        return new World(this);
    }

    destroyWorld(world) {
        world.destroy();
    }
}
