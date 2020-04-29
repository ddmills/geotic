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
            referenceEntities = chance.n(() => engine.createEntity(), chance.d6());
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
                    expect(entity.testComponent.testProperty).toContain(newReferencedEntity);
                    expect(entity.testComponent.properties.testProperty).toContain(newReferencedEntity);
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
    });
});
