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
        textwindow: './src/indexTXT.jsx',
        main: './src/indexMain.jsx',
        home: './src/indexH.jsx',
        dragsnip: './src/renderer/dragsnip/capture-renderer.js'
    },
    target: 'electron-renderer',
    output: {
        filename: '[name].bundle.js',
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
            // loader: compile html
            {
                test: /\.html$/,
                use: "html-loader"
            },
            // loader: compile css
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            // loader: compile image
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
            template: './src/indexTXT.html',
            chunks: ['textwindow']
        }),
        new HtmlWebpackPlugin({
            filename: 'main.html',
            template: './src/indexMain.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            filename: 'home.html',
            template: './src/indexH.html',
            chunks: ['home']
        }),
        new HtmlWebpackPlugin({
            filename: 'dragsnip.html',
            template: './src/dragsnip.html',
            chunks: ['dragsnip']
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
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