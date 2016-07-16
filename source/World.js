'use strict';

import EntityList from './EntityList';
import SignatureList from './SignatureList';

export default class World
{
  constructor()
  {
    this.entityList = new EntityList();
    this.signatureList = new SignatureList(this.entityList);
    this.systems = [];
  }

  addSystem(system)
  {
    this.systems.push(system);
    system.world = this;
  }

  update(time)
  {
    this.systems.forEach(sys => sys.update(this, time));
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
