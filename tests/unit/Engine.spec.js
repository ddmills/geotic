import { Engine } from '../../src/Engine';
import { World } from '../../src/World';

describe('Engine', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();
    });

    describe('createWorld', () => {
        let result;

        beforeEach(() => {
            result = engine.createWorld();
        });

        it('should create a World instance', () => {
            expect(result).toBeInstanceOf(World);
        });
    });
});
