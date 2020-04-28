import Component from '../../src/Component';

export class EmptyComponent extends Component {};


export class SimpleComponent extends Component {
    static properties = {
        'testProp': 'thing'
    };
};
