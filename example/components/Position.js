import { Component } from '../../build';

export default class Position extends Component {
    static allowMultiple = false;

    constructor(properties) {
        super();
        this.x = properties.x;
        this.y = properties.y;
    }
}
