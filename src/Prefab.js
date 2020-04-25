export default class Prefab {
    name = '';
    inherit = [];
    components = [];

    constructor(name) {
        this.name = name;
    }

    addComponent(prefabComponent) {
        this.components.push(prefabComponent);
    }

    applyToEntity(entity) {
        this.inherit.forEach((parent) => {
            parent.applyToEntity(entity);
        });

        this.components.forEach((component) => {
            component.applyToEntity(entity);
        });

        return entity;
    }
}
