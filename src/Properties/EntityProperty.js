import Property from './Property';

export default class EntityProperty extends Property {
    id;

    set(value) {
        if (value && value.id) {
            this.id = value.id;
            return;
        }

        if (typeof value === 'string') {
            this.id = value;
            return;
        }

        this.id = null;
    }

    get() {
        return this.component.ecs.getEntity(this.id);
    }

    serialize() {
        return this.id;
    }
}
