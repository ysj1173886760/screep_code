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
            {type: 'G', amount: 500},
            {type: 'energy', amount: 200},
        ],
        amount: 100
    },

    purifier: {
        material: [
            {type: 'G', amount: 500},
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
    }
};

module.exports = {
    reactionTable
};