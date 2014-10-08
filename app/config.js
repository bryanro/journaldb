module.exports = {
    development: {
        verbosityLevel: 'debug',
        sessionExpiration: 86400000 * 120    // 120 days
    },
    beta: {
        verbosityLevel: 'debug',
        sessionExpiration: 86400000 * 120    // 120 days
    },
    production: {
        verbosityLevel: 'warn',
        sessionExpiration: 86400000 * 120    // 120 days
    }
}