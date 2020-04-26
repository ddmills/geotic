import Material from './components/Material';
import Position from './components/Position';
import Listener from './components/Listener';
import Health from './components/Health';
import BeingPrefab from './prefabs/BeingPrefab';
import HumanPrefab from './prefabs/HumanPrefab';
import EquipmentSlot from './components/EquipmentSlot';
import { ECSManager } from '../build';

const ecs = new ECSManager();
const ecs2 = new ECSManager();

ecs.registerComponent(EquipmentSlot);
ecs.registerComponent(Material);
ecs.registerComponent(Position);
ecs.registerComponent(Listener);
ecs.registerComponent(Health);

ecs2.registerComponent(EquipmentSlot);
ecs2.registerComponent(Material);
ecs2.registerComponent(Position);
ecs2.registerComponent(Listener);
ecs2.registerComponent(Health);

ecs.registerPrefab(BeingPrefab);
ecs.registerPrefab(HumanPrefab);

const player = ecs.createEntity();
const sword = ecs.createEntity();

const bronze = ecs.createComponent(Material, { name: 'bronze' });
sword.add(bronze);

const leftHand = ecs.createComponent('EquipmentSlot', {
    name: 'leftHand',
    allowedTypes: ['hand'],
});

const rightHand = ecs.createComponent(EquipmentSlot, {
    name: 'rightHand',
    allowedTypes: ['hand'],
});

player.add(ecs.createComponent(Position, { x: 4, y: 12 }));
player.add(leftHand);
player.add(rightHand);

console.log(player.get('EquipmentSlot', 'leftHand').allowedTypes);
console.log(player.EquipmentSlot.rightHand.allowedTypes);
player.EquipmentSlot.rightHand.content = sword;

const data = ecs.serialize();
const human = ecs.createPrefab('HumanPrefab');

ecs2.deserialize(data);

const query = ecs.createQuery((entity) => entity.has('Position'));

console.log(Object.keys(query.get()).length);
human.remove('Position');
console.log(Object.keys(query.get()).length);
human.add(ecs.createComponent(Position, { x: 4, y: 12 }));
console.log(Object.keys(query.get()).length);

const thing = ecs.createEntity();
thing.add(ecs.createComponent('Position'));

console.log(thing.serialize());

const evt = human.fireEvent('test', { some: 'data' });

console.log(evt.data);
console.log(evt.handled);
