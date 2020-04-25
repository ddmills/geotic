export default class Prefab {
    name = '';
    inherit = [];
    components = [];

    constructor(name) {
        this.name = name;
    }

    addComponent(definition, initialProperties = {}) {
        this.components.push({
            definition,
            initialProperties,
        });
    }

    applyToEntity(entity) {
        this.inherit.forEach((parent) => {
            parent.applyToEntity(entity);
        });

        this.components.forEach((component) => {
            entity.add(
                entity.ecs.createComponent(
                    component.definition,
                    component.initialProperties
                )
            );
        });

        return entity;
    }
}
