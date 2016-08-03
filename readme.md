#### geotic

*adjective* physically concerning land or its inhabitants.

- **entity** a unique id and a collection of components
- **tag** a group of entities
- **component** simple data container
- **system** logic that acts on entities with specific components or tags


### usage
`npm install geotic`

```js
import geotic from 'geotic'; // or
import { entity, component } from 'geotic';
```
[example](https://github.com/ddmills/geotic/blob/master/example/index.js)
[example using three.js](https://github.com/ddmills/geotic-threejs)


### entities

> a unique id and a collection of components

```js
const zombie = entity()
  .add('name', 'Donnie')
  .add('position': {x: 2, y: 0, z: 3} })
  .add('velocity': {x: 0, y: 0, z: 1} })
  .add('health', 200)
  .tag('enemy');
```

Entity functions:
* **add(componentName, ...args)**: add registered component to the entity
* **has(componentName)**: returns true if entity has component
* **remove(componentName)**: remove component from the entity
* **mandate(componentName, ...args)**: add registered component to the entity if not already added (returns the component)
* **destroy()**: destroy the entity (and it's components)
* **tag(name, (data))**: add a tag to the entity (data optional)
* **untag(name)**: remove a tag from the entity
* **serialize()**: serialize the entity and it's components
* **static deserialize(data)**: deserialize data into a new entity instance
* **t**: tags on the entity
* **id**: the entities' unique id


### systems
Systems act on sets entities grouped by component types. Systems
do not have any fancy structure, they can simply make use of built
in tools from geotic.

* **findById(id)** get an entity by it's id
* **findByTag(...tags)** get an array of entities with given tags
* **findByComponent(...components)** get an array of entities with given components names


**example** destroy all entities with 'enemy' tag
```js
const removeEnemies = () => {
  geotic
    .findByTag('enemy')
    .forEach(e => e.destroy());
}
```

**example** apply velocity to an entity.
```js
const applyVelocity = (dt) => {
  // only entities with both position and velocity are accepted
  const entities = geotic.findByComponent('position', 'velocity');
  entities.forEach(e => {
    e.position.x += dt * e.velocity.x;
    e.position.y += dt * e.velocity.y;
    e.position.z += dt * e.velocity.z;
  });
}
```

**example** serialize all entities and state and store it
```js
const saveGame = () => {
  const data = geotic.serialize();
  localStorage.setItem('savegame', data);
}
```

**example** deserialize all entities and state and restore it
```js
const loadGame = () => {
  const data = localStorage.getItem('savegame');
  geotic.deserialize(data);
}
```


### components

> simple data container

Components can be simple or complex
```js
component(name, callback);
component('pos', () => ({ x:0, y:0, z:0 }));
component('name', (entity, name) => name);
```

Components can provide optional functions:
* **mount(entity)**: called when component is *added* to given entity
* **unmount(entity)**: called when component is *removed* from given entity
* **serialize()**: how to explicitly serialize this object
* **static deserialize(data)**: how explicitly deserialize the data (should return a new instance of the component)


Components can be classes
```js
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
```

### tags

```js
const addZombie = (name) => {
  const zombie = entity()
    .add('name', name)
    .add('sprite', 'walker.png')
    .add('speed', 1)
    .add('position')
    .add('velocity')
    .add('health', Math.random() * 100);

  zombie.tag('lastCreated', { id: zombie.id });
};

addZombie('bonnie');
addZombie('greg');
addZombie('danny');

const id = geotic.getTag('lastCreated').id;
geotic.findById(id).name; // 'danny'
```
