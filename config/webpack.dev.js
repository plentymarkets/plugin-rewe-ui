const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3002;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR
});

module.exports = function (options) {
    return webpackMerge(commonConfig({env: ENV}), {

        // devtool: 'source-map',
        devtool: 'cheap-module-source-map',

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js'
        },

        plugins: [

            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJmYmY0ZjNlZmIzMGE3M2Q3Y2IyNzgwODA3OGQ4ZjIxNDg0MGQ4NmYwMjkxNjkyNDE3MWE5OTJlZTNmOWE1NjI2YjgxZmViOWZkOGNkYjYyIn0.eyJhdWQiOiIxIiwianRpIjoiYmZiZjRmM2VmYjMwYTczZDdjYjI3ODA4MDc4ZDhmMjE0ODQwZDg2ZjAyOTE2OTI0MTcxYTk5MmVlM2Y5YTU2MjZiODFmZWI5ZmQ4Y2RiNjIiLCJpYXQiOjE1NjI3Mzc5MjMsIm5iZiI6MTU2MjczNzkyMywiZXhwIjoxNTYyODI0MzIzLCJzdWIiOiIyIiwic2NvcGVzIjpbIioiXX0.Opu3YAAaembu7CfE26T1LWTD5-P9lHy0Bhm7T9S1oGXTxO8fXa7aWs7vsKxHE5c66N5bBAse2qCR2Zwj8gfM_yRfDfugCFyC299EQETJRpQ718PS30sSE-f_8PP_WoX5lteQYtNKp-G5h1fdvbutF82m3W9DzO7qRiU8HP9X86ymSzjl_DuZWcgu2AROCjIJWjaDfs5wH861l2c1gPhhE8NroC1_zwYBBFnW_v9rslb7x6QpfPemso_DuXY8ik7is5H-0mpiFT82iGZ1eeRWXDATV5rSmHynnqjzcEGHjNSFZFVVfmVvqKlVAm5aCP8Ly8Gj7Kjf5kV3oUhXAbH_tEEcOzK59E3hp5fZEwBxE2b7bBVRQPFGD6A721fZ5SnTQJh7ppaJVbZxwn79cq8x9VvtBmTfBzlrjZj4NJXrY4lsfQceexdsXstjyRV2vICWrGmhlhCLSArJqdrMTDM5GSF6RRtqMwY1mOhh0LLmRXjf9OALOIFadXksIUBBT8xF4VjnkchmSqRfJm1iA2Wqm2iAUZ7mYKxikuC16iVYQCMB4_MqlDkBypsF3AHEybXi-g_HjoLaIKXm_EeYnFv9peFsCqgbNh543Ajcq9pMeZYtnVCE4mZRvjn8LHt954r1N92m4a-sHwNzUdaV3eB_nYbY_QPgTBQZtz0WurKDADo'),
                    'BASE_URL': JSON.stringify('http://master.login.plentymarkets.com')
                }
            })
        ],

        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            }
        }

    });
};