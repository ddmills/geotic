import Component from './Component';

export default class Entity {
    _components = {};

    get components() {
        return this._components;
    }

    has(typeOrClass) {
        if (typeof typeOrClass === 'string') {
            return this.components.hasOwnProperty(typeOrClass);
        }

        if (typeOrClass.prototype instanceof Component) {
            return this.components.hasOwnProperty(typeOrClass.name);
        }

        return false;
    }

    get(type) {
        const all = this.components[type];

        if (all) {
            const first = all[0];

            return first.allowMultiple ? all : first;
        }

        return null;
    }

    add(component) {
        if (component.isAttached) {
            console.warn(`Cannot add "${component.type}" component since it is already attached to an entity.`);
        }

        if (!component.allowMultiple && this.has(component.type)) {
            console.warn(`"${component.type}" component has allowMultiple set to ${component.allowMultiple}. Trying to add a "${component.type}" component to an entity which already has one.`);
            return false;
        }

        if (!this.components[component.type]) {
            this.components[component.type] = [];
        }

        this.components[component.type].push(component);

        component._onAttached(this);

        return true;
    }

    owns(component) {
        return component.entity === this;
    }

    remove(component) {
        const type = typeof component === 'string' ? component : component.type;

        const all = this.components[type];
        const idx = all.indexOf(component);

        if (idx < 0) {
            console.warn(`Trying to remove a "${type}" component from an entity to whom it doesn't belong`);
            return false;
        }

        all.splice(idx, 1);

        component._onDetached();

        return true;
    }
}
