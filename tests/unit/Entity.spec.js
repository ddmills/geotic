import Engine from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import Component from '../../src/Component';

describe('Entity', () => {
    let engine;

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

    describe('add', () => {
        let entity;

        beforeEach(() => {
            entity = engine.createEntity();
        });

        describe('simple components', () => {
            describe.each([
                ['class', () => (
                    entity.add(TestComponent)
                )],
                ['type', () => (
                    entity.add('TestComponent')
                )],
                ['instance', () => (
                    entity.add(new TestComponent(engine))
                )],
            ])('when added by %s', (def, fn) => {
                let result;

                beforeEach(() => {
                    result = fn();
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

                it('should return TRUE', () => {
                    expect(result).toBe(true);
                });
            });

            describe('when instance is added', () => {
                let instance;

                beforeEach(() => {
                    instance = new TestComponent(engine);
                });

                describe('when instance is not attached to an entity', () => {
                    beforeEach(() => {
                        entity.add(instance);
                    });

                    it('should attach the same exact instance', () => {
                        expect(entity.testComponent).toBe(instance);
                    });
                });

                describe('when instance is already attached to an entity', () => {
                    let result;

                    beforeEach(() => {
                        engine.createEntity().add(instance);

                        result = entity.add(instance);
                    });

                    it('should not attach the instance', () => {
                        expect(entity.has(TestComponent)).toBe(false);
                        expect(entity.components.testComponent).toBeUndefined();
                    });

                    it('should return false', () => {
                        expect(result).toBe(false);
                    });
                });
            });
        });

        describe('keyed components', () => {
            let nameA, nameB;

            beforeEach(() => {
                nameA = chance.word();
                nameB = chance.word();
            });

            describe.each([
                ['class', () => [
                    entity.add(NestedComponent, { name: nameA }),
                    entity.add(NestedComponent, { name: nameB }),
                ]],
                ['type', () => [
                    entity.add('NestedComponent', { name: nameA }),
                    entity.add('NestedComponent', { name: nameB }),
                ]],
                ['instance', () => [
                    entity.add(new NestedComponent(engine, { name: nameA })),
                    entity.add(new NestedComponent(engine, { name: nameB })),
                ]],
            ])('when added by %s', (def, fn) => {
                let result;

                beforeEach(() => {
                    result = fn();
                });

                it('should add the components to the entity as a camel cased property', () => {
                    expect(entity.nestedComponent[nameA]).toBeDefined();
                    expect(entity.nestedComponent[nameB]).toBeDefined();
                });

                it('should have the correct type of components', () => {
                    expect(entity.nestedComponent[nameA]).toBeInstanceOf(NestedComponent);
                    expect(entity.nestedComponent[nameB]).toBeInstanceOf(NestedComponent);
                });

                it('should set component properties', () => {
                    expect(entity.nestedComponent[nameA].name).toBe(nameA);
                    expect(entity.nestedComponent[nameB].name).toBe(nameB);
                });

                it('should return TRUE', () => {
                    expect(result[0]).toBe(true);
                    expect(result[1]).toBe(true);
                });
            });

            describe('when instances are added', () => {
                let instanceA, instanceB;

                beforeEach(() => {
                    instanceA = new NestedComponent(engine, { name: nameA });
                    instanceB = new NestedComponent(engine, { name: nameB });
                });

                describe('when instances are not attached to an entity', () => {
                    beforeEach(() => {
                        entity.add(instanceA);
                        entity.add(instanceB);
                    });

                    it('should attach the same exact instances', () => {
                        expect(entity.nestedComponent[nameA]).toBe(instanceA);
                        expect(entity.nestedComponent[nameB]).toBe(instanceB);
                    });
                });

                describe('when instances are already attached to an entity', () => {
                    let result;

                    beforeEach(() => {
                        engine.createEntity().add(instanceA);
                        engine.createEntity().add(instanceB);

                        result = [
                            entity.add(instanceA),
                            entity.add(instanceB),
                        ];
                    });

                    it('should not attach the instances', () => {
                        expect(entity.has(NestedComponent)).toBe(false);
                        expect(entity.components.nestedComponent).toBeUndefined();
                    });

                    it('should return false', () => {
                        expect(result).toStrictEqual([false, false]);
                    });
                });
            });
        });

        describe('array components', () => {
            let nameA, nameB;

            beforeEach(() => {
                nameA = chance.word();
                nameB = chance.word();
            });

            describe.each([
                ['class', () => [
                    entity.add(ArrayComponent, { name: nameA }),
                    entity.add(ArrayComponent, { name: nameB }),
                ]],
                ['type', () => [
                    entity.add('ArrayComponent', { name: nameA }),
                    entity.add('ArrayComponent', { name: nameB }),
                ]],
                ['instance', () => [
                    entity.add(new ArrayComponent(engine, { name: nameA })),
                    entity.add(new ArrayComponent(engine, { name: nameB })),
                ]],
            ])('when added by %s', (def, fn) => {
                let result;

                beforeEach(() => {
                    result = fn();
                });

                it('should add the components to the entity as a camel cased array property', () => {
                    expect(entity.arrayComponent).toBeDefined();
                    expect(entity.arrayComponent).toHaveLength(2);
                    expect(entity.arrayComponent[0].name).toBe(nameA);
                    expect(entity.arrayComponent[1].name).toBe(nameB);
                });

                it('should mark the components as "attached"', () => {
                    expect(entity.arrayComponent[0].isAttached).toBe(true);
                    expect(entity.arrayComponent[1].isAttached).toBe(true);
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

                it('should return TRUE', () => {
                    expect(result[0]).toBe(true);
                    expect(result[1]).toBe(true);
                });
            });

            describe('when instances are added', () => {
                let instanceA, instanceB;

                beforeEach(() => {
                    instanceA = new ArrayComponent(engine, { name: nameA });
                    instanceB = new ArrayComponent(engine, { name: nameB });
                });

                describe('when instances are not attached to an entity', () => {
                    beforeEach(() => {
                        entity.add(instanceA);
                        entity.add(instanceB);
                    });

                    it('should attach the same exact instances', () => {
                        expect(entity.arrayComponent[0]).toBe(instanceA);
                        expect(entity.arrayComponent[1]).toBe(instanceB);
                    });
                });

                describe('when instances are already attached to an entity', () => {
                    let result;

                    beforeEach(() => {
                        engine.createEntity().add(instanceA);
                        engine.createEntity().add(instanceB);

                        result = [
                            entity.add(instanceA),
                            entity.add(instanceB),
                        ];
                    });

                    it('should not attach the instances', () => {
                        expect(entity.has(ArrayComponent)).toBe(false);
                        expect(entity.components.arrayComponent).toBeUndefined();
                    });

                    it('should return false', () => {
                        expect(result).toStrictEqual([false, false]);
                    });
                });
            });
        });
    });

    describe('remove', () => {
        let entity;

        beforeEach(() => {
            entity = engine.createEntity();
        });

        describe('simple components', () => {
            beforeEach(() => {
                entity.add(TestComponent);
            });

            describe('when removed by class', () => {
                beforeEach(() => {
                    entity.remove(TestComponent);
                });

                it('should set the component to undefined', () => {
                    expect(entity.testComponent).toBeUndefined();
                });
            });

            describe('when removed by type', () => {
                beforeEach(() => {
                    entity.remove('TestComponent');
                });

                it('should set the component to undefined', () => {
                    expect(entity.testComponent).toBeUndefined();
                });
            });

            describe('when removed by instance', () => {
                beforeEach(() => {
                    const instance = entity.testComponent;

                    entity.remove(instance);
                });

                it('should set the component to undefined', () => {
                    expect(entity.testComponent).toBeUndefined();
                });
            });
        });

        describe('keyed components', () => {
            beforeEach(() => {
                entity.add(NestedComponent, { name: 'a' });
                entity.add(NestedComponent, { name: 'b' });
            });

            describe('when one of them is removed', () => {
                describe('when removed by class', () => {
                    beforeEach(() => {
                        entity.remove(NestedComponent, 'b');
                    });

                    it('should set the component to undefined', () => {
                        expect(entity.nestedComponent.b).toBeUndefined();
                    });

                    it('should not delete the other component', () => {
                        expect(entity.nestedComponent.a).toBeDefined();
                    });
                });

                describe('when removed by type', () => {
                    beforeEach(() => {
                        entity.remove('NestedComponent', 'b');
                    });

                    it('should set the component to undefined', () => {
                        expect(entity.nestedComponent.b).toBeUndefined();
                    });

                    it('should not remove the other component', () => {
                        expect(entity.nestedComponent.a).toBeDefined();
                    });
                });

                describe('when removed by instance', () => {
                    beforeEach(() => {
                        const instance = entity.nestedComponent.b;

                        entity.remove(instance);
                    });

                    it('should set the component to undefined', () => {
                        expect(entity.testComponent).toBeUndefined();
                    });
                });
            });

            describe('when both are removed', () => {
                describe('when removed by class', () => {
                    beforeEach(() => {
                        entity.remove(NestedComponent, 'a');
                        entity.remove(NestedComponent, 'b');
                    });

                    it('should set it to undefined', () => {
                        expect(entity.nestedComponent).toBeUndefined();
                    });
                });

                describe('when removed by type', () => {
                    beforeEach(() => {
                        entity.remove('NestedComponent', 'a');
                        entity.remove('NestedComponent', 'b');
                    });

                    it('should set it to undefined', () => {
                        expect(entity.nestedComponent).toBeUndefined();
                    });
                });

                describe('when removed by instance', () => {
                    beforeEach(() => {
                        const instanceA = entity.nestedComponent.a;
                        const instanceB = entity.nestedComponent.b;

                        entity.remove(instanceA);
                        entity.remove(instanceB);
                    });

                    it('should set it to undefined', () => {
                        expect(entity.nestedComponent).toBeUndefined();
                    });
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
                describe('when removed by class', () => {
                    beforeEach(() => {
                        entity.remove(ArrayComponent);
                    });

                    it('should set it to undefined', () => {
                        expect(entity.arrayComponent).toBeUndefined();
                    });
                });

                describe('when removed by type', () => {
                    beforeEach(() => {
                        entity.remove('ArrayComponent');
                    });

                    it('should set it to undefined', () => {
                        expect(entity.arrayComponent).toBeUndefined();
                    });
                });

                describe('when removed by instance', () => {
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
});
