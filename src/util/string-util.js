import camelcaseSlow from 'camelcase';

const camelCache = {};

export const camelString = (value) => {
    const result = camelCache[value];

    if (!result) {
        camelCache[value] = camelcaseSlow(value);

        return camelCache[value];
    }

    return result;
};

const pascalCache = {};

export const pascalString = (value) => {
    const result = pascalCache[value];

    if (!value) {
        pascalCache[value] = camelcaseSlow(value, { pascalCase: true });

        return pascalCache[value];
    }

    return result;
};
