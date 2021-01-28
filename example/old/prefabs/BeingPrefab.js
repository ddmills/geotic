export default {
    name: 'BeingPrefab',
    components: [
        {
            type: 'Position',
            properties: {
                x: 4,
                y: 10,
            },
        },
        {
            type: 'Material',
            properties: {
                name: 'flesh',
            },
        },
        'Listener',
        'Health',
    ],
};
