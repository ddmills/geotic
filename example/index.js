import Material from './components/Material';
import Position from './components/Position';
import EquipmentSlot from './components/EquipmentSlot';
import { ECSManager } from '../build';

const ecs = new ECSManager();

ecs.registry.register(EquipmentSlot);
ecs.registry.register(Material);
ecs.registry.register(Position);

const player = ecs.createEntity();
const sword = ecs.createEntity();

const bronze = ecs.createComponent(Material, { name: 'bronze' })
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
console.log(player.EquipmentSlot.rightHand.content.Material);

console.log(player.EquipmentSlot.rightHand.content.has(Material));
player.EquipmentSlot.rightHand.content.Material.remove();
console.log(player.EquipmentSlot.rightHand.content.has(Material));
console.log(player.EquipmentSlot.rightHand.serialize());

// e.add('position', { x: 1, y: 4 });
// e.add(new Position({ x: 1, y: 4 }));
// e.add(Position, { x: 1, y: 4 });

// e.add('target', { entity: '44' });
// e.add('EquipmentSlot', {
//     slotType: ['head'],
//     entity: '12356'
// });
