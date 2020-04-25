import ComponentRegistry from './Registries/ComponentRegistry';
import PrefabRegistry from './Registries/PrefabRegistry';
import { nanoid } from 'nanoid/non-secure';
import EntityRegistry from './Registries/EntityRegistry';

export default class ECSManager {
    constructor() {
        this.idGenerator = () => nanoid();
        this.components = new ComponentRegistry(this);
        this.prefabs = new PrefabRegistry(this);
        this.entities = new EntityRegistry(this);
    }

    generateId() {
        return this.idGenerator();
    }

    createEntity() {
        return this.entities.create();
    }

    createPrefab(nameOrClass) {
        return this.prefabs.create(nameOrClass);
    }

    registerEntity(entity) {
        return this.entities.register(entity);
    }

    registerPrefab(data) {
        this.prefabs.deserialize(data);
    }

    registerComponent(component) {
        this.components.register(component);
    }

    getEntity(id) {
        this.entities.get(id);
    }

    createComponent(type, properties) {
        return this.components.create(type, properties);
    }

    serialize() {
        return {
            entities: this.entities.serialize(),
        };
    }

    deserialize(data) {
        if (data.id) {
            return this.entities.deserialize(data);
        }

        return data.entities.map((entityData) =>
            this.entities.deserialize(entityData)
        );
    }
}
