import Material from './components/Material';
import Position from './components/Position';
import { Entity, ComponentRegistry } from '../build';

// const axe = new Entity();
// const bronze = new BronzeMaterial();
// axe.add(bronze);
// axe.remove(bronze);

// const player = new Entity();
// player.add(new FleshMaterial());
// player.add(new Position({ x: 1, y: 3}));

const registry = new ComponentRegistry();

registry.register(Material);
registry.register(Position);

const mat = registry.get('Material');

const e = new Entity();
e.add(new mat('test'));
// e.remove('Material');
