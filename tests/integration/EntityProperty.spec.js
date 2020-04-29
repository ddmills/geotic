import Engine from '../../src/Engine';
import Component from '../../src/Component';

describe('EntityProperty', () => {
    let engine;

    class TestComponent extends Component {
        static properties = {
            testProperty: '<Entity>',
        };
    }

    beforeEach(() => {
        engine = new Engine();
        engine.registerComponent(TestComponent);
    });

    describe('<Entity>', () => {
        let entity, referenceEntity;

        beforeEach(() => {
            entity = engine.createEntity();
            referenceEntity = engine.createEntity();
            entity.add(TestComponent);
        });

        describe('when the property is not set', () => {
            it('should default to undefined', () => {
                expect(entity.testComponent.testProperty).toBeUndefined();
            });
        });

        describe('when the property is set to an entity', () => {
            beforeEach(() => {
                entity.testComponent.testProperty = referenceEntity;
            });

            it('can be set by a reference', () => {
                expect(entity.testComponent.testProperty).toEqual(
                    referenceEntity
                );
                expect(entity.testComponent.properties.testProperty).toEqual(
                    referenceEntity
                );
            });
        });

        describe('when the entity is serialized', () => {
            let result;

            beforeEach(() => {
                entity.testComponent.testProperty = referenceEntity;

                result = entity.serialize();
            });

            it('should serialize the referenced id', () => {
                expect(result.testComponent.testProperty).toEqual(
                    referenceEntity.id
                );
            });
        });

        describe('when the referenced entity is destroyed', () => {
            beforeEach(() => {
                entity.testComponent.testProperty = referenceEntity;

                engine.destroyEntity(referenceEntity);
            });

            it('should set the property to undefined', () => {
                expect(entity.testComponent.testProperty).toBeUndefined();
            });

            describe('when serialized', () => {
                let result;

                beforeEach(() => {
                    result = entity.serialize();
                });

                it('should not show up when serialized', () => {
                    expect(result.testComponent.testProperty).toBeUndefined();
                });
            });
        });

        describe('when the reference is changed', () => {
            let newReference;

            beforeEach(() => {
                newReference = engine.createEntity();

                entity.testComponent.testProperty = referenceEntity;
                entity.testComponent.testProperty = newReference;

                engine.destroyEntity(referenceEntity);
            });

            it('should keep a reference to the new entity', () => {
                expect(entity.testComponent.testProperty).toBe(newReference);
            });
        });
    });
});
