const {
    override,
    addBabelPlugins
} = require("customize-cra");

// https://github.com/inversify/InversifyJS/issues/1408
function ignoreSourceMap(config) {
    config.ignoreWarnings = [/Failed to parse source map/];
    return config;
}

// https://stackoverflow.com/questions/57261540/warning-received-true-for-a-non-boolean-attribute-jsx-zeit-styled-jsx/66285652#66285652
module.exports = override(
    addBabelPlugins(
        "babel-plugin-transform-typescript-metadata",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        'styled-jsx/babel',
    ),
    ignoreSourceMap
)
