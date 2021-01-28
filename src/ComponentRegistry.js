import { camelString } from './util/string-util';

export class ComponentRegistry {
    _cbit = 0;
    _map = {};

    register(clazz) {
        const key = camelString(clazz.name);

        clazz.prototype._ckey = key;
        clazz.prototype._cbit = BigInt(++this._cbit);

        this._map[key] = clazz;
    }

    get(key) {
        return this._map[key];
    }
}
