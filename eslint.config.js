const stylisticJs = require("@stylistic/eslint-plugin-js")

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
    {
        ignores: [
            "dist/**",
            "node_modules/**",
        ],
        plugins: {
            "@stylistic/js": stylisticJs,
        },
        rules: {
            "@stylistic/js/comma-dangle": ["warn", "always-multiline"],
            // The number attached to `SwitchCase` actually acts like an indentation multiplier.
            "@stylistic/js/indent": ["warn", 4, {SwitchCase: 1}],
            "@stylistic/js/quotes": ["warn", "double"],
            "@stylistic/js/semi": ["warn", "never"],
        },
    },
]

module.exports = config
