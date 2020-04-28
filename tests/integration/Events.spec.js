import Engine from '../../src/Engine';
import { EmptyComponent } from '../data/components';
import Component from '../../src/Component';

describe('Events', () => {
    let engine, onTestEventStub;

    class EventComponent extends Component {
        onTestEvent(evt) {
            onTestEventStub(evt);
        }
    }

    beforeEach(() => {
        engine = new Engine();
        onTestEventStub = jest.fn();
        engine.registerComponent(EventComponent);
        engine.registerComponent(EmptyComponent);
    });

    describe('events', () => {
        let entity, data;

        beforeEach(() => {
            entity = engine.createEntity();
            entity.add(EventComponent);
            data = chance.object();

            entity.fireEvent('test-event', data);
        });

        it('should call the onTestEvent on the component', () => {
            expect(onTestEventStub).toHaveBeenCalledTimes(1);

            const arg = onTestEventStub.mock.calls[0][0];

            expect(arg.name).toBe('test-event');
            expect(arg.data).toBe(data);
        });
    });
});
