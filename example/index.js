import Material from './components/Material';
import Position from './components/Position';
import EquipmentSlot from './components/EquipmentSlot';
import { ECSManager } from '../build';

const ecs = new ECSManager();
const ecs2 = new ECSManager();

ecs.registry.register(EquipmentSlot);
ecs.registry.register(Material);
ecs.registry.register(Position);

ecs2.registry.register(EquipmentSlot);
ecs2.registry.register(Material);
ecs2.registry.register(Position);

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

console.log(JSON.stringify(ecs.serialize(), null, 2));

ecs2.deserialize(data);

console.log(JSON.stringify(ecs2.serialize(), null, 2));

// console.log(JSON.stringify(ecs2.deserialize(data), null, 2));

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
