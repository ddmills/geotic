import Material from './components/Material';
import Position from './components/Position';
import EquipmentSlot from './components/EquipmentSlot';
import { ECSManager } from '../build';

const ecs = new ECSManager();

ecs.registry.register(EquipmentSlot);
ecs.registry.register(Material);

const player = ecs.createEntity();
const sword = ecs.createEntity();

const bronze = new Material({ name: 'bronze' })
sword.add(bronze);
console.log('sword.has', sword.has('Material'));
sword.remove(bronze);
console.log('sword.has', sword.has('Material'));

const leftHand = new EquipmentSlot({
    name: 'leftHand',
    allowedTypes: ['hand'],
});
const rightHand = new EquipmentSlot({
    name: 'rightHand',
    allowedTypes: ['hand'],
});

player.add(leftHand);
player.add(rightHand);

console.log(player.get('EquipmentSlot', 'leftHand').allowedTypes);

// e.add('position', { x: 1, y: 4 });
// e.add(new Position({ x: 1, y: 4 }));
// e.add(Position, { x: 1, y: 4 });

// e.add('target', { entity: '44' });
// e.add('EquipmentSlot', {
//     slotType: ['head'],
//     entity: '12356'
// });

// e.get(
