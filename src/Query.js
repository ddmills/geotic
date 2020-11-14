import merge from 'deepmerge';

export default class Query {
    #ecs;
    #filter;
    #onEntityAddedCallbacks = [];
    #onEntityRemovedCallbacks = [];
    #cache = new Set();

    constructor(ecs, filter = {}) {
        this.#ecs = ecs;
        this.#filter = merge({ any: [], all: [], none: [] }, filter);
        this.bustCache();
    }

    isMatch(entity) {
        const hasAny = this.#filter.any.length
            ? this.#filter.any.some((c) => entity.has(c))
            : true;
        const hasAll = this.#filter.all.every((c) => entity.has(c));
        const hasNone = !this.#filter.none.some((c) => entity.has(c));

        return hasAny && hasAll && hasNone;
    }

    onEntityAdded(fn) {
        this.#onEntityAddedCallbacks.push(fn);
    }

    onEntityRemoved(fn) {
        this.#onEntityRemovedCallbacks.push(fn);
    }

    has(entity) {
        return this.#cache.has(entity);
    }

    candidate(entity) {
        const isTracking = this.has(entity);

        if (this.isMatch(entity)) {
            if (!isTracking) {
                this.#cache.add(entity);
                this.#onEntityAddedCallbacks.forEach((cb) => cb(entity));
            }

            return true;
        }

        if (isTracking) {
            this.#cache.delete(entity);
            this.#onEntityRemovedCallbacks.forEach((cb) => cb(entity));
        }

        return false;
    }

    _onEntityCreated(entity) {
        this.candidate(entity);
    }

    _onComponentAdded(entity) {
        console.log('component added to entity', entity);
        this.candidate(entity);
    }

    _onComponentRemoved(entity) {
        this.candidate(entity);
    }

    _onEntityDestroyed(entity) {
        if (this.has(entity)) {
            this.#cache.delete(entity);
            this.#onEntityRemovedCallbacks.forEach((cb) => cb(entity));
        }
    }

    bustCache() {
        this.#cache.clear();

        for (const entity of this.#ecs.entities.all) {
            this.candidate(entity);
        }

        return this.#cache;
    }

    get() {
        return this.#cache;
    }
}
