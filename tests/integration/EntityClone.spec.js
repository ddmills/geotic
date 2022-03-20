import { Engine } from '../../src/Engine';
import {
    EmptyComponent,
    SimpleComponent,
    NestedComponent,
    ArrayComponent,
} from '../data/components';

describe('Entity Clone', () => {
    let world;

    beforeEach(() => {
        const engine = new Engine();

        engine.registerComponent(EmptyComponent);
        engine.registerComponent(SimpleComponent);
        engine.registerComponent(NestedComponent);
        engine.registerComponent(ArrayComponent);

        world = engine.createWorld();
    });

    describe('clone', () => {
        let entity, nestedKeyA, nestedKeyB;

        beforeEach(() => {
            nestedKeyA = chance.word();
            nestedKeyB = chance.word();

            entity = world.createEntity();
            entity.add(EmptyComponent);
            entity.add(SimpleComponent, { testProp: chance.string() });
            entity.add(ArrayComponent, { name: chance.word() });
            entity.add(ArrayComponent, { name: chance.word() });
            entity.add(NestedComponent, { name: nestedKeyA });
            entity.add(NestedComponent, { name: nestedKeyB });
        });

        it('should clone component data and assign new id', () => {
            const clone = entity.clone();

            expect(clone.id).not.toEqual(entity.id);

            const entityJson = entity.serialize();
            const cloneJson = clone.serialize();

            expect({
                ...entityJson,
                id: null,
            }).toEqual({
                ...cloneJson,
                id: null,
            });
        });
    });
});
