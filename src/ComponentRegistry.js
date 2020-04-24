import Component from './Component';

const getType = (typeOrClass) => {
    if (typeof typeOrClass === 'string') {
        return typeOrClass;
    }

    if (typeOrClass instanceof Component) {
        return typeOrClass.type;
    }

    if (typeOrClass.prototype instanceof Component) {
        return typeOrClass.type;
    }

    return null;
}

export default class ComponentRegistry {
    #definitions = {};
    #ecs = null;

    constructor(ecs) {
        this.#ecs = ecs;
    }

    register(component) {
        this.#definitions[component.name] = component;
    }

    get(typeOrClassOrComponent) {
        const type = getType(typeOrClassOrComponent);

        if (!type) {
            console.warn(`Cannot get component definition for type or class ${typeOrClassOrComponent} since it is neither a Component class or type (string)`);
            return null;
        }

        return this.#definitions[type];
    }

    create(typeOrClass, properties = {}) {
        const definition = this.get(typeOrClass);

        if (definition) {
            return new definition(this.#ecs, properties);
        }

        console.warn(`Could not create component definition for ${typeOrClass} since it is not registered`);
    }
}
