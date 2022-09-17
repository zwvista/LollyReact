const {
    override,
    addBabelPlugins
} = require("customize-cra");

// https://github.com/inversify/InversifyJS/issues/1408
function ignoreSourceMap(config) {
    config.ignoreWarnings = [/Failed to parse source map/];
    return config;
}

module.exports = override(
    addBabelPlugins(
        "babel-plugin-transform-typescript-metadata",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ),
    ignoreSourceMap
)