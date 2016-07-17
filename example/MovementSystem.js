import { System } from '../build';

export default class MovementSystem extends System
{
  update(world, delta)
  {
    let entities = world.getEntities('position', 'velocity');

    for (let [id, entity] of entities) {
      entity.position.x += entity.velocity.x * delta;
      entity.position.y += entity.velocity.y * delta;
      entity.position.z += entity.velocity.z * delta;
    }
  }
}
