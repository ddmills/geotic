'use strict';

import { methods } from 'event-emitter';

export default class Emitter { }

for (let method in methods) {
  Object.defineProperty(Emitter.prototype, method, { value: methods[method] });
}
