import Engine from '../../src/Engine';
import { EntityRefArrayComponent } from '../data/components';

describe('EntityArrayProperty', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();
        engine.registerComponent(EntityRefArrayComponent);
    });

    describe('<EntityArray>', () => {
        let entity, referenceEntities;

        beforeEach(() => {
            entity = engine.createEntity();
            referenceEntities = chance.n(
                () => engine.createEntity(),
                chance.d6()
            );
            entity.add(EntityRefArrayComponent);
        });

        describe('set', () => {
            describe('when set by a reference', () => {
                beforeEach(() => {
                    entity.entityRefArrayComponent.otherEntities = referenceEntities;
                });

                it('should return an array of referenced entities', () => {
                    expect(
                        entity.entityRefArrayComponent.otherEntities
                    ).toStrictEqual(referenceEntities);
                    expect(
                        entity.entityRefArrayComponent.properties.otherEntities
                    ).toStrictEqual(referenceEntities);
                });
            });

            describe('when set by ids', () => {
                beforeEach(() => {
                    const ids = referenceEntities.map((e) => e.id);

                    entity.entityRefArrayComponent.otherEntities = ids;
                });

                it('should return an array of referenced entities', () => {
                    expect(
                        entity.entityRefArrayComponent.otherEntities
                    ).toStrictEqual(referenceEntities);
                    expect(
                        entity.entityRefArrayComponent.properties.otherEntities
                    ).toStrictEqual(referenceEntities);
                });
            });

            describe('push', () => {
                let newReferencedEntity;

                beforeEach(() => {
                    newReferencedEntity = engine.createEntity();

                    entity.entityRefArrayComponent.otherEntities = referenceEntities;
                    entity.entityRefArrayComponent.otherEntities.push(
                        newReferencedEntity
                    );
                });

                it('can append more entities', () => {
                    expect(
                        entity.entityRefArrayComponent.otherEntities
                    ).toContain(newReferencedEntity);
                    expect(
                        entity.entityRefArrayComponent.properties.otherEntities
                    ).toContain(newReferencedEntity);
                });
            });
        });

        describe('serialize', () => {
            let result;

            beforeEach(() => {
                entity.entityRefArrayComponent.otherEntities = referenceEntities;

                result = entity.serialize();
            });

            it('should serialize all of the referenced ids', () => {
                const ids = referenceEntities.map((e) => e.id);

                expect(result.entityRefArrayComponent.otherEntities).toEqual(
                    ids
                );
            });
        });

        describe('when the referenced entity is destroyed', () => {
            let destroyedEntity, nonDestroyedEntities;

            beforeEach(() => {
                entity.entityRefArrayComponent.otherEntities = referenceEntities;

                destroyedEntity = chance.pickone(referenceEntities);
                nonDestroyedEntities = referenceEntities.filter(
                    (e) => e !== destroyedEntity
                );

                engine.destroyEntity(destroyedEntity);
            });

            it('should no longer include the entity in the property', () => {
                expect(entity.entityRefArrayComponent.otherEntities).toEqual(
                    nonDestroyedEntities
                );
            });

            describe('when serialized', () => {
                let result;

                beforeEach(() => {
                    result = entity.serialize();
                });

                it('should not show up when serialized', () => {
                    expect(
                        result.entityRefArrayComponent.otherEntities
                    ).toEqual(expect.not.arrayContaining([destroyedEntity.id]));
                });
            });
        });

        describe('when multiple references are destroyed', () => {
            beforeEach(() => {
                const firstRef = engine.createEntity();
                const secondRef = engine.createEntity();

                entity.entityRefArrayComponent.otherEntities = [
                    firstRef,
                    secondRef,
                ];

                engine.destroyEntity(firstRef);
                engine.destroyEntity(secondRef);
            });

            it('should remove both refs', () => {
                expect(entity.entityRefArrayComponent.otherEntities).toEqual(
                    []
                );
            });
        });

        describe('when a reference exists twice in the same array', () => {
            beforeEach(() => {
                const ref = engine.createEntity();

                entity.entityRefArrayComponent.otherEntities = [ref, ref];

                engine.destroyEntity(ref);
            });

            it('should remove it from all locations in the array', () => {
                expect(entity.entityRefArrayComponent.otherEntities).toEqual(
                    []
                );
            });
        });

        describe('when a reference in the array is changed', () => {
            let newReference, dereferenced;

            beforeEach(() => {
                newReference = engine.createEntity();
                dereferenced = referenceEntities[0];

                entity.entityRefArrayComponent.otherEntities = referenceEntities;
                entity.entityRefArrayComponent.otherEntities[0] = newReference;
            });

            it('should keep a reference to the new entity', () => {
                expect(entity.entityRefArrayComponent.otherEntities).toEqual(
                    expect.arrayContaining([newReference])
                );
            });

            it('should not reference the dereferenced entity', () => {
                expect(entity.entityRefArrayComponent.otherEntities).toEqual(
                    expect.not.arrayContaining([dereferenced.id])
                );
            });

            describe('when the new reference is destroyed', () => {
                beforeEach(() => {
                    engine.destroyEntity(newReference);
                });

                it('should no longer include the entity in the property', () => {
                    expect(
                        entity.entityRefArrayComponent.otherEntities
                    ).toEqual(expect.not.arrayContaining([newReference.id]));
                });
            });
        });
    });
});
