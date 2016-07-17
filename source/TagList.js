'use strict';

import Tag from './Tag';


export default class TagList
{
  constructor(entityList)
  {
    this.tags = new Map();
    this.entityList = entityList;
    this.entityList.on('entity-added', this.onEntityAdded.bind(this));
    this.entityList.on('entity-destroyed', this.onEntityDestroyed.bind(this));
    this.entityList.on('component-added', this.onComponentAdded.bind(this));
    this.entityList.on('component-removed', this.onComponentRemoved.bind(this));
  }

  onEntityAdded(entity)
  {
    for (let [hash, tag] of this.tags) {
      tag.addEntityIfMatches(entity);
    }
  }

  onEntityDestroyed(entity)
  {
    for (let [hash, tag] of this.tags) {
      tag.removeEntity(entity);
    }
  }

  onComponentAdded(entity, component)
  {
    for (let [hash, tag] of this.tags) {
      tag.addEntityIfMatches(entity);
    }
  }

  onComponentRemoved(entity, component)
  {
    for (let [hash, tag] of this.tags) {
      tag.onComponentRemoved(entity, component);
    }
  }

  hash(tagNames)
  {
    return tagNames.sort((a, b) => { return a > b }).join('$');
  }

  findOrCreate(tagNames)
  {
    let hash = this.hash(tagNames);
    let tag = this.tags.get(hash);


    if (!tag) {
      tag = new Tag(tagNames);

      for (let [id, entity] of this.entityList.all()) {
        tag.addEntityIfMatches(entity);
      }

      this.tags.set(hash, tag);
    }

    return tag;
  }
}
