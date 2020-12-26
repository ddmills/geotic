import camelcaseSlow from 'camelcase';

const camelCache = {};

export const camelString = (value) => {
    if (!camelCache.hasOwnProperty(value)) {
        camelCache[value] = camelcaseSlow(value);
    }

    return camelCache[value];
};

const pascalCache = new Map();

export const pascalString = (value) => {
    if (!pascalCache.has(value)) {
        pascalCache.set(value, camelcaseSlow(value, { pascalCase: true }));
    }

    return pascalCache.get(value);
};
