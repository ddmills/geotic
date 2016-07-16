import { World } from '../build';
import CarFactory from './CarFactory';
import MovementSystem from './MovementSystem';

let id = 0;

let car = CarFactory.create(id);
let world = new World();

world.addSystem(new MovementSystem);

world.addEntity(car);

world.update(2);
world.update(2);
world.update(2);

console.log(world.serialize());

world.removeEntity(car.id);
world.addEntity(car);

console.log(world.serialize());

world.destroyEntity(car.id);

console.log(world.serialize());
