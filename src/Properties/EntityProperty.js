import Property from './Property';

export default class EntityProperty extends Property {
    id;

    set(value) {
        if (this.id && (!value || value.id !== this.id || value !== this.id)) {
            this.ecs.entities.removeRef(this.id, this);
        }

        if (value && value.id) {
            this.ecs.entities.addRef(value.id, this);
            this.id = value.id;
            return;
        }

        if (typeof value === 'string') {
            this.ecs.entities.addRef(value, this);
            this.id = value;
            return;
        }

        this.id = undefined;
    }

    get() {
        return this.id && this.component.ecs.getEntity(this.id);
    }

    serialize() {
        return this.id;
    }

    onDestroyed() {
        if (this.id) {
            this.ecs.entities.removeRef(this.id, this);
        }
    }

    cleanupReference(entity) {
        if (this.id === entity.id) {
            this.id = undefined;
        } else {
            console.warn(
                `Property in unclean state. A reference to an entity "${entity.id}" was never cleaned up.`
            );
        }
    }
}
