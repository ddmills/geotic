import Engine from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import Component from '../../src/Component';

describe('Engine', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();
    });

    describe('createEntity', () => {
        let entity;

        beforeEach(() => {
            entity = engine.createEntity();
        });

        it('should be able to recall the entity by id', () => {
            const result = engine.getEntity(entity.id);

            expect(result).toBe(entity);
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
