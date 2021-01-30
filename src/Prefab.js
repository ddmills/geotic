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

    applyToEntity(entity, prefabProps = {}) {
        this.inherit.forEach((parent) => {
            parent.applyToEntity(entity, prefabProps);
        });

        const arrComps = {};

        this.components.forEach((component) => {
            const clazz = component.clazz;
            const ckey = clazz.prototype._ckey;

            let initialCompProps = {};

            if (clazz.allowMultiple) {
                if (clazz.keyProperty) {
                    const key = component.properties[clazz.keyProperty];

                    if (prefabProps[ckey] && prefabProps[ckey][key]) {
                        initialCompProps = prefabProps[ckey][key];
                    }
                } else {
                    if (!arrComps[ckey]) {
                        arrComps[ckey] = 0;
                    }

                    if (
                        prefabProps[ckey] &&
                        prefabProps[ckey][arrComps[ckey]]
                    ) {
                        initialCompProps = prefabProps[ckey][arrComps[ckey]];
                    }

                    arrComps[ckey]++;
                }
            } else {
                initialCompProps = prefabProps[ckey];
            }

            component.applyToEntity(entity, initialCompProps);
        });

        return entity;
    }
}
