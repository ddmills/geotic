#### geotic

*adjective* physically concerning land or its inhabitants. `npm install geotic`

- **entity** a unique id and a collection of components
- **component** simple logic-less data container
- **system** logic that acts on entities with specific components or tags

[example](https://github.com/ddmills/geotic/blob/master/example/index.js)

```js
import { entity, component } from 'geotic';
import geotic from 'geotic';

// define components
component('pos', () => ({ x:0, y:0, z:0 }));
component('hair', (entity) => {
  return {
    style: 'shaggy',
    mount: (e) => {}, // called on attached to entity
    unmount: (e) => {} // called on removed from entity
  };
});

// components can be basic
component('name', (entity, name) => name);

// create entities
const dog = entity();
const cat = entity();

// attach components
dog.add('name', 'Sam');
dog.add('hair');
dog.add('pos');

cat.add('name', 'Princess Dilly');
cat.add('hair');
cat.add('pos');

// reference coponents by "entity.c[component-name]"
console.log(`hello ${cat.c.name}`); // "Princess Dilly"

// set properties on components
cat.c.pos.x = 20;

// all entities have an id
console.log(cat.id);

// get all entities which have a 'pos' and 'hair' component
console.log(geotic.findByComponent('pos', 'hair'));  // [cat, dog]

// remove a component from an entity
cat.remove('hair');

console.log(geotic.findByComponent('pos', 'hair')); // [dog]
```

#### development
```
npm install
npm run dev
```
