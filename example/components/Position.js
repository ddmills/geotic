import { Component } from '../../build';
import CoordinateProperty from '../properties/CoordinateProperty';

export default class Position extends Component {
    static properties = {
        local: '<Coordinate>',
        global: '<Coordinate>'
    };
}
