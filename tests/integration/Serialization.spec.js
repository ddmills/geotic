import { Engine } from '../../src/Engine';
import {
    EmptyComponent,
    SimpleComponent,
    NestedComponent,
    ArrayComponent,
} from '../data/components';

describe('Serialization', () => {
    let world;

    beforeEach(() => {
        const engine = new Engine();

        engine.registerComponent(EmptyComponent);
        engine.registerComponent(SimpleComponent);
        engine.registerComponent(NestedComponent);
        engine.registerComponent(ArrayComponent);

        world = engine.createWorld();
    });

    describe('serializing', () => {
        let entity,
            json,
            nestedKeyA,
            nestedKeyB;

        beforeEach(() => {
            nestedKeyA = chance.word();
            nestedKeyB = chance.word();

            entity = world.createEntity();
            entity.add(EmptyComponent);
            entity.add(SimpleComponent, { testProp: chance.string() });
            entity.add(ArrayComponent, { name: chance.word() });
            entity.add(ArrayComponent, { name: chance.word() });
            entity.add(NestedComponent, { name: nestedKeyA });
            entity.add(NestedComponent, { name: nestedKeyB });
        });

        describe('when no entities are specified', () => {
            beforeEach(() => {
                json = world.serialize();
            });

            it('should save all entities and component data', () => {
                expect(json).toEqual({
                    entities: [
                        {
                            id: entity.id,
                            emptyComponent: {},
                            simpleComponent: {
                                testProp: entity.simpleComponent.testProp,
                            },
                            arrayComponent: [
                                {
                                    name: entity.arrayComponent[0].name,
                                    hello: 'world',
                                },
                                {
                                    name: entity.arrayComponent[1].name,
                                    hello: 'world',
                                },
                            ],
                            nestedComponent: {
                                [nestedKeyA]: {
                                    name: nestedKeyA,
                                    hello: 'world',
                                },
                                [nestedKeyB]: {
                                    name: nestedKeyB,
                                    hello: 'world',
                                },
                            }
                        },
                    ],
                });
            });
        });

        describe('when a list of entities is specified', () => {
            let otherEntity;

            beforeEach(() => {
                otherEntity = world.createEntity();

                json = world.serialize([otherEntity, entity]);
            });

            it('should keep all refs', () => {
                expect(json).toEqual({
                    entities: [
                        { id: otherEntity.id },
                        {
                            id: entity.id,
                            emptyComponent: {},
                            simpleComponent: {
                                testProp: entity.simpleComponent.testProp,
                            },
                            arrayComponent: [
                                {
                                    name: entity.arrayComponent[0].name,
                                    hello: 'world',
                                },
                                {
                                    name: entity.arrayComponent[1].name,
                                    hello: 'world',
                                },
                            ],
                            nestedComponent: {
                                [nestedKeyA]: {
                                    name: nestedKeyA,
                                    hello: 'world',
                                },
                                [nestedKeyB]: {
                                    name: nestedKeyB,
                                    hello: 'world',
                                },
                            }
                        },
                    ],
                });
            });
        });
    });

    describe('deserializing', () => {
        let json,
            entityId,
            nestedNameA,
            nestedNameB;

        beforeEach(() => {
            entityId = chance.guid();
            nestedNameA = chance.word();
            nestedNameB = chance.word();

            json = {
                entities: [
                    {
                        id: entityId,
                        emptyComponent: {},
                        simpleComponent: { testProp: chance.string() },
                        arrayComponent: [
                            { name: chance.word(), hello: chance.word() },
                            { name: chance.word(), hello: chance.word() },
                        ],
                        nestedComponent: {
                            [nestedNameA]: {
                                name: nestedNameA,
                                hello: chance.word(),
                            },
                            [nestedNameB]: {
                                name: nestedNameB,
                                hello: chance.word(),
                            },
                        }
                    },
                ],
            };

            world.deserialize(json);
        });

        it('should serialize back into the same json', () => {
            expect(world.serialize()).toEqual(json);
        });

        it('should have all the same components', () => {
            const entity = world.getEntity(entityId);

            expect(entity.has(EmptyComponent)).toBe(true);
            expect(entity.has(SimpleComponent)).toBe(true);
            expect(entity.has(ArrayComponent)).toBe(true);
            expect(entity.has(NestedComponent)).toBe(true);
        });

        it('should get component properties correct', () => {
            const entity = world.getEntity(entityId);

            const expected = json.entities[3];

            expect(entity.simpleComponent.properties).toEqual(
                expected.simpleComponent
            );
            expect(entity.nestedComponent[nestedNameA].properties).toEqual(
                expected.nestedComponent[nestedNameA]
            );
            expect(entity.nestedComponent[nestedNameB].properties).toEqual(
                expected.nestedComponent[nestedNameB]
            );
        });
    });
});
