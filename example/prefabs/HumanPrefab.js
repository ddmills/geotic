import EquipmentSlot from '../components/EquipmentSlot';

export default {
    name: 'HumanPrefab',
    inherit: 'BeingPrefab',
    components: [
        {
            type: 'EquipmentSlot',
            properties: {
                name: 'head',
                allowedTypes: ['helmet', 'hat'],
            },
        },
        {
            type: EquipmentSlot,
            properties: {
                name: 'legs',
                allowedTypes: ['pants'],
            },
        },
    ],
};
