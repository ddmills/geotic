import * as ec from './ec';

let dog = new ec.entity();

let pos = ec.component('pos', {
  x: 10,
  y: 15,
  z: 8
});

let hair = ec.component('hair', {
  style: 'shaggy'
});

dog.add('pos');
dog.add('hair');
ec.addEntity(dog);

console.log(dog.c.hair.style);
console.log(ec.find.entities.with.components('pos', 'hair'));
