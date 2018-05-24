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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY5ZjY1NTg5NDY1NGRlMTY4ZWQxYWQ3NTk5MmVhNmRlOTMyNzI2YTVjYTg5ZmNkOTdlOGZiOTM2MGFmNDcxYmFmMjU5OGZjYWUzYmJiNjZmIn0.eyJhdWQiOiIxIiwianRpIjoiZjlmNjU1ODk0NjU0ZGUxNjhlZDFhZDc1OTkyZWE2ZGU5MzI3MjZhNWNhODlmY2Q5N2U4ZmI5MzYwYWY0NzFiYWYyNTk4ZmNhZTNiYmI2NmYiLCJpYXQiOjE1MjcxNTE5OTUsIm5iZiI6MTUyNzE1MTk5NSwiZXhwIjoxNTI3MjM4MzkzLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.pCxA1o0np4MT1F2hp-HmRHdnlX3f72EVZ8ITis9qboJ0Ub5aooLvPo18hdxWg7e_b_M2CGnphwaSI-AInghEpPpp4GixQgJTmAqt1vHCGRPOhvgjrDiXIwjSz-mCqkd0bfIxEUHcJGXHWrBBjny_0svBlufOaRDkzsrvQXijtli357I2t74Wxuqr37ouoIj5X1gFQ4IB94qamGIFifFF_1gj4RMBp4ZQRFg6R4vsrZNVtbIuK2uTMKPIk-d-hSffk-YgZQ4NL8R1HFY9_gOQz61JlOnCVaC2CUVNdIyEBEi8qg87I4O36fq5np0ZoDX9LURTE4o1-Brfg_lqqPvrUUPWQtZhY4H_IloykAFH72Ue_OLuqJZY1r4Ys7JZ30q2ec9hjwJhLrMwtHU-V_3_TOSygziUTTW2IGgUE4CZnFHp-6sY6OpBraAJ1r91xhql6CYTe_AlQMd_p0XHI_X7B4TgCxxAw9JPC_d2LeSb7oc4sjG2W_gbdR1qzj7m0IJS3T3bA35dPUp71LtcIq7Vvxr-8terDi77PFSdPfLlMpDoFo--y2OS7e27bP6B8vpq7JmkNnoLbSBiXz6WIKMPykMr-hkUuAoXVqvv8Aqh6Lnzw3pwDJOeMEWkImfIb8_oQjD_HxjX5AU8PTbeNYHlyTtpyOwIpDuVYd9tEKBuJFE'),
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