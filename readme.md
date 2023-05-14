#### geotic

_adjective_ physically concerning land or its inhabitants.

Geotic is an ECS library focused on **performance**, **features**, and **non-intrusive design**. Geotic [is consistantly one of the fastest js ecs libraries](https://github.com/ddmills/js-ecs-benchmarks), especially when it comes to large numbers of entities and queries.

-   [**entity**](#entity) a unique id and a collection of components
-   [**component**](#component) a data container
-   [**query**](#query) a way to gather collections of entities that match some criteria, for use in systems
-   [**world**](#world) a container for entities and queries
-   [**prefab**](#prefab) a template of components to define entities as JSON
-   [**event**](#event) a message to an entity and it's components

This library is _heavily_ inspired by ECS in _Caves of Qud_. Watch these talks to get inspired!

-   [Thomas Biskup - There be dragons: Entity Component Systems for Roguelikes](https://www.youtube.com/watch?v=fGLJC5UY2o4&t=1534s)
-   [Brian Bucklew - AI in Qud and Sproggiwood](https://www.youtube.com/watch?v=4uxN5GqXcaA)
-   [Brian Bucklew - Data-Driven Engines of Qud and Sproggiwood](https://www.youtube.com/watch?v=U03XXzcThGU)

Python user? Check out the Python port of this library, [ecstremity](https://github.com/krummja/ecstremity)!

### usage and examples

```
npm install geotic
```

-   [Sleepy Crawler](https://github.com/ddmills/sleepy) a full fledged roguelike that makes heavy use of geotic by [@ddmills](https://github.com/ddmills)
-   [snail6](https://github.com/luetkemj/snail6) a bloody roguelike by [@luetkemj](https://github.com/luetkemj)
-   [Gobs O' Goblins](https://github.com/luetkemj/gobs-o-goblins) by [@luetkemj](https://github.com/luetkemj)
-   [Javascript Roguelike Tutorial](https://github.com/luetkemj/jsrlt) by [@luetkemj](https://github.com/luetkemj)
-   [basic example](https://github.com/ddmills/geotic-example) using pixijs

Below is a contrived example which shows the basics of geotic:

```js
import { Engine, Component } from 'geotic';

// define some simple components
class Position extends Component {
    static properties = {
        x: 0,
        y: 0,
    };
}

class Velocity extends Component {
    static properties = {
        x: 0,
        y: 0,
    };
}

class IsFrozen extends Component {}

const engine = new Engine();

// all Components and Prefabs must be `registered` by the engine
engine.registerComponent(Position);
engine.registerComponent(Velocity);
engine.registerComponent(IsFrozen);

...
// create a world to hold and create entities and queries
const world = engine.createWorld();

// Create an empty entity. Call `entity.id` to get the unique ID.
const entity = world.createEntity();

// add some components to the entity
entity.addComponent(Position, { x: 4, y: 10 });
entity.addComponent(Velocity, { x: 1, y: .25 });

// create a query that tracks all components that have both a `Position`
// and `Velocity` component but not a `IsFrozen` component. A query can
// have any combination of `all`, `none` and `any`
const kinematics = world.createQuery({
    all: [Position, Velocity],
    none: [IsFrozen]
});

...

// geotic does not dictate how your game loop should behave
const loop = (dt) => {
    // loop over the result set to update the position for all entities
    // in the query. The query will always return an up-to-date array
    // containing entities that match
    kinematics.get().forEach((entity) => {
        entity.position.x += entity.velocity.x * dt;
        entity.position.y += entity.velocity.y * dt;
    });
};

...

// serialize all world entities into a JS object
const data = world.serialize();

...

// convert the serialized data back into entities and components
world.deserialize(data);

```

### Engine

The `Engine` class is used to register all components and prefabs, and create new Worlds.

```js
import { Engine } from 'geotic';

const engine = new Engine();

engine.registerComponent(clazz);
engine.registerPrefab({ ... });
engine.destroyWorld(world);
```

Engine properties and methods:

-   **registerComponent(clazz)**: register a Component so it can be used by entities
-   **regsterPrefab(data)**: register a Prefab to create pre-defined entities
-   **destroyWorld(world)**: destroy a world instance

### World

The `World` class is a container for entities. Usually only one instance is needed,
but it can be useful to spin up more for offscreen work.

```js
import { Engine } from 'geotic';

const engine = new Engine();
const world = engine.createWorld();

// create/destroy entities
world.createEntity();
world.getEntity(entityId);
world.getEntities();
world.destroyEntity(entityId);
world.destroyEntities();

// create queries
world.createQuery({ ... });

// create entity from prefab
world.createPrefab('PrefabName', { ... });

// serialize/deserialize entities
world.serialize();
world.serialize(entities);
world.deserialize(data);

// create an entity with a new ID and identical components & properties
world.cloneEntity(entity);

// generate unique entity id
world.createId();

// destroy all entities and queries
world.destroy();
```

World properties and methods:

-   **createEntity(id = null)**: create an `Entity`. optionally provide an ID
-   **getEntity(id)**: get an `Entity` by ID
-   **getEntities()**: get _all_ entities in this world
-   **createPrefab(name, properties = {})**: create an entity from the registered prefab
-   **destroyEntity(entity)**: destroys an entity. functionally equivilant to `entity.destroy()`
-   **destroyEntities()**: destroys all entities in this world instance
-   **serialize(entities = null)**: serialize and return all entity data into an object. optionally specify a list of entities to serialize
-   **deserialize(data)**: deserialize an object
-   **cloneEntity(entity)**: clone an entity
-   **createId()**: Generates a unique ID
-   **destroy()**: destroy all entities and queries in the world

### Entity

A unique id and a collection of components.

```js
const zombie = world.createEntity();

zombie.add(Name, { value: 'Donnie' });
zombie.add(Position, { x: 2, y: 0, z: 3 });
zombie.add(Velocity, { x: 0, y: 0, z: 1 });
zombie.add(Health, { value: 200 });
zombie.add(Enemy);

zombie.name.value = 'George';
zombie.velocity.x += 12;

zombie.fireEvent('hit', { damage: 12 });

if (zombie.health.value <= 0) {
    zombie.destroy();
}
```

Entity properties and methods:

-   **id**: the entities' unique id
-   **world**: the geotic World instance
-   **isDestroyed**: returns `true` if this entity is destroyed
-   **components**: all component instances attached to this entity
-   **add(ComponentClazz, props={})**: create and add the registered component to the entity
-   **has(ComponentClazz)**: returns true if the entity has component
-   **owns(component)**: returns `true` if the specified component belongs to this entity
-   **remove(component)**: remove the component from the entity and destroy it
-   **destroy()**: destroy the entity and all of it's components
-   **serialize()**: serialize this entity and it's components
-   **clone()**: returns an new entity with a new unique ID and identical components & properties
-   **fireEvent(name, data={})**: send an event to all components on the entity

### Component

Components hold entity data. A component must be defined and then registered with the Engine. This example defines a simple `Health` component:

```js
import { Component } from 'geotic';

class Health extends Component {
    // these props are defaulting to 10
    // anything defined here will be serialized
    static properties = {
        current: 10,
        maximum: 10,
    };

    // arbitrary helper methods and properties can be declared on
    // components. Note that these will NOT be serialized
    get isAlive() {
        return this.current > 0;
    }

    reduce(amount) {
        this.current = Math.max(this.current - amount, 0);
    }

    heal(amount) {
        this.current = Math.min(this.current + amount, this.maximum);
    }

    // This is automatically invoked when a `damage-taken` event is fired
    // on the entity: `entity.fireEvent('damage-taken', { damage: 12 })`
    // the `camelcase` library is used to map event names to methods
    onDamageTaken(evt) {
        // event `data` is an arbitray object passed as the second parameter
        // to entity.fireEvent(...)
        this.reduce(evt.data.damage);

        // handling the event will prevent it from continuing
        // to any other components on the entity
        evt.handle();
    }
}
```

Component properties and methods:

-   **static properties = {}** object that defines the properties of the component. Properties must be json serializable and de-serializable!
-   **static allowMultiple = false** are multiple of this component type allowed? If true, components will either be stored as an object or array on the entity, depending on `keyProperty`.
-   **static keyProperty = null** what property should be used as the key for accessing this component. if `allowMultiple` is false, this has no effect. If this property is omitted, it will be stored as an array on the component.
-   **entity** returns the Entity this component is attached to
-   **world** returns the World this component is in
-   **isDestroyed** returns `true` if this component is destroyed
-   **serialize()** serialize the component properties
-   **destroy()** remove this and destroy this component
-   **onAttached()** override this method to add behavior when this component is attached (added) to an entity
-   **onDestroyed()** override this method to add behavior when this component is removed & destroyed
-   **onEvent(evt)** override this method to capture all events coming to this component
-   **on\[EventName\](evt)** add these methods to capture the specific event

This example shows how `allowMultiple` and `keyProperty` work:

```js
class Impulse extends Component {
    static properties = {
        x: 0,
        y: 0,
    };
    static allowMultiple = true;
}

ecs.registerComponent(Impulse);

...

// add multiple `Impulse` components to the player
player.add(Impulse, { x: 3, y: 2 });
player.add(Impulse, { x: 1, y: 0 });
player.add(Impulse, { x: 5, y: 6 });

...

// returns the array of Impulse components
player.impulse;
// returns the Impulse at position `2`
player.impulse[2];
// returns `true` if the component has an `Impulse` component
player.has(Impulse);

// the `player.impulse` property is an array
player.impulse.forEach((impulse) => {
    console.log(impulse.x, impulse.y);
});

// remove and destroy the first impulse
player.impulse[0].destroy();

...

class EquipmentSlot extends Component {
    static properties = {
        name: 'hand',
        itemId: 0,
    };
    static allowMultiple = true;
    static keyProperty = 'name';

    get item() {
        return this.world.getEntity(this.itemId);
    }

    set item(entity) {
        return this.itemId = entity.id;
    }
}

ecs.registerComponent(EquipmentSlot);

...

const player = ecs.createEntity();
const helmet = ecs.createEntity();
const sword = ecs.createEntity();

// add multiple equipment slot components to the player
player.add(EquipmentSlot, { name: 'rightHand' });
player.add(EquipmentSlot, { name: 'leftHand', itemId: sword.id });
player.add(EquipmentSlot, { name: 'head', itemId: helmet.id });

...

// since the `EquipmentSlot` had a `keyProperty=name`, the `name`
// is used to access them
player.equipmentSlot.head;
player.equipmentSlot.rightHand;

// this will `destroy` the `sword` entity and automatically
// set the `rightHand.item` property to `null`
player.equipmentSlot.rightHand.item.destroy();

// remove and destroy the `rightHand` equipment slot
player.equipmentSlot.rightHand.destroy();

```

### Query

Queries keep track of sets of entities defined by component types. They are limited to the world they're created in.

```js
const query = world.createQuery({
    any: [A, B], // exclude any entity that does not have at least one of A OR B.
    all: [C, D], // exclude entities that don't have both C AND D
    none: [E, F], // exclude entities that have E OR F
});

query.get().forEach((entity) => ...); // loop over the latest set (array) of entites that match

// alternatively, listen for when an individual entity is created/updated that matches
query.onEntityAdded((entity) => {
    console.log('an entity was updated or created that matches the query!', entity);
});

query.onEntityRemoved((entity) => {
    console.log('an entity was updated or destroyed that previously matched the query!', entity);
});
```

-   **query.get()** get the result array of the query. **This array should not be modified in place**. For performance reasons, the result array that is exposed is the working internal query array.
-   **onEntityAdded(fn)** add a callback for when an entity is created or updated to match the query
-   **onEntityRemoved(fn)** add a callback for when an entity is removed or updated to no longer match the query
-   **has(entity)** returns `true` if the given `entity` is being tracked by the query. Mostly used internally
-   **refresh()** re-check all entities to see if they match. Very expensive, and only used internally

#### Performance enhancement

Set the `immutableResults` option to `false` if you are not modifying the result set. This option defaults to `true`. **WARNING**: When this option is set to `false`, strange behaviour can occur if you modify the results. See issue #55.

```js
const query = world.createQuery({
    all: [A, B],
    immutableResult: false, // defaults to TRUE
});

const results = query.get();

results.splice(0, 1); // DANGER! do not modify results if immutableResult is false!
```

### serialization

**example** Save game state by serializing all entities and components

```js
const saveGame = () => {
    const data = world.serialize();
    localStorage.setItem('savegame', data);
};

...

const loadGame = () => {
    const data = localStorage.getItem('savegame');
    world.deserialize(data);
};
```

### Event

Events are used to send a message to all components on an entity. Components can attach data to the event and prevent it from continuing to other entities.

The geotic event system is modelled aver this talk by [Brian Bucklew - AI in Qud and Sproggiwood](https://www.youtube.com/watch?v=4uxN5GqXcaA).

```js
// a `Health` component which listens for a `take damage` event
class Health extends Component {
    ...
    // event names are mapped to methods using the `camelcase` library.
    onTakeDamage(evt) {
        console.log(evt);
        this.value -= evt.data.amount;

        // the event gets passed to all components the `entity` unless a component
        // invokes `evt.prevent()` or `evt.handle()`
        evt.handle();
    }

    // watch ALL events coming to component
    onEvent(evt) {
        console.log(evt.name);
        console.log(evt.is('take-damage'));
    }
}

...

entity.add(Health);

const evt = entity.fireEvent('take-damage', { amount: 12 });

console.log(evt.name); // return the name of the event. "take-damage"
console.log(evt.data); // return the arbitrary data object attached. { amount: 12 }
console.log(evt.handled); // was `handle()` called?
console.log(evt.prevented);  // was `prevent()` or `handle()` called?
console.log(evt.handle()); // handle and prevent the event from continuing
console.log(evt.prevent()); // prevent the event from continuing without marking `handled`
console.log(evt.is('take-damage')); // simple name check

```

### Prefab

Prefabs are a pre-defined template of components.

The prefab system is modelled after this talk by [Thomas Biskup - There be dragons: Entity Component Systems for Roguelikes](https://www.youtube.com/watch?v=fGLJC5UY2o4&t=1534s).

```js
// prefabs must be registered before they can be instantiated
engine.registerPrefab({
    name: 'Being',
    components: [
        {
            type: 'Position',
            properties: {
                x: 4,
                y: 10,
            },
        },
        {
            type: 'Material',
            properties: {
                name: 'flesh',
            },
        },
    ],
});

ecs.registerPrefab({
    // name used when creating the prefab
    name: 'HumanWarrior',
    // an array of other prefabs of which this one derives. Note they must be registered in order.
    inherit: ['Being', 'Warrior'],
    // an array of components to attach
    components: [
        {
            // this should be a component constructor name
            type: 'EquipmentSlot',
            // what properties should be assigned to the component
            properties: {
                name: 'head',
            },
        },
        {
            // components that allow multiple can easily be added in
            type: 'EquipmentSlot',
            properties: {
                name: 'legs',
            },
        },
        {
            type: 'Material',
            // if a parent prefab already defines a `Material` component, this flag
            // will say how to treat it. Defaults to overwrite=true
            overwrite: true,
            properties: {
                name: 'silver',
            },
        },
    ],
});

...

const warrior1 = world.createPrefab('HumanWarrior');

// property overrides can be provided as the second argument
const warrior2 = world.createPrefab('HumanWarrior', {
    equipmentSlot: {
        head: {
            itemId: world.createPrefab('Helmet').id
        },
    },
    position: {
        x: 12,
        y: 24,
    },
});
```
