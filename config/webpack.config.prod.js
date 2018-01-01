const paths = require('./paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;

module.exports = {
    // Don't attempt to continue if there are any errors.
    bail: true,
    entry: {
        app: paths.appPop,
        inject: paths.appInject,
        background: paths.appBackground,
    },
    output: {
        filename: "[name].js",
        path: paths.appBuild,
        publicPath: publicPath,
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.ts/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
};