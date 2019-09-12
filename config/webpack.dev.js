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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImRhODRiOWQ1ZWRhZDUzZDg4ZDIxODQxMDAwYjRiYjA3MWU1MzVmNjg4ZTM2OTc3MzJiZTcwNzUxM2I0OWU0Mjg0MjgxYjA0Njg0NDlkYjI1In0.eyJhdWQiOiIxIiwianRpIjoiZGE4NGI5ZDVlZGFkNTNkODhkMjE4NDEwMDBiNGJiMDcxZTUzNWY2ODhlMzY5NzczMmJlNzA3NTEzYjQ5ZTQyODQyODFiMDQ2ODQ0OWRiMjUiLCJpYXQiOjE1NjgyNjY3NTMsIm5iZiI6MTU2ODI2Njc1MywiZXhwIjoxNTY4MzUzMTUzLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.UQ09CxJAUZMyHn10rs2mo_UudnZfucEPjA0skGKfcikX5uhk7FdnJ3zZde8VvQqVnsoeuFb0e_VcAqbwQ1iW4qy0g0XSsffgUETqhH_6-yuyFe7s5e9pdsnJMoPsObk8ccA8B9tcZVTtXTUQsZFNcmdfJih7gBUPlfiBcq87oZbbBaeKSs5U1d4ObNNp06l5d2gkf5j8DbeL31g3EwqI3bPCXVPHfhogQlJ4t2NMalfngdoRlaFG6xgw1vkE0ZM3DttBWY7xytTfA_junMmJsd3CqE2qjITxB25Znz5Hoc45tekKhCHqJve0h43VVY3aoTxuVafb8URcUyDsi1tbjfjoGsIlYZ7Bbu3klPpLc10reItqY00v7qINP96Z4BR7lhc11NGW9flz0RFKPti3ZtTKeCQCJCkPxY4f_8cnZkD6Y4ViGvKJCNAHD0fvIteL46itCvJMwehK2DbB5bRx0k4i5GJrJCq0I_s0WJVtQl-QHc9a0gezM5cHhipeYyLmaJ9rBdsH3zk-AVrpO_TDo6Mp668xLS-xf6RlgvcVFMFcBZEqLs-qn-6_nwTCuePmH3VxImorzlgU_CX1gXYH1nrDHvG_IpJTCuu9hmIcVuJh_bkwFIqP-Ky2X0HmthtO3S5ANOQEak6J9iuYcNiWTcx7pt-2QLo0341IUx7Muj4'),
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