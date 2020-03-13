const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        polyfill: '@babel/polyfill',
        controlbar: './app/indexCB.jsx',
        textwindow: './app/indexTW.jsx',
        home: './app/indexHome.jsx',
        collection: './app/indexCollection.jsx',
        dragsnip: './app/media-capturer/dragsnip/capture-renderer.js'
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
            template: './app/indexCB.html',
            chunks: ['controlbar']
        }),
        new HtmlWebpackPlugin({
            filename: 'textwindow.html',
            template: './app/indexTW.html',
            chunks: ['textwindow']
        }),
        new HtmlWebpackPlugin({
            filename: 'home.html',
            template: './app/indexHome.html',
            chunks: ['home']
        }), 
        new HtmlWebpackPlugin({
            filename: 'collection.html',
            template: './app/indexCollection.html',
            chunks: ['collection']
        }),
        new HtmlWebpackPlugin({
            filename: 'dragsnip.html',
            template: './app/dragsnip.html',
            chunks: ['dragsnip']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
    ]
}
