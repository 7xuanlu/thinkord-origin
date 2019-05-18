// webpack configuration

const webpack = require('webpack');
const path = require('path');
const { spawn } = require('child_process');

module.exports = {
    entry: ['./src/index.jsx'],
    target: 'electron-renderer',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./dist')
    },
    resolve: {
        extensions: [".jsx", ".js"]
    },
    module: {
        rules: [
            // first loader: compile jsx
            {
                test: /.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            // second loader: compile ES6
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                }
            },
            // third loader: compile css
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        before() {
          spawn(
            'electron',
            ['.'],
            { shell: true, env: process.env, stdio: 'inherit' }
          )
          .on('close', code => process.exit(0))
          .on('error', spawnError => console.error(spawnError))
        }
    }
}