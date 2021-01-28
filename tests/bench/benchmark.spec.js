import Engine from '../../src/Engine';
import Component from '../../src/Component';

describe('benchmark', () => {
    let engine, query;

    class ComponentA extends Component {}
    class ComponentB extends Component {}

    it('does 10000 additions and removals', () => {
        let time = 0;
        const testCount = 10;

        for (let i = 0; i < testCount; i++) {
            engine = new Engine();

            engine.registerComponent(ComponentA);
            engine.registerComponent(ComponentB);

            query = engine.createQuery({
                all: [ComponentA, ComponentB]
            });

            const start = Date.now();

            for (let j = 0; j < 10000; j++) {
                const entity = engine.createEntity();

                entity.add(ComponentA);
                entity.add(ComponentB);
            }

            const end = Date.now();
            const delta = end - start;

            console.log(`T${i} ${delta}ms`);

            time += delta;
        }

        const avg = time / testCount;

        console.log(`AVG ${avg.toFixed(2)}ms`);
    });
});
