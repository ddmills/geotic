import merge from 'deepmerge';

export default class Query {
    #ecs;
    #filter;
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

    candidate(entity) {
        if (this.isMatch(entity)) {
            this.#cache.add(entity);
            return true;
        }

        this.#cache.delete(entity);
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
        this.#cache.delete(entity);
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
