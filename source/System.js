'use strict';

export default class System
{
  update(world)
  {
    let entities = world.getEntities(['Component']);
    console.log(entities);
  }
}
