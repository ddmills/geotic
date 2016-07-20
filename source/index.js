import * as ec from './ec';

let e = new ec.entity();

let pos = ec.component('pos', {
  x: 10,
  y: 15,
  z: 8
});

let dog = ec.component('dog', {
  style: 'shaggy'
});

e.add('position');
e.add('dog');
ec.addEntity(e);

console.log(e.c.dog.style);

console.log(ec.find.entities.with.components('position', 'dog'));
