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
