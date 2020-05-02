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

    applyToEntity(entity, initialProps = {}) {
        this.inherit.forEach((parent) => {
            parent.applyToEntity(entity, initialProps);
        });

        const arrComps = {};

        this.components.forEach((component, i) => {
            const definition = component.componentDef;

            let initialCompProps = {};

            if (definition.allowMultiple) {
                if (definition.keyProperty) {
                    const key = component.properties[definition.keyProperty];

                    if (
                        initialProps[definition.primaryKey] &&
                        initialProps[definition.primaryKey][key]
                    ) {
                        initialCompProps =
                            initialProps[definition.primaryKey][key];
                    }
                } else {
                    if (!arrComps[definition.primaryKey]) {
                        arrComps[definition.primaryKey] = 0;
                    }

                    if (
                        initialProps[definition.primaryKey] &&
                        initialProps[definition.primaryKey][
                            arrComps[definition.primaryKey]
                        ]
                    ) {
                        initialCompProps =
                            initialProps[definition.primaryKey][
                                arrComps[definition.primaryKey]
                            ];
                    }

                    arrComps[definition.primaryKey]++;
                }
            } else {
                initialCompProps = initialProps[definition.primaryKey];
            }

            component.applyToEntity(entity, initialCompProps);
        });

        return entity;
    }
}
