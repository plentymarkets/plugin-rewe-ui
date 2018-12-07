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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNlYmRhMzM3YjUyNjAzM2E1NmExMzY0Y2IzNjYzNmY3NDVlZTkzMDBlMDZmNzc0MjFmNmE3YjU0Y2U3YzhkNDRmNWJhNWVjZDhhNWIxNGE4In0.eyJhdWQiOiIxIiwianRpIjoiY2ViZGEzMzdiNTI2MDMzYTU2YTEzNjRjYjM2NjM2Zjc0NWVlOTMwMGUwNmY3NzQyMWY2YTdiNTRjZTdjOGQ0NGY1YmE1ZWNkOGE1YjE0YTgiLCJpYXQiOjE1NDQxNzc0MTAsIm5iZiI6MTU0NDE3NzQxMCwiZXhwIjoxNTQ0MjYzODEwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.nHzmGdHUbC2jYXNgzQYwUf7pRmzGc4GZf2CUUiKs5k3-nxDP7FCc80VAa5Dhfkil9MecB703Bpwn89UgpbGNQAOIqNvxH9V0PhEXnJp9uEauUfoBUteJkqnp4YoCtwXEDXbo_aOYoGHSXywFP5EZl0-3kkjDjxqeEfHMd4AkUL1JIUpFiIJjVv6ptDq2q-06CC-KZ3JocFmSMaK6I2CJfzSpxy5u_NBGDHCFzqOhqtPo8aLJ1Dkn3JWDincvv4h1nLmGhguafPCGKYj8EH5JKXyp2nGbaK33bS8m7KynkgMUeIu52SF4V345CMbqsVUyiTDXm4Me_nmrAIr-MNyq7BwPoAbRTPx7__g3CAvpeIYWOmQzG5hpTx6ORwc8OtiIu8Irm3Drwc5-H7nzzd_OsGf5MDcJKdCw5pV95OZ3jGNc9xevH8t8FMJ7NOHveeQfb9rYJscWmYb5xyuIXU-rerivQad_RG7xt9GiF2ruOWXEoaRCbdeq5NRdRsufhllx3Phe1SqLAV20rvgnUjzur1-OAOTQNyzyGBs1pOBW_CzMNgmfIV0cWek3B68UWD8UeYxirRFdJZEltGfNz_-TUb0HhGE7LULTwbU0WIlH6deYVgShm6C3_QqE1ycRxUB2sOHb9RywxUfCvuJbkUS4X4pGLy3ceYiPtIe2igaLT8Q'),
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