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
                    'TOKEN': JSON.stringify('Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY5NmZiNmVmZDFlYTdhZTJkMzM5YzA2NmJjMzVmMzQ3NjNkMGE1OTkwZGRiY2Y5NWM0YjVlNzVkN2JhMTEwZWMzMmE1MzZlZDNlYzUyYzJjIn0.eyJhdWQiOiIxIiwianRpIjoiZjk2ZmI2ZWZkMWVhN2FlMmQzMzljMDY2YmMzNWYzNDc2M2QwYTU5OTBkZGJjZjk1YzRiNWU3NWQ3YmExMTBlYzMyYTUzNmVkM2VjNTJjMmMiLCJpYXQiOjE1MjY1Mzk0NTIsIm5iZiI6MTUyNjUzOTQ1MiwiZXhwIjoxNTI2NjI1ODUwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.eQ_HZhshgr3jJBYgOtubtjbkdPzzjYM1qtR1zaa5JwZjiQ9Tv5sY6AJFboqaytcun5rHvRpK6cBTYGeLagX7orYfXfj7_46GKDsyMc1wQo_vtvia9pUSJKUtSRydEEJG3t8JYsSTZHigHVT19twtAucYlMCCR7q4jwR5q0vKxJiWVszzMWVvhPdj14h3OPnEmkUQ4PlORlZYFa-T39F1r1NwwvL9CaVyfLOQ75MTS3u6WooHO9n-9xTp0b4yaD6_nph_-v1ahXKxps0H6tZN0VlR5F7FRav6K7290wN5zm8b_VG-UYQracIVtMOdC4msOJR-UpEBbug5-ovaPNXOHPWw7oshJHEeKxi6Pafhciqy92Ot0YrtUwRaW5jfrFghJKy8eU4INbJKP9hPq1kQ9MetPZ0SwqLeUbNFAJ2cVLkApeDjsGkHMLKJI8TkkuhsPQnbA1jIuRM_gG-6QJAx1kwu2U2Gyb2yJvz8xlg3Mp03eP9kLFLiWBHtJseutSX38f1EFVsTMV1pYaQQe163As3dfHChgY2PnAXeNGDgcv67Z7X2ggtdonc0DDx_4umERhYPhhhtdpw8ID9j7AqGph9zaCgTgsOJuSNaBMM5wptFKXBUCFKqNzA4OAeJKUmZ7yi3Qeo1jjU7hqcif37unQA3MC_FKxLd96_zgFYipwQ'),
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