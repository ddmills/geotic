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

ecs.registry.register(EquipmentSlot);
ecs.registry.register(Material);
ecs.registry.register(Position);
ecs.registry.register(Listener);
ecs.registry.register(Health);

ecs2.registry.register(EquipmentSlot);
ecs2.registry.register(Material);
ecs2.registry.register(Position);
ecs2.registry.register(Listener);
ecs2.registry.register(Health);

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
console.log(EquipmentSlot.properties);
const data = ecs.serialize();

const human = ecs.createPrefab('HumanPrefab');

console.log(human.serialize());

// console.log(JSON.stringify(ecs.serialize(), null, 2));

// ecs2.deserialize(data);

// console.log(JSON.stringify(ecs2.serialize(), null, 2));
