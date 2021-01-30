import { Engine, Component } from '../../src/index';
import { EmptyComponent } from '../data/components';

describe('Component', () => {
    let world, entity, onDestroyedStub, onAttachedStub;

    class TestComponent extends Component {
        onAttached() {
            onAttachedStub();
        }
        onDestroyed() {
            onDestroyedStub();
        }
    }

    class NestedComponent extends Component {
        static properties = {
            name: 'test',
        };
        static allowMultiple = true;
        static keyProperty = 'name';
    }

    class ArrayComponent extends Component {
        static properties = {
            name: 'a',
        };
        static allowMultiple = true;
    }

    beforeEach(() => {
        const engine = new Engine();

        world = engine.createWorld();

        onAttachedStub = jest.fn();
        onDestroyedStub = jest.fn();
        onDestroyedStub = jest.fn();

        engine.registerComponent(EmptyComponent);
        engine.registerComponent(TestComponent);
        engine.registerComponent(NestedComponent);
        engine.registerComponent(ArrayComponent);

        entity = world.createEntity();
    });

    describe('attach', () => {
        let component;

        beforeEach(() => {
            entity.add(TestComponent);
            component = entity.testComponent;
        });

        it('should call the onAttached handler', () => {
            expect(onAttachedStub).toHaveBeenCalledTimes(1);
            expect(onAttachedStub).toHaveBeenCalledWith();
        });

        it('should set the entity', () => {
            expect(component.entity).toBe(entity);
        });
    });

    describe('destroy', () => {
        let component;

        beforeEach(() => {
            entity.add(TestComponent);
            entity.add(NestedComponent, { name: 'a' });
            entity.add(NestedComponent, { name: 'b' });
            entity.add(ArrayComponent);
            entity.add(ArrayComponent);
        });

        describe('when destroying a simple component', () => {
            beforeEach(() => {
                component = entity.testComponent;
                component.destroy();
            });

            it('should remove the component from the entity', () => {
                expect(entity.has(TestComponent)).toBe(false);
            });

            it('should set the isDestroyed flag to true', () => {
                expect(component.isDestroyed).toBe(true);
            });

            it('should call the "onDestroyed" handler', () => {
                expect(onDestroyedStub).toHaveBeenCalledTimes(1);
                expect(onDestroyedStub).toHaveBeenCalledWith();
            });

            it('should call the "onDestroyed" handler', () => {
                expect(onDestroyedStub).toHaveBeenCalledTimes(1);
                expect(onDestroyedStub).toHaveBeenCalledWith();
            });

            it('should set the component "entity" to null', () => {
                expect(component.entity).toBeNull();
            });
        });

        describe('when destroying a keyed component', () => {
            beforeEach(() => {
                component = entity.nestedComponent.b;
                component.destroy();
            });

            it('should remove the component from the entity', () => {
                expect(entity.nestedComponent.b).toBeUndefined();
            });

            it('should not remove the other nested component from the entity', () => {
                expect(entity.nestedComponent.a).toBeDefined();
            });

            it('should set the isDestroyed flag to true', () => {
                expect(component.isDestroyed).toBe(true);
            });

            it('should set the component "entity" to null', () => {
                expect(component.entity).toBeNull();
            });
        });

        describe('when destroying an array component', () => {
            beforeEach(() => {
                component = entity.arrayComponent[1];
                component.destroy();
            });

            it('should remove the component from the entity', () => {
                expect(entity.arrayComponent[1]).toBeUndefined();
            });

            it('should not remove the other array component from the entity', () => {
                expect(entity.arrayComponent[0]).toBeDefined();
            });

            it('should set the isDestroyed flag to true', () => {
                expect(component.isDestroyed).toBe(true);
            });

            it('should set the component "entity" to null', () => {
                expect(component.entity).toBeNull();
            });
        });
    });
});
