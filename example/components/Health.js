import { Component } from '../../build';

export default class Health extends Component {
    static properties = {
        max: 10,
        current: 10,
    };

    onTest(evt) {
        console.log('CUSTOM HANDLER');
        evt.handle();
    }
}
