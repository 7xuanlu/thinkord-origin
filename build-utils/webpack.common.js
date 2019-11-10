const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
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
        path: path.resolve(__dirname, '../build')
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
                test: /\.(jpe?g|png|svg)$/,
                use: 'file-loader?name=asset/[name].[ext]'
            }
        ]
    },
    plugins: [
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
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
    ]
}