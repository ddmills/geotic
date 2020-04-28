import Engine from '../../src/Engine';
import Component from '../../src/Component';

describe('EntityRefProperty', () => {
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

        describe('set', () => {
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

        describe('serialize', () => {
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
    });
});
