import PropertyParser from './PropertyParser';
import ComponentRegistry from './ComponentRegistry';
import { nanoid } from 'nanoid'
import Entity from './Entity';

export default class ECSManager {
    constructor() {
        this.idGenerator = () => nanoid();

        this.registry = new ComponentRegistry(this);
        this.propertyParser = new PropertyParser(this);
    }

    generateId() {
        return this.idGenerator();
    }

    createEntity() {
        return new Entity(this);
    }
}
