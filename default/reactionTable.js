var reactionTable = {
    // RESOURCE_HYDROXIDE
    OH: {
        res1: 'H',
        res2: 'O',
        cooldown: 20
    },

    // RESOURCE_ZYNTHIUM_KEANITE
    ZK: {
        res1: 'Z',
        res2: 'K',
        cooldown: 5
    },

    UL: {
        res1: 'U',
        res2: 'L',
        cooldown: 5
    },

    G: {
        res1: 'ZK',
        res2: 'UL',
        cooldown: 5
    },

    UH: {
        res1: 'U',
        res2: 'O',
        cooldown: 10
    },

    UO: {
        res1: 'U',
        res2: 'O',
        cooldown: 10
    },

    KH: {
        res1: 'K',
        res2: 'H',
        cooldown: 10
    },

    KO: {
        res1: 'K',
        res2: 'O',
        cooldown: 10
    },

    LH: {
        res1: 'L',
        res2: 'H',
        cooldown: 15
    },

    LO: {
        res1: 'L',
        res2: 'O',
        cooldown: 10
    },

    ZH: {
        res1: 'Z',
        res2: 'H',
        cooldown: 20
    },

    ZO: {
        res1: 'Z',
        res2: 'O',
        cooldown: 10
    },

    GH: {
        res1: 'G',
        res2: 'H',
        cooldown: 10
    },

    GO: {
        res1: 'G',
        res2: 'O',
        cooldown: 10
    },

    // factory
    utrium_bar: {
        material: [
            {type: 'U', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    lemergium_bar: {
        material: [
            {type: 'L', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    zynthium_bar: {
        material: [
            {type: 'Z', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    keanium_bar: {
        material: [
            {type: 'K', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    ghodium_melt: {
        material: [
            {type: 'G', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    oxidant: {
        material: [
            {type: 'O', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    reductant: {
        material: [
            {type: 'H', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    purifier: {
        material: [
            {type: 'X', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    battery: {
        material: [
            {type: 'energy', amount: 600},
        ],
        amount: 50
    },
    
    cell: {
        material: [
            {type: 'lemergium_bar', amount: 20},
            {type: 'biomass', amount: 100},
            {type: 'energy', amount: 40},
        ],
        amount: 20
    },

    energy: {
        material: [
            {type: 'battery', amount: 50},
        ],
        amount: 500
    },

    U: {
        material: [
            {type: 'utrium_bar', amount: 100},
            {type: 'energy', amount: 200},
        ],
        amount: 500
    },
    
    L: {
        material: [
            {type: 'lemergium_bar', amount: 100},
            {type: 'energy', amount: 200},
        ],
        amount: 500
    },

    Z: {
        material: [
            {type: 'zynthium_bar', amount: 100},
            {type: 'energy', amount: 200},
        ],
        amount: 500
    },

    K: {
        material: [
            {type: 'keanium_bar', amount: 100},
            {type: 'energy', amount: 200},
        ],
        amount: 500
    },

    G: {
        material: [
            {type: 'ghodium_bar', amount: 100},
            {type: 'energy', amount: 200},
        ],
        amount: 500
    },

    O: {
        material: [
            {type: 'oxidant', amount: 100},
            {type: 'energy', amount: 200},
        ],
        amount: 500
    },

    H: {
        material: [
            {type: 'reductant', amount: 100},
            {type: 'energy', amount: 200},
        ],
        amount: 500
    },

    X: {
        material: [
            {type: 'purifier', amount: 100},
            {type: 'energy', amount: 200},
        ],
        amount: 500
    },

    wire: {
        material: [
            {type: 'ultrium_bar', amount: 20},
            {type: 'silicon', amount: 100},
            {type: 'energy', amount: 40}
        ],
        amount: 20
    },

    cell: {
        material: [
            {type: 'lemergium_bar', amount: 20},
            {type: 'biomass', amount: 100},
            {type: 'energy', amount: 40}
        ],
        amount: 20
    },

    alloy: {
        material: [
            {type: 'zynthium_bar', amount: 20},
            {type: 'metal', amount: 100},
            {type: 'energy', amount: 40}
        ],
        amount: 20
    },

    condensate: {
        material: [
            {type: 'keanium_bar', amount: 20},
            {type: 'mist', amount: 100},
            {type: 'energy', amount: 40}
        ],
        amount: 20
    },

    composite: {
        material: [
            {type: 'ultrium_bar', amount: 20},
            {type: 'zynthium_bar', amount: 20},
            {type: 'energy', amount: 20}
        ],
        amount: 20
    },

    crystal: {
        material: [
            {type: 'lemergium_bar', amount: 6},
            {type: 'keanium_bar', amount: 6},
            {type: 'purifier', amount: 6},
            {type: 'energy', amount: 45},
        ],
        amount: 6
    },

    liquid: {
        material: [
            {type: 'oxidant', amount: 12},
            {type: 'reductant', amount: 12},
            {type: 'ghodium_melt', amount: 12},
            {type: 'energy', amount: 90}
        ],
        amount: 12
    },

    phlegm: {
        material: [
            {type: 'cell', amount: 20},
            {type: 'oxidant', amount: 36},
            {type: 'lemergium_bar', amount: 16},
            {type: 'energy', amount: 8},
        ],
        amount: 2
    },

    tissue: {
        material: [
            {type: 'phlegm', amount: 10},
            {type: 'cell', amount: 10},
            {type: 'reductant', amount: 110},
            {type: 'energy', amount: 16},
        ],
        amount: 2
    },

    muscle: {
        material: [
            {type: 'tissue', amount: 3},
            {type: 'phlegm', amount: 3},
            {type: 'zynthium_bar', amount: 50},
            {type: 'reductant', amount: 50},
            {type: 'energy', amount: 16}
        ],
        amount: 1
    },

    organoid: {
        material: [
            {type: 'muscle', amount: 1},
            {type: 'tissue', amount: 5},
            {type: 'purifier', amount: 208},
            {type: 'oxidant', amount: 256},
            {type: 'energy', amount: 32},
        ],
        amount: 1
    },

    organism: {
        material: [
            {type: 'organoid', amount: 1},
            {type: 'liquid', amount: 150},
            {type: 'tissue', amount: 6},
            {type: 'cell', amount: 310},
            {type: 'energy', amount: 64},
        ],
        amount: 1
    }

};

module.exports = {
    reactionTable
};