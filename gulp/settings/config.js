// === CONFIG
// ============================================================================


let env = {
    dev: {
        name: 'dev',
        local: true,
        assetsUrl: '../dist',
        sassStyle: 'expanded',
        sourceComments: 'normal',
        sourceMap: true
    },

    prod: {
        name: 'prod',
        local: false,
        assetsUrl: '../dist',
        sassStyle: 'compressed',
        sourceComments: 'none',
        sourceMap: false
    },

    test: {
        name: 'test',
        local: false,
        assetsUrl: '../dist',
        sassStyle: 'compressed',
        sourceComments: 'none',
        sourceMap: false
    },
}
module.exports = env;