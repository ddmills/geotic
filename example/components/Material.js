import { Component } from '../../build';

export default class Material extends Component {
    static properties = {
        name: 'air',
    };

    onAttached() {
        console.log(`${this.name} onAttached`, this.entity);
    }

    onDetached() {
        console.log(`${this.name} onDetached`, this.entity);
    }
}
