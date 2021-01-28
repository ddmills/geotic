import { Component } from '../src/Component';
import { Engine } from '../src/Engine';

const engine = new Engine();
const world = engine.createWorld();


class Action extends Component {
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

    onTesting(evt) {
        console.log('Action onTesting', evt.data);
    }
}

class Slot extends Component {
    static allowMultiple = true;
    static keyProperty = 'name';
    static properties = {
        name: 'hello',
    };

    onTesting(evt) {
        console.log('Slot onTesting', evt.data);
    }
}

class Position extends Component {
    static properties = {
        x: 0,
        y: 0,
    };

    onTesting(evt) {
        console.log('Position onTesting', evt.data);
    }
}

engine.registerComponent(Action);
engine.registerComponent(Slot);
engine.registerComponent(Position);

const e = world.createEntity();

e.add(Position, {
    x: 7,
    y: 3,
});

e.add(Action, {
    name: 'actionA',
    data: {
        hello: 'world'
    },
});

e.add(Action, {
    name: 'actionB',
    data: {
        hello: 'world'
    },
});

e.add(Slot, {
    name: 'hand',
});

e.add(Slot, {
    name: 'head',
});

// e.position.destroy();
// e.action[0].destroy();
// e.remove(e.action[0]);
// e.remove(e.action[0]);
// e.remove(e.slot.hand);
// e.remove(e.slot.head);

e.remove(e.position);
e.remove(e.slot.hand);
e.remove(e.action[0]);
e.remove(e.action[0]);

e.fireEvent('testing', {
    hello: 'world',
});


console.log(e._cbits);
console.log('Slot', Slot.prototype._cbit, e.has(Slot));
console.log('Position', Position.prototype._cbit, e.has(Position));
console.log('Action', Action.prototype._cbit, e.has(Action));
e.destroy();
console.log(JSON.stringify(e.serialize(), null, 2));
