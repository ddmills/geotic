import Engine from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import Component from '../../src/Component';

describe('Component', () => {
    let engine, entity, onDestroyedStub, onDetachedStub, onAttachedStub;

    class TestComponent extends Component {
        onAttached() {
            onAttachedStub();
        }
        onDetached() {
            onDetachedStub();
        }
        onDestroyed() {
            onDestroyedStub();
        }
    }

    beforeEach(() => {
        engine = new Engine();
        onAttachedStub = jest.fn();
        onDetachedStub = jest.fn();
        onDestroyedStub = jest.fn();
        engine.registerComponent(EmptyComponent);
        engine.registerComponent(TestComponent);
        entity = engine.createEntity();
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

        it('should set the isAttached flag to true', () => {
            expect(component.isAttached).toBe(true);
        });

        it('should set the isDestroyed flag to false', () => {
            expect(component.isDestroyed).toBe(false);
        });
    });

    describe('remove', () => {
        let component;

        describe('when the "destroy" flag is false', () => {
            beforeEach(() => {
                entity.add(TestComponent);

                component = entity.testComponent;
                component.remove(false);
            });

            it('should remove the component from the entity', () => {
                expect(entity.has(TestComponent)).toBe(false);
            });

            it('should not destroy the component', () => {
                expect(component.isDestroyed).toBe(false);
            });

            it('should call the "onDetached" handler', () => {
                expect(onDetachedStub).toHaveBeenCalledTimes(1);
                expect(onDetachedStub).toHaveBeenCalledWith();
            });

            it('should not call the "onDestroyed" handler', () => {
                expect(onDestroyedStub).toHaveBeenCalledTimes(0);
            });

            it('should set the component "entity" to null', () => {
                expect(component.entity).toBeNull();
            });

            it('should set "isAttached" to false', () => {
                expect(component.isAttached).toBe(false);
            });

            describe('re-attaching', () => {
                let newEntity;

                beforeEach(() => {
                    onAttachedStub.mockReset();
                    newEntity = engine.createEntity();
                    newEntity.attach(component);
                });

                it('should call the onAttached handler', () => {
                    expect(onAttachedStub).toHaveBeenCalledTimes(1);
                    expect(onAttachedStub).toHaveBeenCalledWith();
                });

                it('should set the entity', () => {
                    expect(component.entity).toBe(newEntity);
                });

                it('should set the isAttached flag to true', () => {
                    expect(component.isAttached).toBe(true);
                });

                it('should not change the isDestroyed flag', () => {
                    expect(component.isDestroyed).toBe(false);
                });
            });
        });

        describe('when the "destroy" flag is true', () => {
            beforeEach(() => {
                entity.add(TestComponent);

                component = entity.testComponent;
                component.remove(true);
            });

            it('should remove the component from the entity', () => {
                expect(entity.has(TestComponent)).toBe(false);
            });

            it('should destroy the component', () => {
                expect(component.isDestroyed).toBe(true);
            });

            it('should call the "onDetached" handler', () => {
                expect(onDetachedStub).toHaveBeenCalledTimes(1);
                expect(onDetachedStub).toHaveBeenCalledWith();
            });

            it('should call the "onDestroyed" handler', () => {
                expect(onDestroyedStub).toHaveBeenCalledTimes(1);
                expect(onDestroyedStub).toHaveBeenCalledWith();
            });

            it('should set the component "entity" to null', () => {
                expect(component.entity).toBeNull();
            });

            it('should set "isAttached" to false', () => {
                expect(component.isAttached).toBe(false);
            });
        });
    });

    describe('destroy', () => {
        let component;

        beforeEach(() => {
            entity.add(TestComponent);

            component = entity.testComponent;
            component.destroy();
        });

        it('should remove the component from the entity', () => {
            expect(entity.has(TestComponent)).toBe(false);
        });

        it('should set the isDestroyed flag to true', () => {
            expect(component.isDestroyed).toBe(true);
        });

        it('should call the "onDetached" handler', () => {
            expect(onDetachedStub).toHaveBeenCalledTimes(1);
            expect(onDetachedStub).toHaveBeenCalledWith();
        });

        it('should call the "onDestroyed" handler', () => {
            expect(onDestroyedStub).toHaveBeenCalledTimes(1);
            expect(onDestroyedStub).toHaveBeenCalledWith();
        });

        it('should set the component "entity" to null', () => {
            expect(component.entity).toBeNull();
        });

        it('should set "isAttached" to false', () => {
            expect(component.isAttached).toBe(false);
        });
    });
});
