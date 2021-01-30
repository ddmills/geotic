import { Engine } from '../../src/Engine';
import ComponentRegistry from '../../src/Registries/ComponentRegistry';
import { EmptyComponent } from '../data/components';

describe('ComponentRegistry', () => {
    let engine, registry;

    beforeEach(() => {
        engine = new Engine();
        registry = new ComponentRegistry(engine);
    });

    describe('get', () => {
        beforeEach(() => {
            registry.register(EmptyComponent);
        });

        it('should return the component by class', () => {
            expect(registry.get(EmptyComponent)).toBe(EmptyComponent);
        });

        it('should return the component by type', () => {
            expect(registry.get('EmptyComponent')).toBe(EmptyComponent);
        });

        it('should return the component by instance', () => {
            const instance = new EmptyComponent(engine);

            expect(registry.get(instance)).toBe(EmptyComponent);
        });
    });
});
