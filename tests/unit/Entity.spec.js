import Engine from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import Component from '../../src/Component';

describe('Engine', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();
        engine.registerComponent(EmptyComponent);
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
    });

    describe('destroy', () => {
        let entity;

        beforeEach(() => {
            entity = engine.createEntity();
            entity.destroy();
        });

        it('should no longer be able to recall by entity id', () => {
            const result = engine.getEntity(entity.id);

            expect(result).toBeUndefined();
        });

        it('should set the isDestroyed flag to TRUE', () => {
            expect(entity.isDestroyed).toBe(true);
        });
    });
});
