const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.js');
const path = require('path');

module.exports = merge.smart(baseConfig, {
    entry: {
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
    ]
});
