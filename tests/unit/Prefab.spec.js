import Engine from '../../src/Engine';
import {
    EmptyComponent,
    SimpleComponent,
    ArrayComponent,
    NestedComponent,
    EntityRefComponent,
    EntityRefArrayComponent,
} from '../data/components';
import {
    SimplePrefab,
    EmptyPrefab,
    PrefabWithKeyedAndArray,
    PrefabWithEntityRefs,
} from '../data/prefabs';

describe('Entity', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();
        engine.registerComponent(EmptyComponent);
        engine.registerComponent(SimpleComponent);
        engine.registerComponent(ArrayComponent);
        engine.registerComponent(NestedComponent);
        engine.registerComponent(EntityRefComponent);
        engine.registerComponent(EntityRefArrayComponent);
    });

    describe('prefab with no components', () => {
        let entity;

        beforeEach(() => {
            engine.registerPrefab(EmptyPrefab);

            entity = engine.createPrefab('EmptyPrefab');
        });

        it('should create an entity', () => {
            expect(entity).toBeDefined();
        });
    });

    describe('prefab with basic components', () => {
        let entity;

        beforeEach(() => {
            engine.registerPrefab(SimplePrefab);
        });

        describe('with no prop overrides', () => {
            beforeEach(() => {
                entity = engine.createPrefab('SimplePrefab');
            });

            it('should create an entity', () => {
                expect(entity).toBeDefined();
            });

            it('should have the components', () => {
                expect(entity.has('EmptyComponent')).toBe(true);
                expect(entity.has('SimpleComponent')).toBe(true);
            });

            it('should assign component prop data from the prefab', () => {
                expect(entity.simpleComponent.testProp).toBe('testPropValue');
            });
        });

        describe('with initial props', () => {
            let initialProps;

            beforeEach(() => {
                initialProps = {
                    simpleComponent: {
                        testProp: chance.string(),
                    },
                };

                entity = engine.createPrefab('SimplePrefab', initialProps);
            });

            it('should create an entity', () => {
                expect(entity).toBeDefined();
            });

            it('should have the components', () => {
                expect(entity.has('EmptyComponent')).toBe(true);
                expect(entity.has('SimpleComponent')).toBe(true);
            });

            it('should assign component prop data from the initial props', () => {
                expect(entity.simpleComponent.testProp).toBe(
                    initialProps.simpleComponent.testProp
                );
            });
        });
    });

    describe('prefab with entity ref components', () => {
        let entity;

        beforeEach(() => {
            engine.registerPrefab(PrefabWithEntityRefs);
        });

        describe('with no prop overrides', () => {
            beforeEach(() => {
                entity = engine.createPrefab('PrefabWithEntityRefs');
            });

            it('should create an entity', () => {
                expect(entity).toBeDefined();
            });

            it('should have the components', () => {
                expect(entity.has('EntityRefComponent')).toBe(true);
                expect(entity.has('EntityRefArrayComponent')).toBe(true);
            });

            it('should assign component prop data from the prefab', () => {
                expect(entity.entityRefComponent.otherEntity).toBeUndefined();
                expect(
                    entity.entityRefArrayComponent.otherEntities
                ).toHaveLength(0);
            });
        });

        describe('with initial props', () => {
            let initialProps, expectedRefEntity, expectedRefArrayEntities;

            beforeEach(() => {
                expectedRefEntity = engine.createEntity();
                expectedRefArrayEntities = [
                    engine.createEntity(),
                    engine.createEntity(),
                    engine.createEntity(),
                ];
                initialProps = {
                    entityRefComponent: {
                        otherEntity: expectedRefEntity.id,
                    },
                    entityRefArrayComponent: {
                        otherEntities: expectedRefArrayEntities.map(
                            (e) => e.id
                        ),
                    },
                };

                entity = engine.createPrefab(
                    'PrefabWithEntityRefs',
                    initialProps
                );
            });

            it('should create an entity', () => {
                expect(entity).toBeDefined();
            });

            it('should have the components', () => {
                expect(entity.has('EntityRefComponent')).toBe(true);
                expect(entity.has('EntityRefArrayComponent')).toBe(true);
            });

            it('should assign component prop data from the initial props', () => {
                expect(entity.entityRefComponent.otherEntity).toStrictEqual(
                    expectedRefEntity
                );
                expect(
                    entity.entityRefArrayComponent.otherEntities
                ).toStrictEqual(expectedRefArrayEntities);
            });
        });
    });

    describe('prefab with array and keyed components', () => {
        let entity;

        beforeEach(() => {
            engine.registerPrefab(PrefabWithKeyedAndArray);
        });

        describe('with no prop overrides', () => {
            beforeEach(() => {
                entity = engine.createPrefab('PrefabWithKeyedAndArray');
            });

            it('should create an entity', () => {
                expect(entity).toBeDefined();
            });

            it('should have the components', () => {
                expect(entity.has('ArrayComponent')).toBe(true);
                expect(entity.has('NestedComponent')).toBe(true);
                expect(entity.arrayComponent).toHaveLength(2);
                expect(entity.nestedComponent.one).toBeDefined();
                expect(entity.nestedComponent.two).toBeDefined();
            });

            it('should assign component prop data from the prefab', () => {
                expect(entity.arrayComponent[0].name).toBe('a');
                expect(entity.arrayComponent[1].name).toBe('b');
                expect(entity.nestedComponent.one.name).toBe('one');
                expect(entity.nestedComponent.two.name).toBe('two');
            });
        });

        describe('with initial props', () => {
            let initialProps;

            beforeEach(() => {
                initialProps = {
                    nestedComponent: {
                        one: { hello: chance.word() },
                        two: { hello: chance.word() },
                    },
                    arrayComponent: [
                        { name: chance.word() },
                        { name: chance.word() },
                    ],
                };

                entity = engine.createPrefab(
                    'PrefabWithKeyedAndArray',
                    initialProps
                );
            });

            it('should create an entity', () => {
                expect(entity).toBeDefined();
            });

            it('should have the components', () => {
                expect(entity.has('ArrayComponent')).toBe(true);
                expect(entity.has('NestedComponent')).toBe(true);
                expect(entity.arrayComponent).toHaveLength(2);
                expect(entity.nestedComponent.one).toBeDefined();
                expect(entity.nestedComponent.two).toBeDefined();
            });

            it('should assign component prop data from the initial props', () => {
                expect(entity.arrayComponent[0].name).toBe(
                    initialProps.arrayComponent[0].name
                );
                expect(entity.arrayComponent[1].name).toBe(
                    initialProps.arrayComponent[1].name
                );
                expect(entity.nestedComponent.one.hello).toBe(
                    initialProps.nestedComponent.one.hello
                );
                expect(entity.nestedComponent.two.hello).toBe(
                    initialProps.nestedComponent.two.hello
                );
            });
        });
    });
});
