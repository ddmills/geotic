export default class ComponentRegistry {
    #map = {};

    register(component) {
        this.#map[component.name] = component;
    }

    get(name) {
        return this.#map[name];
    }
}
