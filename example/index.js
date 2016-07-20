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

// create entities and
// attach components
const dog = entity()
  .add('name', 'Sam')
  .add('hair')
  .add('pos');

const cat = entity()
  .add('name', 'Princess Dilly')
  .add('hair')
  .add('pos');

// reference coponents by "entity.c[component-name]"
cat.c.name; // "Princess Dilly"

// set properties on components
cat.c.pos.x = 20;

// all entities have an id (integer)
cat.id;

// get all entities which have a 'name' and 'hair' component
geotic.findByComponent('name', 'hair');  // [cat, dog]

// remove a component from an entity
cat.remove('hair');

geotic.findByComponent('name', 'hair'); // [dog]
