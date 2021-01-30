import { Engine } from '../../src/index';
import { ComponentRegistry } from '../../src/ComponentRegistry';
import { EmptyComponent } from '../data/components';

describe('ComponentRegistry', () => {
    let registry;

    beforeEach(() => {
        const engine = new Engine();

        registry = new ComponentRegistry(engine);
    });

    describe('get', () => {
        let expectedKey = 'emptyComponent';

        beforeEach(() => {
            registry.register(EmptyComponent);
        });

        it('should assign a _ckey', () => {
            expect(EmptyComponent.prototype._ckey).toBe(expectedKey);
        });

        it('should return the component by key', () => {
            expect(registry.get(expectedKey)).toBe(EmptyComponent);
        });
    });
});
