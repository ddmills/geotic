import { Component } from '../../src/index';

export default class Material extends Component {
    static properties = {
        name: 'air',
    };

    onAttached() {
        console.log(`${this.name} onAttached`, this.entity.id);
    }

    onDetached() {
        console.log(`${this.name} onDetached`, this.entity.id);
    }
}
