export default class Prefab {
    name = '';
    inherit = [];
    components = [];

    constructor(ecs, name) {
        this.ecs = ecs;
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
            const accessor = this.ecs.components.getAccessor(definition.type);

            let initialCompProps = {};

            if (definition.allowMultiple) {
                if (definition.keyProperty) {
                    const key = component.properties[definition.keyProperty];

                    if (
                        initialProps[accessor] &&
                        initialProps[accessor][key]
                    ) {
                        initialCompProps =
                            initialProps[accessor][key];
                    }
                } else {
                    if (!arrComps[accessor]) {
                        arrComps[accessor] = 0;
                    }

                    if (
                        initialProps[accessor] &&
                        initialProps[accessor][
                            arrComps[accessor]
                        ]
                    ) {
                        initialCompProps =
                            initialProps[accessor][
                                arrComps[accessor]
                            ];
                    }

                    arrComps[accessor]++;
                }
            } else {
                initialCompProps = initialProps[accessor];
            }

            component.applyToEntity(entity, initialCompProps);
        });

        return entity;
    }
}
