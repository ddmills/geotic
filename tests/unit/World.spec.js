import { Engine } from '../../src/index';

describe('World', () => {
    let world;

    beforeEach(() => {
        const engine = new Engine();

        world = engine.createWorld();
    });

    describe('createEntity', () => {
        let entity;

        describe('without an ID', () => {
            beforeEach(() => {
                entity = world.createEntity();
            });

            it('should be able to recall the entity by id', () => {
                const result = world.getEntity(entity.id);

                expect(result).toBe(entity);
            });
        });

        describe('with an ID', () => {
            let givenId;

            beforeEach(() => {
                givenId = chance.guid();
                entity = world.createEntity(givenId);
            });

            it('should assign the ID to the entity', () => {
                expect(entity.id).toBe(givenId);
            });

            it('should be able to recall the entity by id', () => {
                const result = world.getEntity(givenId);

                expect(result).toBe(entity);
            });
        });
    });

    describe('destroyEntity', () => {
        let entity;

        beforeEach(() => {
            entity = world.createEntity();

            world.destroyEntity(entity.id);
        });

        it('should no longer be able to recall by entity id', () => {
            const result = world.getEntity(entity.id);

            expect(result).toBeUndefined();
        });
    });
});
