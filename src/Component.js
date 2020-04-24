export default class Component {
    _entity = null;
    static allowMultiple = false;

    get entity() {
        return this._entity;
    }

    get type() {
        return this.constructor.name;
    }

    get isAttached() {
        return Boolean(this.entity);
    }

    get allowMultiple() {
        return this.constructor.allowMultiple;
    }

    _onAttached(entity) {
        this._entity = entity;
        this.onAttached();
    }

    _onDetached() {
        if (this.isAttached) {
            this.onDetached();
            this._entity = null;
        }
    }

    onAttached() {
    }

    onDetached() {
    }

    remove() {
        if (this.isAttached) {
            this.entity.remove(this);
        }
    }
}
