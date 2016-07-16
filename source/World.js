'use strict';

export default class World
{
  constructor(entityList, signatureList)
  {
    this.entityList = entityList;
    this.signatureList = signatureList;
    this.systems = [];
  }

  addSystem(system)
  {
    this.systems.push(system);
  }

  update()
  {
    this.systems.forEach(sys => sys.update(this));
  }

  addEntity(entity)
  {
    this.entityList.add(entity);
  }

  getEntities(...componentNames)
  {
    return this.signatureList.findOrCreate(componentNames).entities;
  }
}
