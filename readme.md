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

### systems
```js
const applyVelocity = (dt) => {
  const entities = geotic.findByComponent('position', 'velocity');
  entities.forEach(e => {
    e.c.position.x += dt * e.c.velocity.x;
    e.c.position.y += dt * e.c.velocity.y;
    e.c.position.z += dt * e.c.velocity.z;
  });
}
```

```js
const removeEnemies = () => {
  geotic
    .findByTag('enemy')
    .forEach(e => e.destroy());
}
```

```js
const saveGame = () => {
  const data = geotic.serialize();
  localStorage.setItem('savegame', data);
}
```

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
geotic.findById(id).c.name; // 'danny'
```
