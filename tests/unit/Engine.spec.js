import Engine from '../../src/Engine';

describe('Engine', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();
    });

    describe('createEntity', () => {
        let entity;

        describe('without an ID', () => {
            beforeEach(() => {
                entity = engine.createEntity();
            });

            it('should be able to recall the entity by id', () => {
                const result = engine.getEntity(entity.id);

                expect(result).toBe(entity);
            });
        });

        describe('with an ID', () => {
            let givenId;

            beforeEach(() => {
                givenId = chance.guid();
                entity = engine.createEntity(givenId);
            });

            it('should assign the ID to the entity', () => {
                expect(entity.id).toBe(givenId);
            });

            it('should be able to recall the entity by id', () => {
                const result = engine.getEntity(givenId);

                expect(result).toBe(entity);
            });
        });
    });

    describe('destroyEntity', () => {
        let entity, data;

        beforeEach(() => {
            entity = engine.createEntity();
            engine.destroyEntity(entity);
        });

        it('should no longer be able to recall by entity id', () => {
            const result = engine.getEntity(entity.id);

            expect(result).toBeUndefined();
        });
    });
});
