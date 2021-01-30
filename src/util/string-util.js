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
