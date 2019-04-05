const path = require('path')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: slsw.lib.entries,
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    mode: 'production',
    output: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
    externals: [nodeExternals()],
}