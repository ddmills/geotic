import camelcaseSlow from 'camelcase';

const camelCache = new Map();

export const camelString = (value) => {
    if (!camelCache.has(value)) {
        camelCache.set(value, camelcaseSlow(value));
    }

    return camelCache.get(value);
};

const pascalCache = new Map();

export const pascalString = (value) => {
    if (!pascalCache.has(value)) {
        pascalCache.set(value, camelcaseSlow(value, { pascalCase: true }));
    }

    return pascalCache.get(value);
};
