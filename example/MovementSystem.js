import { System } from '../build';

export default class MovementSystem extends System
{
  update(world, delta)
  {
    // the movement system will update entities who have
    // a Position and a Velocity component
    let entities = world.getEntities('position', 'velocity');

    for (let [id, entity] of entities) {
      entity.position.x += entity.velocity.x * delta;
      entity.position.y += entity.velocity.y * delta;
      entity.position.z += entity.velocity.z * delta;
    }
  }
}
