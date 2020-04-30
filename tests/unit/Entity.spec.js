import Engine from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import Component from '../../src/Component';

describe('Engine', () => {
    let engine;

    class TestComponent extends Component {}

    beforeEach(() => {
        engine = new Engine();
        engine.registerComponent(EmptyComponent);
        engine.registerComponent(TestComponent);
    });

    describe('create', () => {
        let entity;

        beforeEach(() => {
            entity = engine.createEntity();
        });

        it('should be able to recall by entity id', () => {
            const result = engine.getEntity(entity.id);

            expect(result).toBe(entity);
        });

        it('should set the isDestroyed flag to FALSE', () => {
            expect(entity.isDestroyed).toBe(false);
        });
    });

    describe('destroy', () => {
        let entity,
            component,
            emptyComponentDestroySpy,
            testComponentDestroySpy;

        beforeEach(() => {
            entity = engine.createEntity();
            entity.add(EmptyComponent);
            entity.add(TestComponent);

            testComponentDestroySpy = jest.spyOn(
                entity.testComponent,
                'destroy'
            );
            emptyComponentDestroySpy = jest.spyOn(
                entity.emptyComponent,
                'destroy'
            );

            component = entity.testComponent;
            entity.destroy();
        });

        it('should no longer be able to recall by entity id', () => {
            const result = engine.getEntity(entity.id);

            expect(result).toBeUndefined();
        });

        it('should set the entity "isDestroyed" flag to TRUE', () => {
            expect(entity.isDestroyed).toBe(true);
        });

        it('should call "onDestroyed" for all components', () => {
            expect(testComponentDestroySpy).toHaveBeenCalledTimes(1);
            expect(testComponentDestroySpy).toHaveBeenCalledWith();
            expect(emptyComponentDestroySpy).toHaveBeenCalledTimes(1);
            expect(emptyComponentDestroySpy).toHaveBeenCalledWith();
        });
    });
});
