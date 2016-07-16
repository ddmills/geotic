'use strict';

import Signature from './Signature';


export default class SignatureList
{
  constructor(entityList)
  {
    this.signatures = new Map();
    this.entityList = entityList;
    this.entityList.on('entity-added', this.onEntityAdd.bind(this));
    this.entityList.on('entity-destroyed', this.onEntityDestroy.bind(this));
  }

  onEntityAdd(entity)
  {
    for (let signature of this.signatures) {
      signature.addEntityIfMatches(entity);
    }
  }

  onEntityDestroy(entity)
  {
    for (let signature of this.signatures) {
      signature.removeEntity(entity);
    }
  }

  hash(componentNames)
  {
    return componentNames.join('$');
  }

  findOrCreate(componentNames)
  {
    let hash = this.hash(componentNames);

    let signature = this.signatures[hash];

    if (!signature) {
      signature = new Signature(componentNames, hash);

      for (let [id, entity] of this.entityList.entities) {
        signature.addEntityIfMatches(entity);
      }

      this.signatures[hash] = signature;
    }

    return signature;
  }
}
