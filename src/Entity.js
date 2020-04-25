import Component from './Component';
import ComponentRegistry from './ComponentRegistry';

export default class Entity {
    #id = null;
    #components = {};
    #ecs = null;

    get id() {
        return this.#id;
    }

    get ecs() {
        return this.#ecs;
    }

    get components() {
        return this.#components;
    }

    constructor(ecs, id = null) {
        this.#ecs = ecs;
        this.#id = id || ecs.generateId();
    }

    has(typeOrClass, accessor = null) {
        const type = ComponentRegistry._getType(typeOrClass);
        const hasType = this.hasOwnProperty(type);

        if (hasType && accessor) {
            return this[type].hasOwnProperty(accessor);
        }

        return hasType;
    }

    get(typeOrClass, accessor = null) {
        const type = ComponentRegistry._getType(typeOrClass);
        const components = this[type];

        if (components && accessor) {
            return components[accessor];
        }

        return components;
    }

    add(component) {
        if (component.isAttached) {
            console.warn(
                `Cannot add "${component.type}" component since it is already attached to an entity.`
            );
        }

        if (!component.allowMultiple) {
            if (this.has(component.type)) {
                console.warn(
                    `"${component.type}" component has allowMultiple set to ${component.allowMultiple}. Trying to add a "${component.type}" component to an entity which already has one.`
                );
                return false;
            }

            this.components[component.type] = component;

            Object.defineProperty(this, component.type, {
                enumerable: true,
                configurable: true,
                get() {
                    return this.components[component.type];
                },
            });

            component._onAttached(this);
            return true;
        }

        if (!component.accessorProperty) {
            console.warn(
                `"${component.type}" component has allowMultiple set to ${component.allowMultiple}, but the "accessorProperty" is not defined.`
            );
            return false;
        }

        if (!component.accessor) {
            console.warn(
                `"${component.type}" component has a falsy accessor of "${component.accessor}". The accessorProperty is set to "${component.accessorProperty}".`
            );
            return false;
        }

        if (!this.components[component.type]) {
            this.components[component.type] = {};
            Object.defineProperty(this, component.type, {
                configurable: true,
                enumerable: true,
                get() {
                    return this.components[component.type];
                },
            });
        }

        this.components[component.type][component.accessor] = component;

        component._onAttached(this);

        return true;
    }

    owns(component) {
        return component.entity === this;
    }

    remove(typeOrClassOrComponent, accessor = null) {
        accessor =
            typeOrClassOrComponent instanceof Component
                ? typeOrClassOrComponent.accessor
                : accessor;
        const definition = this.ecs.registry.get(typeOrClassOrComponent);

        if (definition.allowMultiple) {
            if (!accessor) {
                console.warn(
                    `Trying to remove a "${definition.type}" component which allows multiple without specifying an accessor.`
                );
                return;
            }

            const all = this.components[definition.type];
            const component = all[accessor];

            if (component) {
                delete all[accessor];
                component._onDetached();
                return component;
            } else {
                console.warn(
                    `Trying to remove a "${definition.type}" component from an entity at "${accessor}", but it wasn't found.`
                );
                return;
            }
        }

        if (definition.type in this) {
            const component = this.components[definition.type];

            delete this[definition.type];
            delete this.components[definition.type];
            component._onDetached();

            return component;
        }

        console.warn(
            `Trying to remove a "${definition.type}" component from an entity, but it wasn't found.`
        );
    }

    serialize() {
        return Object.entries(this.components).reduce(
            (o, [key, value]) => {
                if (value instanceof Component) {
                    return {
                        ...o,
                        [key]: value.serialize(),
                    };
                }

                return {
                    ...o,
                    [key]: Object.entries(value).reduce(
                        (o2, [k2, v2]) => ({
                            ...o2,
                            [k2]: v2.serialize(),
                        }),
                        {}
                    ),
                };
            },
            {
                id: this.id,
            }
        );
    }
}
