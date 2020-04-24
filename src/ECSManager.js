import PropertyParser from './PropertyParser';
import ComponentRegistry from './ComponentRegistry';
import Entity from './Entity';

export default class ECSManager {
    constructor() {
        this.registry = new ComponentRegistry(this);
        this.propertyParser = new PropertyParser(this);
    }

    createEntity() {
        return new Entity(this);
    }
}
