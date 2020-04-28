import Chance from 'chance';

const chance = new Chance();

chance.mixin({
    object: () => ({
        [chance.word()]: chance.string()
    })
});

global.chance = chance;
