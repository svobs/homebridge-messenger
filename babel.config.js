"use strict"

/**
 * @param {import("@babel/core").ConfigAPI} api
 * @return {import("@babel/core").TransformOptions}
 */
module.exports = (api) => {
    // See https://babeljs.io/docs/config-files#apicache
    // Permanently caches this config, so that this config function
    // is not executed every time a file is transpiled.
    api.cache.forever()

    /** @type {import("@babel/preset-env").Options} */
    const presetEnvConfig = {
        // Use ES modules vs CommonJS for imports/exports
        modules: false,
        // See https://babeljs.io/docs/options#targets
        // for how to specify transpilation targets
        targets: "node >= 6",
    }

    // Presets are applied right-to-left (reverse order)
    // Source: https://github.com/babel/babel/blob/main/babel.config.js#L177-L181
    /** @type {import("@babel/core").TransformOptions['presets']} */
    const presets = [
        ["minify"],
        ["@babel/preset-env", presetEnvConfig],
    ]

    return {
        presets,
    }
}
