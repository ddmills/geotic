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
    system.onAttach(this);
  }

  update(time)
  {
    this.systems.forEach(sys => sys.update(this, time));
  }

  addEntity(entity)
  {
    this.entityList.add(entity);
  }

  removeEntity(id)
  {
    this.entityList.remove(id);
  }

  destroyEntity(id)
  {
    this.entityList.destroy(id);
  }

  getEntities(...componentNames)
  {
    return this.getSignature(componentNames).entities;
  }

  getSignature(...componentNames)
  {
    return this.signatureList.findOrCreate(componentNames);
  }

  serialize()
  {
    return {
      entities: this.entityList.serialize()
    };
  }
}
