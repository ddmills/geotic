import { Engine, Component } from '../../src/index';

describe('Query', () => {
    let world, entity, result, query;

    class ComponentA extends Component {}
    class ComponentB extends Component {}
    class ComponentC extends Component {}

    beforeEach(() => {
        const engine = new Engine();

        engine.registerComponent(ComponentA);
        engine.registerComponent(ComponentB);
        engine.registerComponent(ComponentC);

        world = engine.createWorld();
        entity = world.createEntity();
    });

    describe('any', () => {
        it('should return false for an empty entity', () => {
            query = world.createQuery({
                any: [ComponentA],
            });

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return true if the entity has it', () => {
            query = world.createQuery({
                any: [ComponentA],
            });

            entity.add(ComponentA);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return true if the entity has at least one of them', () => {
            query = world.createQuery({
                any: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return false if the entity does not have it', () => {
            query = world.createQuery({
                any: [ComponentA],
            });

            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });
    });

    describe('all', () => {
        it('should return false for an empty entity', () => {
            query = world.createQuery({
                all: [ComponentA],
            });

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return true if the entity has it', () => {
            query = world.createQuery({
                all: [ComponentA],
            });

            entity.add(ComponentA);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return true if the entity has all of them', () => {
            query = world.createQuery({
                all: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);
            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return false if the entity is missing one of them', () => {
            query = world.createQuery({
                all: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });
    });

    describe('none', () => {
        it('should return true for an empty entity', () => {
            query = world.createQuery({
                none: [ComponentA],
            });

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return false if the entity has it', () => {
            query = world.createQuery({
                none: [ComponentA],
            });

            entity.add(ComponentA);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if the entity has all of them', () => {
            query = world.createQuery({
                none: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);
            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if the entity is missing one of them', () => {
            query = world.createQuery({
                none: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if the entity has one of them', () => {
            query = world.createQuery({
                none: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });
    });

    describe('combinations', () => {
        it('should return true if it matches criteria', () => {
            query = world.createQuery({
                any: [ComponentA],
                all: [ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);
            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return true if it matches criteria', () => {
            query = world.createQuery({
                any: [ComponentA, ComponentB],
                all: [ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return true if it matches criteria', () => {
            query = world.createQuery({
                any: [ComponentA, ComponentB],
                none: [ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return false if it does not match criteria', () => {
            query = world.createQuery({
                any: [ComponentA],
                all: [ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if it does not match criteria', () => {
            query = world.createQuery({
                any: [ComponentA, ComponentB],
                all: [ComponentC],
            });

            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if it does not match criteria', () => {
            query = world.createQuery({
                any: [ComponentA, ComponentB],
                none: [ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);
            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });
    });

    describe('callbacks', () => {
        it('should invoke multiple callback', () => {
            query = world.createQuery({
                any: [ComponentA],
            });

            const onAddedCb1 = jest.fn();
            const onAddedCb2 = jest.fn();
            const onRemovedCb1 = jest.fn();
            const onRemovedCb2 = jest.fn();

            query.onEntityAdded(onAddedCb1);
            query.onEntityAdded(onAddedCb2);
            query.onEntityRemoved(onRemovedCb1);
            query.onEntityRemoved(onRemovedCb2);

            entity.add(ComponentA);

            expect(onAddedCb1).toHaveBeenCalledTimes(1);
            expect(onAddedCb1).toHaveBeenCalledWith(entity);
            expect(onAddedCb2).toHaveBeenCalledTimes(1);
            expect(onAddedCb2).toHaveBeenCalledWith(entity);

            entity.componentA.destroy();

            expect(onRemovedCb1).toHaveBeenCalledTimes(1);
            expect(onRemovedCb1).toHaveBeenCalledWith(entity);
            expect(onRemovedCb2).toHaveBeenCalledTimes(1);
            expect(onRemovedCb2).toHaveBeenCalledWith(entity);
        });
    });
});
