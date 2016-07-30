import { entity, component } from '../source/geotic';
import geotic from '../source/geotic';

// define components
component('pos', () => ({ x:0, y:0, z:0 }));
component('name', (entity, name) => name);

class Health {
  constructor(max = 100) {
    this.max = max;
    this.current = max;
  }
  reduce(amount) {
    this.current -= this.current ? amount : 0;
  }
  heal(amount) {
    this.current += amount;
    if (this.current > this.max) this.current = this.max;
  }
  get alive() {
    return this.current > 0;
  }
}

component('health', (entity, max) =>  new Health(max));

//define entities
const dog = entity()
  .add('name', 'Sam')
  .add('health');

let data = geotic.serialize();
let clone = geotic.deserialize(data);


geotic.findByComponent('health')[1].health.reduce(5);
