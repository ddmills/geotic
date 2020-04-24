import { Component } from '../../build';

export default class EquipmentSlot extends Component {
    static allowMultiple = true;
    static accessorProperty = 'name';
    static properties = {
        name: 'head',
        allowedTypes: ['hand'],
        content: '<Entity>'
    };

    onDetached() {
        console.log(`${this.properties.name} slot removed from ${this.properties.entity}`);
    }
}
