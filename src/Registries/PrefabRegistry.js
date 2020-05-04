import Component from '../Component';
import PrefabComponent from '../PrefabComponent';
import Prefab from '../Prefab';

export default class PrefabRegistry {
    #prefabs = {};
    #ecs = null;

    constructor(ecs) {
        this.#ecs = ecs;
    }

    deserialize(data) {
        const registered = this.get(data.name);

        if (registered) {
            return registered;
        }

        const prefab = new Prefab(this.#ecs, data.name);

        let inherit;

        if (Array.isArray(data.inherit)) {
            inherit = data.inherit;
        } else if (typeof data.inherit === 'string') {
            inherit = [data.inherit];
        } else {
            inherit = [];
        }

        prefab.inherit = inherit.map((parent) => {
            const ref = this.get(parent);

            if (!ref) {
                console.warn(
                    `Prefab "${data.name}" cannot inherit from Prefab "${parent}" because is not registered yet! Prefabs must be registered in the right order.`
                );
                return parent;
            }

            return ref;
        });

        const comps = data.components || [];

        for (const componentData of comps) {
            if (
                typeof componentData === 'string' ||
                componentData.prototype instanceof Component
            ) {
                const def = this.#ecs.components.get(componentData);
                if (def) {
                    prefab.addComponent(new PrefabComponent(def));
                }
            } else if (typeof componentData === 'object') {
                const type = componentData.type;
                const def = this.#ecs.components.get(type);
                if (def) {
                    prefab.addComponent(
                        new PrefabComponent(
                            def,
                            componentData.properties,
                            componentData.overwrite
                        )
                    );
                }
            } else {
                console.warn(
                    `Unrecognized component reference "${componentData}" in prefab "${data.name}". Ensure the component is registered before the prefab.`
                );
            }
        }

        this.register(prefab);

        return prefab;
    }

    register(prefab) {
        this.#prefabs[prefab.name] = prefab;
    }

    get(nameOrClassOrPrefab) {
        const name = PrefabRegistry._getName(nameOrClassOrPrefab);

        return this.#prefabs[name];
    }

    create(nameOrClass, initialProps = {}) {
        const prefab = this.get(nameOrClass);

        if (!prefab) {
            console.warn(
                `Could not instantiate prefab for ${nameOrClass} since it is not registered`
            );

            return;
        }

        const entity = this.#ecs.createEntity();
        prefab.applyToEntity(entity, initialProps);

        return entity;
    }

    static _getName(nameOrClassOrPrefab) {
        if (typeof nameOrClassOrPrefab === 'string') {
            return nameOrClassOrPrefab;
        }

        if (nameOrClassOrPrefab instanceof Prefab) {
            return nameOrClassOrPrefab.name;
        }

        if (nameOrClassOrPrefab.prototype instanceof Prefab) {
            return nameOrClassOrPrefab.name;
        }

        return null;
    }
}
