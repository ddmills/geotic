import { Engine } from '../../src/Engine';
import { Component } from '../../src/Component';

class ComponentA extends Component {
    static allowMultiple = true;
}
class ComponentB extends Component {}

describe('benchmark', () => {
    let engine, world;

    it('does 10000 additions and removals', () => {
        let time = 0;
        const testCount = 20;

        for (let i = 0; i < testCount; i++) {
            engine = new Engine();
            world = engine.createWorld();

            engine.registerComponent(ComponentA);
            engine.registerComponent(ComponentB);

            world.createQuery({
                all: [ComponentA]
            });

            const start = performance.now();

            for (let j = 0; j < 1000; j++) {
                const entity = world.createEntity();

                // entity.add(ComponentA);
                // entity.add(ComponentA);
                entity.add(ComponentB);
                // entity.destroy();
            }

            const end = performance.now();
            const delta = end - start;

            console.log(`T(${i}) ${delta.toFixed(1)}ms`);

            time += delta;
        }

        const avg = time / testCount;

        console.log(`AVG(${testCount}) ${avg.toFixed(1)}ms`);
    });
});
