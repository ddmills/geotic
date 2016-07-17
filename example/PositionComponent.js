import { Component } from '../build';

export default class PositionComponent extends Component
{
  constructor(x = 0, y = 0, z = 0)
  {
    super('position');

    this.x = x;
    this.y = y;
    this.z = z;
  }
}
