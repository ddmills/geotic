import { Component } from '../../src/index';

export class EmptyComponent extends Component {}

export class SimpleComponent extends Component {
    static properties = {
        testProp: 'thing',
    };
}

export class NestedComponent extends Component {
    static allowMultiple = true;
    static keyProperty = 'name';
    static properties = {
        name: 'test',
        hello: 'world',
    };
}

export class ArrayComponent extends Component {
    static allowMultiple = true;
    static properties = {
        name: 'a',
        hello: 'world',
    };
}
