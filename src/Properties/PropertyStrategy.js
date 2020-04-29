import Property from './Property';
import SimpleProperty from './SimpleProperty';
import EntityProperty from './EntityProperty';
import EntityArrayProperty from './EntityArrayProperty';

export default class PropertyStrategy {
    static get(value) {
        switch (value) {
            case '<Entity>':
                return EntityProperty;
            case '<EntityArray>':
                return EntityArrayProperty;
            default:
                return SimpleProperty;
        }
    }
}
