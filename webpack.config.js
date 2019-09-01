// webpack configuration

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const { spawn } = require('child_process');

module.exports = {
    mode: 'development',
    entry: {
        polyfill: '@babel/polyfill',
        controlbar: './src/indexCB.jsx',
        textwindow: './src/indexTW.jsx',
        home: './src/indexHome.jsx',
        timeline: './src/indexTL.jsx',
        dragsnip: './src/renderer/dragsnip/capture-renderer.js'
    },
    target: 'electron-renderer',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve('./build')
    },
    resolve: {
        extensions: [".jsx", ".js"]
    },
    module: {
        rules: [
            // Loader: compile jsx
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
            // Loader: compile ES6
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
            // Loader: compile html
            {
                test: /\.html$/,
                use: "html-loader"
            },
            // Loader: compile css
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // Loader: compile image
            {
                test: /\.(jpe?g|png)$/,
                use: 'file-loader?name=asset/[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new HtmlWebpackPlugin({
            filename: 'controlbar.html',
            template: './src/indexCB.html',
            chunks: ['controlbar']
        }),
        new HtmlWebpackPlugin({
            filename: 'textwindow.html',
            template: './src/indexTW.html',
            chunks: ['textwindow']
        }),
        new HtmlWebpackPlugin({
            filename: 'home.html',
            template: './src/indexHome.html',
            chunks: ['home']
        }), 
        new HtmlWebpackPlugin({
            filename: 'timeline.html',
            template: './src/indexTL.html',
            chunks: ['timeline']
        }),
        new HtmlWebpackPlugin({
            filename: 'dragsnip.html',
            template: './src/dragsnip.html',
            chunks: ['dragsnip']
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        port: 3071,
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