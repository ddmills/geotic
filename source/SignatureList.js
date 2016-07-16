'use strict';

import Signature from './Signature';


export default class SignatureList
{
  constructor(entityList)
  {
    this.signatures = new Map();
    this.entityList = entityList;
    this.entityList.on('entity-added', this.onEntityAdded.bind(this));
    this.entityList.on('entity-destroyed', this.onEntityDestroyed.bind(this));
    this.entityList.on('component-added', this.onComponentAdded.bind(this));
    this.entityList.on('component-removed', this.onComponentRemoved.bind(this));
  }

  onEntityAdded(entity)
  {
    for (let [hash, signature] of this.signatures) {
      signature.addEntityIfMatches(entity);
    }
  }

  onEntityDestroyed(entity)
  {
    for (let [hash, signature] of this.signatures) {
      signature.removeEntity(entity);
    }
  }

  onComponentAdded(entity, component)
  {
    for (let [hash, signature] of this.signatures) {
      signature.addEntityIfMatches(entity);
    }
  }

  onComponentRemoved(entity, component)
  {
    for (let [hash, signature] of this.signatures) {
      signature.onComponentRemoved(entity, component);
    }
  }

  hash(componentNames)
  {
    return componentNames.join('$');
  }

  findOrCreate(componentNames)
  {
    let hash = this.hash(componentNames);

    let signature = this.signatures.get(hash);


    if (!signature) {
      signature = new Signature(componentNames);

      for (let [id, entity] of this.entityList.all()) {
        signature.addEntityIfMatches(entity);
      }

      this.signatures.set(hash, signature);
    }

    return signature;
  }
}
