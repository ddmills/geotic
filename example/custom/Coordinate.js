export class Coordinate {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    summation() {
        return this.x + this.y;
    }
}
