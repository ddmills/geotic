export default class PrefabComponent {
    get type() {
        return this.componentDef.type;
    }

    constructor(componentDef, initialProperties = {}, overwrite = true) {
        this.componentDef = componentDef;
        this.initialProperties = initialProperties;
        this.overwrite = overwrite;
    }

    applyToEntity(entity) {
        if (!this.componentDef.allowMultiple && entity.has(this.componentDef)) {
            if (this.overwrite) {
                entity.remove(this.componentDef);
            } else {
                console.log(
                    `Ignoring prefab component "${this.type}" since the entity "${entity.id}" already has one.`
                );
                return;
            }
        }

        entity.add(
            entity.ecs.createComponent(
                this.componentDef,
                this.initialProperties
            )
        );
    }
}
