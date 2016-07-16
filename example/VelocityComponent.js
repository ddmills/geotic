import { Component } from '../build';

export default class VelocityComponent extends Component
{
  constructor(x = 0, y = 0, z = 0)
  {
    super('velocity');

    this.x = x,
    this.y = y,
    this.z = z
  }
}
