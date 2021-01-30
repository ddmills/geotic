export const EmptyPrefab = {
    name: 'EmptyPrefab',
};

export const SimplePrefab = {
    name: 'SimplePrefab',
    components: [
        {
            type: 'EmptyComponent',
        },
        {
            type: 'SimpleComponent',
            properties: {
                testProp: 'testPropValue',
            },
        },
    ],
};

export const PrefabWithKeyedAndArray = {
    name: 'PrefabWithKeyedAndArray',
    components: [
        {
            type: 'NestedComponent',
            properties: {
                name: 'one',
            },
        },
        {
            type: 'NestedComponent',
            properties: {
                name: 'two',
            },
        },
        {
            type: 'ArrayComponent',
            properties: {
                name: 'a',
            },
        },
        {
            type: 'ArrayComponent',
            properties: {
                name: 'b',
            },
        },
    ],
};
