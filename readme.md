#### geotic

_adjective_ physically concerning land or its inhabitants.

-   **entity** a unique id and a collection of components
-   **tag** a group of entities
-   **component** a data container
-   **prefab** a pre-defined collection of components and even other prefabs
-   **event** message between components or entities
-   **system** logic that acts on entities with specific components or tags

This library is _heavily_ inspired by ECS in Caves of Qud:

-   [Thomas Biskup - There be dragons: Entity Component Systems for Roguelikes](https://www.youtube.com/watch?v=fGLJC5UY2o4&t=1534s)
-   [Brian Bucklew - AI in Qud and Sproggiwood](https://www.youtube.com/watch?v=4uxN5GqXcaA)
-   [Brian Bucklew - Data-Driven Engines of Qud and Sproggiwood](https://www.youtube.com/watch?v=U03XXzcThGU)

### usage

`npm install geotic`

```js
import geotic from 'geotic'; // or
import { Engine, Component, Prefab } from 'geotic';

const ecs = new Engine();

class Position extends Component {
    static properties {
        x: 0,
        y: 0,
    };
}

ecs.registerComponent(Position);

const entity = ecs.createEntity();

entity.addComponent(Position, { x: 4, y: 10 });


const query = ecs.createQuery((e) => e.has('Position'));

query.get().forEach(...);

```

[example](https://github.com/ddmills/geotic/blob/master/example/index.js)

### entities

> a unique id and a collection of components

```js
const zombie = ecs.createEntity();

zombie.add('Name', { value: 'Donnie' });
zombie.add('Position', { x: 2, y: 0, z: 3 });
zombie.add('Velocity', { x: 0, y: 0, z: 1 });
zombie.add('Health', { value: 200 });
zombie.add('Enemy');
```

Entity properties and methods:

-   **id**: the entities' unique id. Generated by the engine.
-   **ecs**: the geotic Engine instance
-   **components**: all component instances attached to this entity
-   **add(componentName, props={})**: add registered component to the entity
-   **has(componentName, key='')**: returns true if entity has component
-   **remove(componentName, key='')**: remove component from the entity
-   **serialize()**: serialize the entity and it's components
-   **fireEvent(name, data={})**: send an event to all components on the entity

### components

> a data container

A component must be defined and then registered with the Engine. This example defines a simple `Health` component:

```js
import { Component } from 'geotic';

class Health extends Component {
    // these props are defaulting to 10
    // anything defined here will be serialized
    static properties {
        current: 10,
        maximum: 10,
    };

    get isAlive() {
        return this.current > 0;
    }

    reduce(amount) {
        this.current = Math.max(this.current - amount, 0);
    }

    heal(amount) {
        this.current = Math.min(this.current + amount, this.maximum);
    }
}
```

Component properties and methods:

-   **static properties = {}** object that defines the properties of the component
-   **static allowMultiple = false** are multiple of this component type allowed?

### systems

Systems act on sets entities grouped by component types. Systems
do not have any fancy structure, they can simply make use of built
in tools from geotic.

-   **findById(id)** get an entity by it's id
-   **findByTag(...tags)** get an array of entities with given tags
-   **findByComponent(...components)** get an array of entities with given components names

**example** destroy all entities with an 'enemy' tag.

```js
const removeEnemies = () => {
    geotic.findByTag('enemy').forEach((e) => e.destroy());
};
```

**example** apply velocity to all entities with a `position` and `velocity` component.

```js
const applyVelocity = (dt) => {
    // only entities with both position and velocity are accepted
    const entities = geotic.findByComponent('position', 'velocity');
    entities.forEach((e) => {
        e.position.x += dt * e.velocity.x;
        e.position.y += dt * e.velocity.y;
        e.position.z += dt * e.velocity.z;
    });
};
```

**example** serialize all entities and state and store it

```js
const saveGame = () => {
    const data = geotic.serialize();
    localStorage.setItem('savegame', data);
};
```

**example** deserialize all entities and state and restore it

```js
const loadGame = () => {
    const data = localStorage.getItem('savegame');
    geotic.deserialize(data);
};
```

### components

> simple data container

Components can be simple or complex.

```js
component(name, callback);
component('pos', () => ({ x: 0, y: 0, z: 0 }));
component('name', (entity, name) => name);
```

The name must be unique. The callback is a function which should return an instance of the component. The results of the callback will be attached to the entity at `entity.componentName`.

Components can provide optional functions:

-   **mount(entity)**: called when component is _added_ to given entity
-   **unmount(entity)**: called when component is _removed_ from given entity
-   **serialize()**: how to explicitly serialize this object
-   **static deserialize(data)**: how to explicitly deserialize some serialized data back into a component (should return a new instance of the component)

Components can be primitive data types, basic objects, functions, or classes. As long as they have a unique name.

**example** register a `health` component which returns an instance of the `Health` class.

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

component('health', (entity, max) => new Health(max));
```

The component can then be attached to an entity (via the `add` function), and accessed via it's name.

```js
// rabbits have 80hp max.
const rabbit = entity().add('health', 80);
rabbit.health.reduce(5);

console.log(rabbit.health.alive);
```

**example** create a `kill` component, using the health class above.

```js
component('kill', (entity) => {
    // in order to be killable, the entity must have a 'health' component.
    // `mandate` will retrieve the health component if it exists, or
    // create one if it doesn't.
    const health = entity.mandate('health');

    // we return a function, which when called will set the current health to zero
    return () => (health.current = 0);
});

const rabbit = entity().add('health', 80).add('kill');

rabbit.kill();
```

### events

> message sent to all components on an entity

## v2

TODO

-   deserialize
    -   ✓ basic serialize/deserialize from object
    -   onAttached safely access entity
-   serialize
    -   only serialize if value is different from default (?)
-   prefab
    -   ✓ prefab base class
    -   ✓ prefab registry
    -   ✓ poly inherit
    -   ✓ PrefabComponent types
        -   ✓ component definition
        -   ✓ initial props
        -   ✓ should overwrite or replace
        -   ✓ applyToEntity(entity)
    -   reference prefab chain on entity
        -   entity.is(prefab)
    -   allow overrides on prefab instantiation
    -   https://www.youtube.com/watch?v=fGLJC5UY2o4
-   ✓ query
    -   ✓ cache
    -   ✓ filter
    -   ? re-filter on property change
        -   simple query vs advanced (?)
    -   return Array instead of Object
    -   filter destroyed entities by default
-   logging configuration
    -   route all console logs to logger
    -   check all console log statements
-   tags
-   properties
    -   <EntitySet>
    -   <Prefab>
    -   <PrefabSet>
-   ✓ events
    -   ✓ https://www.youtube.com/watch?v=4uxN5GqXcaA
    -   ✓ entity.sendEvent(event)
    -   ✓ component.handleEvent(event)
    -   ✓ an event to an entity will send it to all child components
    -   ✓ child component can "cancel" the event to prevent it bubbling (?)
    -   ✓ component eventMap
    -   ✓ replace eventMap with direct method calls
    -   global events (sent from Engine)
-   dev
    -   ✓ sourcemaps
    -   ✓ prettier
    -   ✓ rollup
    -   github npm deploy action
-   component
    -   ✓ default property values
    -   property.deserialize(data)
    -   ✓ remove()
        -   ensure works with key components
    -   ✓ destroy()
    -   ✓ onDestroyed()
    -   clone
    -   ✓ allowMultiple without specifying keyProperty
    -   ✓ rename accessor to `key`
    -   rename `type` to `definitionType`
-   registry
    -   warn if component malformed (?)
-   prefab caching
    -   only instantiate components when different from defaults
    -   less instances
-   ✓ Entity registry
-   Entity
    -   ✓ keep track of refs
    -   ✓ destroy()
        -   ✓ component.onDestroy()
        -   property.onDestroy() (do ref cleanup)
    -   shift component add/remove code to manager
    -   ✓ add(type, properties);
    -   control how components are named
    -   ✓ camelCase component access
-   Performance
    -   Use raw for loops
    -   store entities as array instead of object (?)
