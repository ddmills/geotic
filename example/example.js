import { World } from '../build';
import CarFactory from './CarFactory';
import MovementSystem from './MovementSystem';

let id = 0;
let car = CarFactory.create(++id);
let world = new World();

world.addSystem(new MovementSystem);
world.addEntity(car);


let now = Date.now();

setInterval(() => {
  let prev = now;
  now = Date.now();

  world.update(now - prev);
  console.log(car.position.serialize());
}, 1000);
