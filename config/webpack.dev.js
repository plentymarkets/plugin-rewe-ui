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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjMzMjAyMmRkY2U0MTg5M2UyOWUzMjZkNzA1YTFlYWIxYzhjNGMyZmFjODBmOGFmZjE0ZGM1YmRkYWFhNzdkZjEzNDhjOTVjODI5OTZjZTI4In0.eyJhdWQiOiIxIiwianRpIjoiMzMyMDIyZGRjZTQxODkzZTI5ZTMyNmQ3MDVhMWVhYjFjOGM0YzJmYWM4MGY4YWZmMTRkYzViZGRhYWE3N2RmMTM0OGM5NWM4Mjk5NmNlMjgiLCJpYXQiOjE1NDgxMzUwOTQsIm5iZiI6MTU0ODEzNTA5NCwiZXhwIjoxNTQ4MjIxNDk0LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.DOi5lA4-rNqpOSrbkcoUUtvjeuPjq8HkoB7muTZ0OzCvbYtEwt-UTE_xCQAyJTTGNyUILs6nmoE39CquWAFrlZdx_w44V8BDMs6oYRYInJWHE-1u2bQgHxsbYvFBlR8Ln9_Cap9aSn0mpuczxbjbWTM8yIw3XtMLWlUqtcU4GewpUMqNeuE4IIUTulbYwh-omeNxoyoTsEGM051vK55bVR_3fppAIM2AF7NcFIuwFIAvwDdnuUmkHQCUfwcA3I9i-wJGO7DHnRhYKlcd_pu6fxruiio3KtOWunQj0aO4mjWW0YZeXwU6pis4PvYcygVBO8x8Iw4k7YfWbqqO1fXXynZ5Le4YdyZ3JuEYMCKhMsIzZVr8e3cnsRaXR9az2Dt3FrHDp6ZMF07zCuu2yIEoEJk6ICNX7zAITHz8_8A4ESusuGyGepnum2ESFdFbwfmBSfXbHl9GQ-byfSfi16h-JTdYs6u1TWd9EdfL-QKRUHJDnlVE1vJq4FBG6Qi3ZsuFTzEh9zGCG8I3m0iCaqfIvk5M5wyh9u66S-sqSq5HENMqh3yAqDt-y8MjtQBsoqtQRFrlcYG-o2HkpcQzrfr6-N_lVuloSZrK7DfzUMnFS4d1UC2oX1MBQfi6Ut4a4LcwC-fCCfkBJdJDwnqFdcDehLoyl2C615jBwnz2ACgxYlY'),
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