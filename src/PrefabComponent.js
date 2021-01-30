import merge from 'deepmerge';

export default class PrefabComponent {
    constructor(clazz, properties = {}, overwrite = true) {
        this.clazz = clazz;
        this.properties = properties;
        this.overwrite = overwrite;
    }

    applyToEntity(entity, initialProps = {}) {
        if (!this.clazz.allowMultiple && entity.has(this.clazz)) {
            if (!this.overwrite) {
                return;
            }

            entity.remove(this.clazz);
        }

        const props = merge(this.properties, initialProps);

        entity.add(this.clazz, props);
    }
}
