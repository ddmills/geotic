import Property from './Property';
import SimpleProperty from './SimpleProperty';
import EntityProperty from './EntityProperty';
import EntityArrayProperty from './EntityArrayProperty';

export default class PropertyStrategy {
    static create(component, value) {
        switch (value) {
            case '<Entity>':
                return new EntityProperty(component);
            case '<EntityArray>':
                return new EntityArrayProperty(component);
            default:
                return new SimpleProperty(component);
        }
    }
}
