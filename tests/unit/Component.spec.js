import { Chance } from 'chance';
import { Engine, Component } from '../../src/index';
import { EmptyComponent } from '../data/components';

describe('Component', () => {
    let engine, world, entity, onDestroyedStub, onAttachedStub;

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
        engine = new Engine();

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

            it('should call the "onDestroyed" handler', () => {
                expect(onDestroyedStub).toHaveBeenCalledTimes(1);
                expect(onDestroyedStub).toHaveBeenCalledWith();
            });

            it('should call the "onDestroyed" handler', () => {
                expect(onDestroyedStub).toHaveBeenCalledTimes(1);
                expect(onDestroyedStub).toHaveBeenCalledWith();
            });

            it('should set the component "entity" to null', () => {
                expect(component.entity).toBeUndefined();
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

            it('should set the component "entity" to null', () => {
                expect(component.entity).toBeUndefined();
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

            it('should set the component "entity" to null', () => {
                expect(component.entity).toBeUndefined();
            });
        });
    });

    describe('properties', () => {
        class PropertyComponent extends Component {
            static properties = {
                name: 'test',
                arr: ['value', 2, null, true],
                ob: {
                    key: 'test',
                    obarr: [6, null, false, 'value'],
                },
            };
        }
        let entity1, entity2;

        beforeEach(() => {
            engine.registerComponent(PropertyComponent);

            entity1 = world.createEntity();
            entity2 = world.createEntity();
        });

        it('should deep-clone properties on construction', () => {
            entity1.add(PropertyComponent);
            entity2.add(PropertyComponent);

            expect(entity1.propertyComponent.arr).not.toBe(
                entity2.propertyComponent.arr
            );
            expect(entity1.propertyComponent.arr).toEqual(
                entity2.propertyComponent.arr
            );

            expect(entity1.propertyComponent.ob).not.toBe(
                entity2.propertyComponent.ob
            );
            expect(entity1.propertyComponent.ob).toEqual(
                entity2.propertyComponent.ob
            );
        });
    });
});
