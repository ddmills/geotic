import { entity, component } from '../source/geotic';
import geotic from '../source/geotic';

const attribute = (e, n) => n;
component('name', attribute);
component('health', attribute);
component('speed', attribute);

const addZombie = (name) => {
  const zombie = entity()
    .add('name', name)
    .add('speed', 1)
    .add('health', Math.random() * 100);

  zombie.tag('lastCreated', { id: zombie.id });
};

addZombie('bonnie');
addZombie('greg');
addZombie('danny');

const id = geotic.getTag('lastCreated').id;
geotic.findById(id).c.name; // 'danny'
