import { Engine, Component } from '../../src/index';
import { EmptyComponent } from '../data/components';

describe('Events', () => {
    let world, onTestEventStub;

    class EventComponent extends Component {
        onTestEvent(evt) {
            onTestEventStub(evt);
        }
    }

    beforeEach(() => {
        const engine = new Engine();

        world = engine.createWorld();

        onTestEventStub = jest.fn();
        engine.registerComponent(EventComponent);
        engine.registerComponent(EmptyComponent);
    });

    describe('events', () => {
        let entity, data;

        beforeEach(() => {
            entity = world.createEntity();
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
