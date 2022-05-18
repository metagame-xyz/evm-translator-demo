// const nodeExternals = require('webpack-node-externals')

module.exports = {
    webpack: (config, { isServer }) => {
        // if (isServer) {
        //     config.externals = [nodeExternals()]
        // }
        config.externals.push('bufferutil')
        config.externals.push('utf-8-validate')
        return config
    },
}
