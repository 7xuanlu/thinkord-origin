const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = ({ env }) => {
    const envConfig = require(`./webpack.${env}.js`)

    return webpackMerge(commonConfig, envConfig);
};