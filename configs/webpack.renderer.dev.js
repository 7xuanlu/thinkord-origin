const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.renderer.js');

const path = require('path');
const { spawn } = require('child_process');

module.exports = merge.smart(baseConfig, {
    mode: "development",
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        port: 3071,
        before() {
            spawn(
                'electron',
                ['app/main-dev.js'],
                { shell: true, env: process.env, stdio: 'inherit' }
            )
                .on('close', code => process.exit(0))
                .on('error', spawnError => console.error(spawnError))
        }
    }
});
