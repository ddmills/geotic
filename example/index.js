import { entity, component } from '../source/geotic';
import geotic from '../source/geotic';

// define components
component('pos', () => ({ x:0, y:0, z:0 }));
component('name', (entity, name) => name);
component('hair', (entity) => {
  return {
    style: 'shaggy',
    mount: (e) => {}, // called on attached to entity
    unmount: (e) => {} // called on removed from entity
  };
});

//define entities
const dog = entity()
  .add('hair')
  .add('name', 'Sam') // pass arguments to components
  .tag('animal')
  .add('pos');

const cat = entity()
  .add('name', 'Princess Dilly')
  .tag('animal')
  .add('hair')
  .add('pos');

cat.c.name; // "Princess Dilly"
cat.c.pos.x = 20;
cat.id;

geotic.findByComponent('name', 'hair');  // [cat, dog]

cat.remove('hair');

geotic.findByComponent('name', 'hair'); // [dog]

geotic.findByTag('animal');  // [cat, dog]
