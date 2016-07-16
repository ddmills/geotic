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

console.log(car.position.x);
