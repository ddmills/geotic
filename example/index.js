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


const dog = entity() // create a new entity
  .add('hair') // add a hair component
  .add('name', 'Sam') // pass arguments to components
  .tag('animal') // tags can be used for many things
  .add('pos');

const cat = entity()
  .add('name', 'Princess Dilly')
  .tag('animal')
  .add('hair')
  .add('pos');

// reference components by "entity.c[component-name]"
cat.c.name; // "Princess Dilly"

// set properties on components
cat.c.pos.x = 20;

// all entities have an id (integer)
cat.id;

// get all entities which have a 'name' and 'hair' component
geotic.findByComponent('name', 'hair');  // [cat, dog]

// remove a component from an entity
cat.add('hair');

geotic.findByComponent('name', 'hair'); // [dog]

// get all entities with given tags
geotic.findByTag('animal');  // [cat, dog]
