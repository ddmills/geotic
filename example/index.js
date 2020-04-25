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
console.log(JSON.stringify(player.serialize(), null, 2));

// console.log(player.EquipmentSlot.rightHand.content.Material);

// console.log(player.EquipmentSlot.rightHand.content.has(Material));
// player.EquipmentSlot.rightHand.content.Material.remove();
// console.log(player.EquipmentSlot.rightHand.content.has(Material));
player.EquipmentSlot.rightHand.name = 'test';

// const data = {
//     "id": "WtACi7RZ0SXT9DwbNo1AZ",
//     "Position": {
//       "x": 4,
//       "y": 12
//     },
//     "EquipmentSlot": {
//       "leftHand": {
//         "name": "leftHand",
//         "allowedTypes": [
//           "hand"
//         ],
//         "content": null
//       },
//       "rightHand": {
//         "name": "rightHand",
//         "allowedTypes": [
//           "hand"
//         ],
//         "content": "fRJkYHfRJey3cr2r3BRpG"
//       }
//     }
// };
