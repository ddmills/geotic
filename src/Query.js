import merge from 'deepmerge';

export default class Query {
    _ecs;
    _filter;
    _onEntityAddedCallbacks = [];
    _onEntityRemovedCallbacks = [];
    _cache = new Set();

    constructor(ecs, filter = {}) {
        this._ecs = ecs;
        this._filter = merge({ any: [], all: [], none: [] }, filter);
        this.bustCache();
    }

    isMatch(entity) {
        const hasAny = this._filter.any.length
            ? this._filter.any.some((c) => entity.has(c))
            : true;
        const hasAll = this._filter.all.every((c) => entity.has(c));
        const hasNone = !this._filter.none.some((c) => entity.has(c));

        return hasAny && hasAll && hasNone;
    }

    onEntityAdded(fn) {
        this._onEntityAddedCallbacks.push(fn);
    }

    onEntityRemoved(fn) {
        this._onEntityRemovedCallbacks.push(fn);
    }

    has(entity) {
        return this._cache.has(entity);
    }

    candidate(entity) {
        const isTracking = this.has(entity);

        if (this.isMatch(entity)) {
            if (!isTracking) {
                this._cache.add(entity);
                this._onEntityAddedCallbacks.forEach((cb) => cb(entity));
            }

            return true;
        }

        if (isTracking) {
            this._cache.delete(entity);
            this._onEntityRemovedCallbacks.forEach((cb) => cb(entity));
        }

        return false;
    }

    _onEntityCreated(entity) {
        this.candidate(entity);
    }

    _onComponentAdded(entity) {
        this.candidate(entity);
    }

    _onComponentRemoved(entity) {
        this.candidate(entity);
    }

    _onEntityDestroyed(entity) {
        if (this.has(entity)) {
            this._cache.delete(entity);
            this._onEntityRemovedCallbacks.forEach((cb) => cb(entity));
        }
    }

    bustCache() {
        this._cache.clear();

        for (const entity of this._ecs.entities.all) {
            this.candidate(entity);
        }

        return this._cache;
    }

    get() {
        return this._cache;
    }
}
