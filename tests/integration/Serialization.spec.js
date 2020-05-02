import Engine from '../../src/Engine';
import {
    EmptyComponent,
    SimpleComponent,
    NestedComponent,
    ArrayComponent,
    EntityRefComponent,
    EntityRefArrayComponent,
} from '../data/components';
import Component from '../../src/Component';

describe('Serialization', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();

        engine.registerComponent(EmptyComponent);
        engine.registerComponent(SimpleComponent);
        engine.registerComponent(NestedComponent);
        engine.registerComponent(ArrayComponent);
        engine.registerComponent(EntityRefComponent);
        engine.registerComponent(EntityRefArrayComponent);
    });

    describe('serializing', () => {
        let entity,
            json,
            nestedKeyA,
            nestedKeyB,
            entityRef,
            entityArrRefA,
            entityArrRefB;

        beforeEach(() => {
            nestedKeyA = chance.word();
            nestedKeyB = chance.word();

            entityRef = engine.createEntity();
            entityArrRefA = engine.createEntity();
            entityArrRefB = engine.createEntity();

            entity = engine.createEntity();
            entity.add(EmptyComponent);
            entity.add(SimpleComponent, { testProp: chance.string() });
            entity.add(ArrayComponent, { name: chance.word() });
            entity.add(ArrayComponent, { name: chance.word() });
            entity.add(NestedComponent, { name: nestedKeyA });
            entity.add(NestedComponent, { name: nestedKeyB });
            entity.add(EntityRefComponent, { otherEntity: entityRef });
            entity.add(EntityRefArrayComponent, {
                otherEntities: [entityArrRefA, entityArrRefB],
            });

            json = engine.serialize();
        });

        it('should save all entities and component data', () => {
            expect(json).toEqual({
                entities: [
                    { id: entityRef.id },
                    { id: entityArrRefA.id },
                    { id: entityArrRefB.id },
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
                            [nestedKeyA]: { name: nestedKeyA, hello: 'world' },
                            [nestedKeyB]: { name: nestedKeyB, hello: 'world' },
                        },
                        entityRefComponent: { otherEntity: entityRef.id },
                        entityRefArrayComponent: {
                            otherEntities: [entityArrRefA.id, entityArrRefB.id],
                        },
                    },
                ],
            });
        });
    });

    describe('deserializing', () => {
        let json,
            entityId,
            entityRefId,
            nestedNameA,
            nestedNameB,
            entityArrRefIdA,
            entityArrRefIdB;

        beforeEach(() => {
            entityId = chance.guid();
            entityRefId = chance.guid();
            entityArrRefIdA = chance.guid();
            entityArrRefIdB = chance.guid();
            nestedNameA = chance.word();
            nestedNameB = chance.word();

            json = {
                entities: [
                    { id: entityRefId },
                    { id: entityArrRefIdA },
                    { id: entityArrRefIdB },
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
                        },
                        entityRefComponent: { otherEntity: entityRefId },
                        entityRefArrayComponent: {
                            otherEntities: [entityArrRefIdA, entityArrRefIdB],
                        },
                    },
                ],
            };

            engine.deserialize(json);
        });

        it('should serialize back into the same json', () => {
            expect(engine.serialize()).toEqual(json);
        });

        it('should have all the same components', () => {
            const entity = engine.getEntity(entityId);

            expect(entity.has(EmptyComponent)).toBe(true);
            expect(entity.has(SimpleComponent)).toBe(true);
            expect(entity.has(ArrayComponent)).toBe(true);
            expect(entity.has(NestedComponent)).toBe(true);
            expect(entity.has(EntityRefComponent)).toBe(true);
            expect(entity.has(EntityRefArrayComponent)).toBe(true);
        });

        it('should get component properties correct', () => {
            const entity = engine.getEntity(entityId);

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

        it('should get the references correct', () => {
            const entity = engine.getEntity(entityId);
            const entityRef = engine.getEntity(entityRefId);
            const entityArrRefA = engine.getEntity(entityArrRefIdA);
            const entityArrRefB = engine.getEntity(entityArrRefIdB);

            expect(entity.entityRefComponent.otherEntity).toBe(entityRef);
            expect(entity.entityRefArrayComponent.otherEntities).toStrictEqual([
                entityArrRefA,
                entityArrRefB,
            ]);
        });
    });
});
