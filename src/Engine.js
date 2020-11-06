import ComponentRegistry from './registries/ComponentRegistry';
import PrefabRegistry from './registries/PrefabRegistry';
import { nanoid } from 'nanoid/non-secure';
import EntityRegistry from './registries/EntityRegistry';
import QueryRegistry from './registries/QueryRegistry';
import PropertyRegistry from './Registries/PropertyRegistry';

export default class Engine {
    constructor() {
        this.idGenerator = () => nanoid();
        this.components = new ComponentRegistry(this);
        this.prefabs = new PrefabRegistry(this);
        this.entities = new EntityRegistry(this);
        this.queries = new QueryRegistry(this);
        this.properties = new PropertyRegistry(this);
    }

    generateId() {
        return this.idGenerator();
    }

    createEntity() {
        return this.entities.create();
    }

    createPrefab(nameOrClass, initialProps = {}) {
        return this.prefabs.create(nameOrClass, initialProps);
    }

    destroyEntity(entity) {
        return this.entities.destroy(entity);
    }

    registerPrefab(data) {
        this.prefabs.deserialize(data);
    }

    registerComponent(component) {
        this.components.register(component);
    }

    registerProperty(property) {
        this.properties.register(property);
    }

    getEntity(id) {
        return this.entities.get(id);
    }

    createComponent(type, properties) {
        return this.components.create(type, properties);
    }

    createQuery(filters) {
        return this.queries.create(filters);
    }

    serialize() {
        return {
            entities: this.entities.serialize(),
        };
    }

    deserialize(data) {
        if (data.id) {
            return this.entities.deserializeEntity(data);
        }

        return this.entities.deserialize(data);
    }
}
