export default class Query {
    #ecs;
    #filter;
    #cache = {};

    constructor(ecs, filter) {
        this.#ecs = ecs;
        this.#filter = filter;
        this.bustCache();
    }

    candidate(entity) {
        if (this.#filter(entity)) {
            this.#cache[entity.id] = entity;
        } else {
            delete this.#cache[entity.id];
        }
    }

    bustCache() {
        this.#ecs.entities.all.forEach((e) => this.candidate(e));

        return this.#cache;
    }

    get() {
        return this.#cache;
    }
}
