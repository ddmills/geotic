import { entity, component } from '../source/geotic';
import geotic from '../source/geotic';

const attribute = (e, n) => n || 1;
component('name', attribute);
component('health', attribute);
component('speed', attribute);

const addZombie = (name) => {
  return entity()
    .add('name', name)
    .add('speed', 1)
    .add('health', Math.random() * 100)
    .tag('enemy');
};

addZombie('bonnie');
addZombie('greg');
addZombie('danny');

const enemies = geotic.findByTag('enemy');

geotic.findByTag('enemy').forEach(enemy => {
  enemy.health -= 10;
  console.log(`${enemy.name} ${enemy.health}`);
});
