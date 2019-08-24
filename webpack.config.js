/* eslint-disable no-console */

//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');

const CircularDependencyPlugin = require('circular-dependency-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDebug = process.env.NODE_ENV === 'debug';
const isDist = isDebug || isProd ? '.min' : '';
const distPath = path.join(__dirname, 'dist');
const showConfigOnly = '1' === process.env.SHOW_CONFIG_ONLY || 'true' === process.env.SHOW_CONFIG_ONLY;

const config = {
    entry: {
        app: './src/js/index.js'
    },
    output: {
        filename: `[name]${isDist}.js`,
        path: distPath,
        pathinfo: !isProd,
        libraryTarget: 'var'
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js'],
        modules: ['node_modules', 'src']
    },
    optimization: {
        //    minimizer: [new UglifyJsPlugin()],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(isProd ? 'production' : 'development')
            }
        }),

        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: false
        })
    ],

    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: 'babel-loader'
            },

            {
                test: /\.js$/,
                enforce: 'pre',
                use: [
                    'source-map-loader',
                    {
                        loader: 'eslint-loader',
                        options: {
                            emitWarning: true
                        }
                    }
                ]
            }
        ]
    },

    target: 'node'
};

// If ran with SHOW_CONFIG_ONLY=1|true, only show the config and exit cleanly
if (showConfigOnly) {
    console.log(chalk.black.bgYellow.bold('Showing Configuration Only:'));
    console.log(require('util').inspect(config, false, null));
    process.exit(0);
}

module.exports = config;
