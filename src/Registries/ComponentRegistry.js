import Component from '../Component';
import { camelString } from '../util/string-util';

export default class ComponentRegistry {
    _definitions = new Map();
    _ecs = null;

    constructor(ecs) {
        this._ecs = ecs;
    }

    register(component) {
        this._definitions.set(component.name, component);
        camelString(component.name); // prime camelcase cache
    }

    getAccessor(type) {
        return camelString(type);
    }

    get(typeOrClassOrComponent) {
        const type = this._getType(typeOrClassOrComponent);

        if (!type) {
            console.warn(
                `Cannot get component definition for type or class ${typeOrClassOrComponent} since it is neither a Component class or type (string)`
            );
            return null;
        }

        return this._definitions.get(type);
    }

    create(typeOrClass, properties = {}) {
        const definition = this.get(typeOrClass);

        if (definition) {
            return new definition(this._ecs, properties);
        }

        console.warn(
            `Could not create component definition for ${typeOrClass} since it is not registered`
        );
    }

    _getType(typeOrClassOrComponent) {
        if (typeof typeOrClassOrComponent === 'string') {
            return typeOrClassOrComponent;
        }

        if (typeOrClassOrComponent instanceof Component) {
            return typeOrClassOrComponent.type;
        }

        if (typeOrClassOrComponent.prototype instanceof Component) {
            return typeOrClassOrComponent.name;
        }

        return null;
    }
}
