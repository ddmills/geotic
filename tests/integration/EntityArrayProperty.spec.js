import Engine from '../../src/Engine';
import Component from '../../src/Component';

describe('EntityArrayProperty', () => {
    let engine;

    class TestComponent extends Component {
        static properties = {
            testProperty: '<EntityArray>',
        };
    }

    beforeEach(() => {
        engine = new Engine();
        engine.registerComponent(TestComponent);
    });

    describe('<EntityArray>', () => {
        let entity, referenceEntities;

        beforeEach(() => {
            entity = engine.createEntity();
            referenceEntities = chance.n(
                () => engine.createEntity(),
                chance.d6()
            );
            entity.add(TestComponent);
        });

        describe('set', () => {
            beforeEach(() => {
                entity.testComponent.testProperty = referenceEntities;
            });

            it('can be set by a reference', () => {
                expect(entity.testComponent.testProperty).toEqual(
                    referenceEntities
                );
                expect(entity.testComponent.properties.testProperty).toEqual(
                    referenceEntities
                );
            });

            describe('push', () => {
                let newReferencedEntity;

                beforeEach(() => {
                    newReferencedEntity = engine.createEntity();

                    entity.testComponent.testProperty.push(newReferencedEntity);
                });

                it('can append more entities', () => {
                    expect(entity.testComponent.testProperty).toContain(
                        newReferencedEntity
                    );
                    expect(
                        entity.testComponent.properties.testProperty
                    ).toContain(newReferencedEntity);
                });
            });
        });

        describe('serialize', () => {
            let result;

            beforeEach(() => {
                entity.testComponent.testProperty = referenceEntities;

                result = entity.serialize();
            });

            it('should serialize all of the referenced ids', () => {
                const ids = referenceEntities.map((e) => e.id);

                expect(result.testComponent.testProperty).toEqual(ids);
            });
        });

        describe('when the referenced entity is destroyed', () => {
            let destroyedEntity, nonDestroyedEntities;

            beforeEach(() => {
                entity.testComponent.testProperty = referenceEntities;

                destroyedEntity = chance.pickone(referenceEntities);
                nonDestroyedEntities = referenceEntities.filter(
                    (e) => e !== destroyedEntity
                );

                engine.destroyEntity(destroyedEntity);
            });

            it('should no longer include the entity in the property', () => {
                expect(entity.testComponent.testProperty).toEqual(
                    nonDestroyedEntities
                );
            });

            describe('when serialized', () => {
                let result;

                beforeEach(() => {
                    result = entity.serialize();
                });

                it('should not show up when serialized', () => {
                    expect(result.testComponent.testProperty).toEqual(
                        expect.not.arrayContaining([destroyedEntity.id])
                    );
                });
            });
        });

        describe('when multiple references are destroyed', () => {
            beforeEach(() => {
                const firstRef = engine.createEntity();
                const secondRef = engine.createEntity();

                entity.testComponent.testProperty = [firstRef, secondRef];

                engine.destroyEntity(firstRef);
                engine.destroyEntity(secondRef);
            });

            it('should remove both refs', () => {
                expect(entity.testComponent.testProperty).toEqual([]);
            });
        });

        describe('when a reference exists twice in the same array', () => {
            beforeEach(() => {
                const ref = engine.createEntity();

                entity.testComponent.testProperty = [ref, ref];

                engine.destroyEntity(ref);
            });

            it('should remove it from all locations in the array', () => {
                expect(entity.testComponent.testProperty).toEqual([]);
            });
        });

        describe('when a reference in the array is changed', () => {
            let newReference, dereferenced;

            beforeEach(() => {
                newReference = engine.createEntity();
                dereferenced = referenceEntities[0];

                entity.testComponent.testProperty = referenceEntities;
                entity.testComponent.testProperty[0] = newReference;
            });

            it('should keep a reference to the new entity', () => {
                expect(entity.testComponent.testProperty).toEqual(
                    expect.arrayContaining([newReference])
                );
            });

            it('should not reference the dereferenced entity', () => {
                expect(entity.testComponent.testProperty).toEqual(
                    expect.not.arrayContaining([dereferenced.id])
                );
            });

            describe('when the new reference is destroyed', () => {
                beforeEach(() => {
                    engine.destroyEntity(newReference);
                });

                it('should no longer include the entity in the property', () => {
                    expect(entity.testComponent.testProperty).toEqual(
                        expect.not.arrayContaining([newReference.id])
                    );
                });
            });
        });
    });
});
