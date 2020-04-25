export default class Prefab {
    name = '';
    inherit = [];
    components = [];

    constructor(name) {
        this.name = name;
    }

    addComponent(definition, initialProperties = {}, overwrite = true) {
        this.components.push({
            definition,
            initialProperties,
            overwrite,
        });
    }

    applyToEntity(entity) {
        this.inherit.forEach((parent) => {
            parent.applyToEntity(entity);
        });

        this.components.forEach((component) => {
            if (
                !component.definition.allowMultiple &&
                entity.has(component.definition)
            ) {
                if (component.overwrite) {
                    entity.remove(component.definition);
                } else {
                    return;
                }
            }

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
