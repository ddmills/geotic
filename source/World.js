'use strict';

import EntityList from './EntityList';
import SignatureList from './SignatureList';
import TagList from './TagList';

export default class World
{
  constructor()
  {
    this.systems = [];
    this.entityList = new EntityList();
    this.tagList = new TagList(this.entityList);
    this.signatureList = new SignatureList(this.entityList);
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
    return this.getSignature.apply(this, componentNames).entities;
  }

  getSignature(...componentNames)
  {
    return this.signatureList.findOrCreate(componentNames);
  }

  getTag(...tagNames)
  {
    return this.tagList.findOrCreate(tagNames);
  }

  getTagged(...tagNames)
  {
    return this.getTag.apply(this, tagNames).entities;
  }

  serialize()
  {
    return {
      entities: this.entityList.serialize()
    };
  }
}
