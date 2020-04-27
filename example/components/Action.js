import { Component } from '../../build';

export default class Action extends Component {
    static properties = {
        name: '',
        data: {},
    };

    static allowMultiple = true;

    onAttached() {
        console.log(`action ${this.name} attached`);
    }

    onDetached() {
        console.log(`action ${this.name} detached`);
    }
}
