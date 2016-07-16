'use strict';

import { methods } from 'event-emitter';

export default class Emitter
{
  constructor()
  {
  }
}

for (let method in methods) {
  Emitter.prototype[method] = methods[method];
}
