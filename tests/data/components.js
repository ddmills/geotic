import Component from '../../src/Component';

export class EmptyComponent extends Component {}

export class SimpleComponent extends Component {
    static properties = {
        testProp: 'thing',
    };
}

export class NestedComponent extends Component {
    static properties = {
        name: 'test',
        hello: 'world',
    };
    static allowMultiple = true;
    static keyProperty = 'name';
}

export class ArrayComponent extends Component {
    static properties = {
        name: 'a',
        hello: 'world',
    };
    static allowMultiple = true;
}

export class EntityRefComponent extends Component {
    static properties = {
        otherEntity: '<Entity>',
    };
}

export class EntityRefArrayComponent extends Component {
    static properties = {
        otherEntities: '<EntityArray>',
    };
}
