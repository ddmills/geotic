'use strict';

import { methods } from 'event-emitter';
import hasListeners from 'event-emitter/has-listeners';
import allOff from 'event-emitter/all-off';


export default class Emitter {
  hasListeners() {
    return hasListeners(this);
  }

  allOff() {
    return allOff(this);
  }
}

for (let method in methods) {
  Object.defineProperty(Emitter.prototype, method, { value: methods[method] });
}
