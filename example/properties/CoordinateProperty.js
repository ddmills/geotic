import { Property } from '../../build';
import { Coordinate } from '../custom/Coordinate';


export default class CoordinateProperty extends Property {
    #value;

    static tag = 'Coordinate';

    serialize() {
        return {
            x: this.#value.x,
            y: this.#value.y
        };
    }

    set(value) {
        if (value instanceof Coordinate) {
            this.#value = value;
        }

        this.#value = new Coordinate(value.x, value.y);
    }

    get() {
        return this.#value;
    }
}
