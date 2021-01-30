import { Component } from '../../src/index';

export default class EquipmentSlot extends Component {
    static allowMultiple = true;
    static keyProperty = 'name';
    static properties = {
        name: 'head',
        allowedTypes: ['hand'],
        content: '<Entity>',
    };

    onDetached() {
        console.log(
            `${this.properties.name} slot removed from ${this.properties.entity}`
        );
    }
}
