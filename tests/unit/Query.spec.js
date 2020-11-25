import Engine from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import Component from '../../src/Component';
import Query from '../../src/Query';

describe('Query', () => {
    let engine, entity, result, query;

    class ComponentA extends Component {}
    class ComponentB extends Component {}
    class ComponentC extends Component {}

    beforeEach(() => {
        engine = new Engine();

        engine.registerComponent(ComponentA);
        engine.registerComponent(ComponentB);
        engine.registerComponent(ComponentC);

        entity = engine.createEntity();
    });

    describe('any', () => {
        it('should return false for an empty entity', () => {
            query = new Query(engine, {
                any: [ComponentA],
            });

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return true if the entity has it', () => {
            query = new Query(engine, {
                any: [ComponentA],
            });

            entity.add(ComponentA);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return true if the entity has at least one of them', () => {
            query = new Query(engine, {
                any: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return false if the entity does not have it', () => {
            query = new Query(engine, {
                any: [ComponentA],
            });

            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });
    });

    describe('all', () => {
        it('should return false for an empty entity', () => {
            query = new Query(engine, {
                all: [ComponentA],
            });

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return true if the entity has it', () => {
            query = new Query(engine, {
                all: [ComponentA],
            });

            entity.add(ComponentA);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return true if the entity has all of them', () => {
            query = new Query(engine, {
                all: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);
            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return false if the entity is missing one of them', () => {
            query = new Query(engine, {
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
            query = new Query(engine, {
                none: [ComponentA],
            });

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return false if the entity has it', () => {
            query = new Query(engine, {
                none: [ComponentA],
            });

            entity.add(ComponentA);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if the entity has all of them', () => {
            query = new Query(engine, {
                none: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);
            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if the entity is missing one of them', () => {
            query = new Query(engine, {
                none: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if the entity has one of them', () => {
            query = new Query(engine, {
                none: [ComponentA, ComponentB, ComponentC],
            });

            entity.add(ComponentA);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });
    });

    describe('combinations', () => {
        it('should return true if it matches criteria', () => {
            query = new Query(engine, {
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
            query = new Query(engine, {
                any: [ComponentA, ComponentB],
                all: [ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return true if it matches criteria', () => {
            query = new Query(engine, {
                any: [ComponentA, ComponentB],
                none: [ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(true);
        });

        it('should return false if it does not match criteria', () => {
            query = new Query(engine, {
                any: [ComponentA],
                all: [ComponentB, ComponentC],
            });

            entity.add(ComponentA);
            entity.add(ComponentB);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if it does not match criteria', () => {
            query = new Query(engine, {
                any: [ComponentA, ComponentB],
                all: [ComponentC],
            });

            entity.add(ComponentC);

            result = query.candidate(entity);

            expect(result).toBe(false);
        });

        it('should return false if it does not match criteria', () => {
            query = new Query(engine, {
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
            query = new Query(engine, {
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
            query.candidate(entity);

            expect(onAddedCb1).toHaveBeenCalledTimes(1);
            expect(onAddedCb1).toHaveBeenCalledWith(entity);
            expect(onAddedCb2).toHaveBeenCalledTimes(1);
            expect(onAddedCb2).toHaveBeenCalledWith(entity);

            entity.remove(ComponentA);
            query.candidate(entity);

            expect(onRemovedCb1).toHaveBeenCalledTimes(1);
            expect(onRemovedCb1).toHaveBeenCalledWith(entity);
            expect(onRemovedCb2).toHaveBeenCalledTimes(1);
            expect(onRemovedCb2).toHaveBeenCalledWith(entity);
        });
    });
});
