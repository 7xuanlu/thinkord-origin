const webpack = require('webpack');
const path = require('path');
const { spawn } = require('child_process');

module.exports = {
    mode: "development",
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    devServer: {
        host: '0.0.0.0',
        contentBase: path.resolve(__dirname, 'build'),
        port: 3071,
        before: () => {
            spawn(
                'electron',
                ['.'],
                { shell: true, env: process.env, stdio: 'inherit' }
            )
                .on('close', code => process.exit(0))
                .on('error', spawnError => console.error(spawnError))
        }
    }
};