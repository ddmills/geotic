import * as ec from './geotic';

let dog = new ec.entity();

ec.component('pos', entity => ({ x:0, y:0, z:0 }));
ec.component('hair', (entity) => {
  return { style: 'shaggy' };
});

dog.add('pos');
dog.add('hair');
ec.addEntity(dog);

console.log(dog.c.hair.style);
console.log(ec.find.entities.with.components('pos', 'hair'));
