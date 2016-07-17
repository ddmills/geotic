import { Entity } from '../build';
import PositionComponent from './PositionComponent';
import VelocityComponent from './VelocityComponent';

export default class CarFactory
{
  static create(id)
  {
    let car = new Entity(++id);
    car.addComponent(new PositionComponent());
    car.addComponent(new VelocityComponent(.2, 0, -.1));
    return car;
  }
}
