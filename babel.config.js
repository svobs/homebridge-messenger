"use strict"

/**
 * @param {import("@babel/core").ConfigAPI} api
 * @return {import("@babel/core").TransformOptions}
 */
module.exports = (api) => {
    api.cache.forever()

    /** @type {import("@babel/preset-env").Options} */
    const presetEnvConfig = {
        modules: false,
        targets: "node >= 6",
    }

    // Presets are applied right-to-left (reverse order)
    /** @type {import("@babel/core").TransformOptions['presets']} */
    const presets = [
        ["@babel/preset-env", presetEnvConfig],
    ]

    return {
        presets,
    }
}
