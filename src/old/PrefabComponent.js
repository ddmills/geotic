import merge from 'deepmerge';

export default class PrefabComponent {
    get type() {
        return this.componentDef.type;
    }

    constructor(componentDef, properties = {}, overwrite = true) {
        this.componentDef = componentDef;
        this.properties = properties;
        this.overwrite = overwrite;
    }

    applyToEntity(entity, initialProps = {}) {
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

        const props = merge(this.properties, initialProps);

        entity.add(this.componentDef, props);
    }
}
