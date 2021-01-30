import { Engine, Component } from '../../src/index';

describe('Query', () => {
    let world,
        entityA,
        entityB,
        result,
        query,
        onAddCallback,
        onRemoveCallback;

    class ComponentA extends Component {}
    class ComponentB extends Component {}
    class ComponentC extends Component {}

    beforeEach(() => {
        const engine = new Engine();

        engine.registerComponent(ComponentA);
        engine.registerComponent(ComponentB);
        engine.registerComponent(ComponentC);

        world = engine.createWorld();

        entityA = world.createEntity();
        entityB = world.createEntity();

        onAddCallback = jest.fn();
        onRemoveCallback = jest.fn();
    });

    describe('when there are no matching entities', () => {
        beforeEach(() => {
            query = world.createQuery({
                any: [ComponentA],
            });

            query.onEntityAdded(onAddCallback);
            query.onEntityRemoved(onRemoveCallback);
        });

        it('should return an empty set', () => {
            result = query.get();

            expect([...result]).toStrictEqual([]);
        });

        it('should not invoke any callbacks', () => {
            expect(onAddCallback).toHaveBeenCalledTimes(0);
            expect(onRemoveCallback).toHaveBeenCalledTimes(0);
        });

        describe('when an entity is created that matches', () => {
            let newEntity;

            beforeEach(() => {
                newEntity = world.createEntity();

                newEntity.add(ComponentA);
            });

            it('should be included in result set', () => {
                result = query.get();

                expect([...result]).toStrictEqual([newEntity]);
            });

            it('should invoke the onAddCallback with the new entity', () => {
                expect(onAddCallback).toHaveBeenCalledTimes(1);
                expect(onAddCallback).toHaveBeenCalledWith(newEntity);
                expect(onRemoveCallback).toHaveBeenCalledTimes(0);
            });
        });

        describe('when an entity is edited to match', () => {
            beforeEach(() => {
                entityA.add(ComponentA);
            });

            it('should be included in result set', () => {
                result = query.get();

                expect([...result]).toStrictEqual([entityA]);
            });

            it('should invoke the onAddCallback with the matching entity', () => {
                expect(onAddCallback).toHaveBeenCalledTimes(1);
                expect(onAddCallback).toHaveBeenCalledWith(entityA);
                expect(onRemoveCallback).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe('when there are matching entities', () => {
        beforeEach(() => {
            entityA.add(ComponentA);
            entityB.add(ComponentA);

            query = world.createQuery({
                any: [ComponentA],
            });

            query.onEntityAdded(onAddCallback);
            query.onEntityRemoved(onRemoveCallback);
        });

        it('should return a set including the entities', () => {
            result = query.get();

            expect([...result]).toStrictEqual([entityA, entityB]);
        });

        describe('when an entity is edited to no longer match', () => {
            beforeEach(() => {
                entityA.remove(ComponentA);
            });

            it('should not be included in result set', () => {
                result = query.get();

                expect([...result]).toStrictEqual([entityB]);
            });

            it('should invoke the onRemoveCallback with the removed entity', () => {
                expect(onAddCallback).toHaveBeenCalledTimes(0);
                expect(onRemoveCallback).toHaveBeenCalledTimes(1);
                expect(onRemoveCallback).toHaveBeenCalledWith(entityA);
            });
        });

        describe('when an entity is destroyed', () => {
            beforeEach(() => {
                entityA.destroy();
            });

            it('should not be included in result set', () => {
                result = query.get();

                expect([...result]).toStrictEqual([entityB]);
            });

            it('should invoke the onRemoveCallback with the destroyed entity', () => {
                expect(onAddCallback).toHaveBeenCalledTimes(0);
                expect(onRemoveCallback).toHaveBeenCalledTimes(1);
                expect(onRemoveCallback).toHaveBeenCalledWith(entityA);
            });
        });
    });
});
