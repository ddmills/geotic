import Property from '../Property';
import EntityProperty from '../Properties/EntityProperty';
import EntityArrayProperty from '../Properties/EntityArrayProperty';
import SimpleProperty from '../Properties/SimpleProperty';

export default class PropertyRegistry {
    #ecs;
    #properties = new Map();

    constructor(ecs) {
        this.#ecs = ecs;

        this.register(EntityProperty);
        this.register(EntityArrayProperty);
    }

    register(property) {
        this.#properties.set(property.tag, property);
    }

    getByBaseValue(baseValue) {
        if (this.isDefinedPropertyType(baseValue)) {
            return this.get(baseValue);
        }

        return SimpleProperty;
    }

    get(tagOrClassOrProperty) {
        const name = PropertyRegistry._getName(tagOrClassOrProperty);

        return this.#properties.get(name);
    }

    create(tagOrClassOrProperty, component) {
        const property = this.get(tagOrClassOrProperty);

        return new property(component);
    }

    isDefinedPropertyType(baseValue) {
        if (typeof baseValue === 'string') {
            const v = baseValue.replace(/^<|>$/g, '');

            return this.#properties.has(v);
        }

        return false
    }

    static _getName(tagOrClassOrProperty) {
        if (typeof tagOrClassOrProperty === 'string') {
            return tagOrClassOrProperty.replace(/^<|>$/g, '');
        }

        if (tagOrClassOrProperty instanceof Property) {
            return tagOrClassOrProperty.tag;
        }

        if (tagOrClassOrProperty.prototype instanceof Property) {
            return tagOrClassOrProperty.tag;
        }

        return null;
    }
}
