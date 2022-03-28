module.exports = {
    webpack: (config, options) => {
        config.externals.push('bufferutil')
        config.externals.push('utf-8-validate')
        return config
    },
}
