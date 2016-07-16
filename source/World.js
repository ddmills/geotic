'use strict';

export default class World
{
  constructor(entityList, signatureList)
  {
    this.families = {};
    this.entityList = entityList;
    this.signatureList = signatureList;
    this.systems = [];
  }

  addSystem(system)
  {
    this.systems.push(system);
    system.world = this;
    system.onAttach(this);
  }

  addEntity(entity)
  {
    this.entityList.addEntity(entity);
  }

  getEntities(componentNames)
  {
    return this.signatureList.findOrCreate(componentNames).entities;
  }
}
