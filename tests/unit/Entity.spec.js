import Engine from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import Component from '../../src/Component';

describe('Entity', () => {
    let engine;

    class TestComponent extends Component {}
    class NestedComponent extends Component {
        static properties = {
            name: 'test'
        };
        static allowMultiple = true;
        static keyProperty = 'name';
    }
    class ArrayComponent extends Component {
        static allowMultiple = true;
    }

    beforeEach(() => {
        engine = new Engine();
        engine.registerComponent(EmptyComponent);
        engine.registerComponent(TestComponent);
        engine.registerComponent(NestedComponent);
        engine.registerComponent(ArrayComponent);
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

        it('should assign an ID', () => {
            expect(typeof entity.id).toBe('string');
        });
    });

    describe('destroy', () => {
        let entity,
            emptyComponentDestroySpy,
            testComponentDestroySpy,
            nestedComponentDestroySpy,
            arrayComponentDestroySpy;

        beforeEach(() => {
            entity = engine.createEntity();
            entity.add(EmptyComponent);
            entity.add(TestComponent);
            entity.add(NestedComponent);
            entity.add(ArrayComponent);

            testComponentDestroySpy = jest.spyOn(
                entity.testComponent,
                'destroy'
            );
            emptyComponentDestroySpy = jest.spyOn(
                entity.emptyComponent,
                'destroy'
            );

            nestedComponentDestroySpy = jest.spyOn(
                entity.nestedComponent.test,
                'destroy'
            );
            arrayComponentDestroySpy = jest.spyOn(
                entity.arrayComponent[0],
                'destroy'
            );

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
            expect(nestedComponentDestroySpy).toHaveBeenCalledTimes(1);
            expect(nestedComponentDestroySpy).toHaveBeenCalledWith();
            expect(arrayComponentDestroySpy).toHaveBeenCalledTimes(1);
            expect(arrayComponentDestroySpy).toHaveBeenCalledWith();
        });
    });
});
