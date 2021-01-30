import { Engine } from './src/Engine';
import { Component } from './src/Component';

class ComponentA extends Component {
    static allowMultiple = true;
}

class ComponentB extends Component {
    static allowMultiple = true;
    static keyProperty = 'k';
    static properties = {
        k: 0,
    };
}

class ComponentC extends Component {}

let engine, world;

let time = 0;
const testCount = 30;

for (let i = 0; i < testCount; i++) {
    engine = new Engine();
    world = engine.createWorld();

    engine.registerComponent(ComponentA);
    engine.registerComponent(ComponentB);
    engine.registerComponent(ComponentC);

    world.createQuery({
        all: [ComponentA],
    });

    world.createQuery({
        all: [ComponentB],
    });

    world.createQuery({
        all: [ComponentC],
    });

    const start = Date.now();

    for (let j = 0; j < 10000; j++) {
        const entity = world.createEntity();

        entity.add(ComponentA);
        entity.add(ComponentB);
        entity.add(ComponentC);

        entity.destroy();
    }

    const end = Date.now();
    const delta = end - start;

    console.log(`T(${i}) ${Math.round(delta)}ms`);

    time += delta;
}

const avg = time / testCount;

console.log(`AVG(${testCount}) ${Math.round(avg)}ms`);
