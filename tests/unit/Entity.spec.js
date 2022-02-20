import { Engine } from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import { Component } from '../../src/Component';

describe('Entity', () => {
    let world;

    class TestComponent extends Component {}
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

        engine.registerComponent(EmptyComponent);
        engine.registerComponent(TestComponent);
        engine.registerComponent(NestedComponent);
        engine.registerComponent(ArrayComponent);

        world = engine.createWorld();
    });

    describe('create', () => {
        let entity;

        beforeEach(() => {
            entity = world.createEntity();
        });

        it('should be able to recall by entity id', () => {
            const result = world.getEntity(entity.id);

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
            entity = world.createEntity();
            entity.add(EmptyComponent);
            entity.add(TestComponent);
            entity.add(NestedComponent);
            entity.add(ArrayComponent);

            testComponentDestroySpy = jest.spyOn(
                entity.testComponent,
                '_onDestroyed'
            );
            emptyComponentDestroySpy = jest.spyOn(
                entity.emptyComponent,
                '_onDestroyed'
            );

            nestedComponentDestroySpy = jest.spyOn(
                entity.nestedComponent.test,
                '_onDestroyed'
            );
            arrayComponentDestroySpy = jest.spyOn(
                entity.arrayComponent[0],
                '_onDestroyed'
            );

            entity.destroy();
        });

        it('should no longer be able to recall by entity id', () => {
            const result = world.getEntity(entity.id);

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

    describe('add', () => {
        let entity;

        beforeEach(() => {
            entity = world.createEntity();
        });

        describe('simple components', () => {
            beforeEach(() => {
                entity.add(TestComponent);
            });

            it('should add the component to the entity as a camel cased property', () => {
                expect(entity.testComponent).toBeDefined();
            });

            it('should include the component in the entity list', () => {
                expect(entity.components.testComponent).toBeTruthy();
            });

            it('should have the correct type of components', () => {
                expect(entity.testComponent).toBeInstanceOf(TestComponent);
            });
        });

        describe('keyed components', () => {
            let nameA, nameB;

            beforeEach(() => {
                nameA = chance.word();
                nameB = chance.word();

                entity.add(NestedComponent, { name: nameA });
                entity.add(NestedComponent, { name: nameB });
            });

            it('should add the components to the entity as a camel cased property', () => {
                expect(entity.nestedComponent[nameA]).toBeDefined();
                expect(entity.nestedComponent[nameB]).toBeDefined();
            });

            it('should have the correct type of components', () => {
                expect(entity.nestedComponent[nameA]).toBeInstanceOf(
                    NestedComponent
                );
                expect(entity.nestedComponent[nameB]).toBeInstanceOf(
                    NestedComponent
                );
            });

            it('should set component properties', () => {
                expect(entity.nestedComponent[nameA].name).toBe(nameA);
                expect(entity.nestedComponent[nameB].name).toBe(nameB);
            });
        });

        describe('array components', () => {
            let nameA, nameB;

            beforeEach(() => {
                nameA = chance.word();
                nameB = chance.word();

                entity.add(ArrayComponent, { name: nameA });
                entity.add(ArrayComponent, { name: nameB });
            });

            it('should add the components to the entity as a camel cased array property', () => {
                expect(entity.arrayComponent).toBeDefined();
                expect(entity.arrayComponent).toHaveLength(2);
                expect(entity.arrayComponent[0].name).toBe(nameA);
                expect(entity.arrayComponent[1].name).toBe(nameB);
            });

            it('should assign the entity', () => {
                expect(entity.arrayComponent[0].entity).toBe(entity);
                expect(entity.arrayComponent[1].entity).toBe(entity);
            });

            it('should include the components in the entity list', () => {
                expect(entity.components.arrayComponent).toHaveLength(2);
            });

            it('should have the correct type of components', () => {
                expect(entity.arrayComponent[0]).toBeInstanceOf(ArrayComponent);
                expect(entity.arrayComponent[1]).toBeInstanceOf(ArrayComponent);
            });

            it('should set component properties', () => {
                expect(entity.arrayComponent[0].name).toBe(nameA);
                expect(entity.arrayComponent[1].name).toBe(nameB);
            });
        });
    });

    describe('remove', () => {
        let entity;

        beforeEach(() => {
            entity = world.createEntity();
        });

        describe('simple components', () => {
            beforeEach(() => {
                entity.add(TestComponent);
                entity.remove(entity.testComponent);
            });

            it('should set the component to undefined', () => {
                expect(entity.testComponent).toBeUndefined();
            });
        });

        describe('keyed components', () => {
            beforeEach(() => {
                entity.add(NestedComponent, { name: 'a' });
                entity.add(NestedComponent, { name: 'b' });
            });

            describe('when one of them is removed', () => {
                beforeEach(() => {
                    entity.remove(entity.nestedComponent.b);
                });

                it('should set the component to undefined', () => {
                    expect(entity.testComponent).toBeUndefined();
                });
            });

            describe('when both are removed', () => {
                beforeEach(() => {
                    entity.remove(entity.nestedComponent.a);
                    entity.remove(entity.nestedComponent.b);
                });

                it('should set it to undefined', () => {
                    expect(entity.nestedComponent).toBeUndefined();
                });
            });
        });

        describe('array components', () => {
            beforeEach(() => {
                entity.add(ArrayComponent, { name: 'a' });
                entity.add(ArrayComponent, { name: 'b' });
            });

            describe('when one of them is removed', () => {
                beforeEach(() => {
                    const instance = entity.arrayComponent[1];

                    entity.remove(instance);
                });

                it('should set the component to undefined', () => {
                    expect(entity.arrayComponent[1]).toBeUndefined();
                });

                it('should keep the other component', () => {
                    expect(entity.arrayComponent[0]).toBeDefined();
                });
            });

            describe('when both are removed', () => {
                beforeEach(() => {
                    const instanceA = entity.arrayComponent[0];
                    const instanceB = entity.arrayComponent[1];

                    entity.remove(instanceA);
                    entity.remove(instanceB);
                });

                it('should set it to undefined', () => {
                    expect(entity.arrayComponent).toBeUndefined();
                });
            });
        });
    });
});
