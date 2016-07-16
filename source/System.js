'use strict';

export default class System
{
  constructor()
  {
    this.types = [];
  }

  onAttach(world)
  {
  }

  update(world)
  {
    let entities = world.getEntities(['Component']);
    console.log(entities);
  }
}
