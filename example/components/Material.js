import { Component } from '../../build';

export default class Material extends Component {
    constructor(name) {
        super();
        this.name = name;
    }

    onAttached() {
        console.log(`${this.name} onAttached`, this.entity);
    }

    onDetached() {
        console.log(`${this.name} onDetached`, this.entity);
    }
}
