import Engine from '../../src/Engine';
import Component from '../../src/Component';

describe('Query', () => {
    let engine, entityA, entityB, result, query;

    class ComponentA extends Component {}
    class ComponentB extends Component {}
    class ComponentC extends Component {}

    beforeEach(() => {
        engine = new Engine();

        engine.registerComponent(ComponentA);
        engine.registerComponent(ComponentB);
        engine.registerComponent(ComponentC);

        entityA = engine.createEntity();
        entityB = engine.createEntity();
    });

    describe('when there are no matching entities', () => {
        beforeEach(() => {
            query = engine.createQuery({
                any: [ComponentA],
            });
        });

        it('should return an empty set', () => {
            result = query.get();

            expect([...result]).toStrictEqual([]);
        });

        describe('when an entity is created that matches', () => {
            let newEntity;

            beforeEach(() => {
                newEntity = engine.createEntity();

                newEntity.add(ComponentA);
            });

            it('should be included in result set', () => {
                result = query.get();

                expect([...result]).toStrictEqual([newEntity]);
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
        });
    });

    describe('when there are matching entities', () => {
        beforeEach(() => {
            entityA.add(ComponentA);
            entityB.add(ComponentA);

            query = engine.createQuery({
                any: [ComponentA],
            });
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
        });
    });
});
