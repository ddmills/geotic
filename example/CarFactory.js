import { Entity } from '../build';
import PositionComponent from './PositionComponent';
import VelocityComponent from './VelocityComponent';

export default class CarFactory
{
  static create(id)
  {
    let car = new Entity(++id);
    car.addComponent(new PositionComponent());
    car.addComponent(new VelocityComponent(3, 0, 0));
    return car;
  }
}
