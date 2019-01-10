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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjEwMjUzMmE1MDYyOTI2MzI2NTE4NzA3NzQyNjIyNjM4OGUwOTNiZGUxYTcwOWIwYTVjZDEwOTY3OWEwMTkyNmVlY2IwN2NkM2RhY2UxY2IyIn0.eyJhdWQiOiIxIiwianRpIjoiMTAyNTMyYTUwNjI5MjYzMjY1MTg3MDc3NDI2MjI2Mzg4ZTA5M2JkZTFhNzA5YjBhNWNkMTA5Njc5YTAxOTI2ZWVjYjA3Y2QzZGFjZTFjYjIiLCJpYXQiOjE1NDcxMDkzNTYsIm5iZiI6MTU0NzEwOTM1NiwiZXhwIjoxNTQ3MTk1NzU2LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.RN-cxavwF_IEnwxx0tgnC8P9Rmli34CBq0C9QiSLd7MQYfH1sbTNvWW2tuxRLOmu3vzh8uo2EXIoKEg9uTOiVfGM2L1LDNSOSGFKKVWE6pwCXNEn-9b0EN30B4ukC_66uhYpKmMpc8Ci_7TZhB9_DKeXSj89WrX3A95GcOIO9BdxInhf0ub4c0ORnsodBYHVlgizyCi2DCCWGxvJZMi2Ix0M0VVGL6tahd5gqWuM3SJ3RocqzxDQc1rcdOSRd9rDJV-J5Kfthenb3n7pmEv7FsuYDHKB7Q5sEJt9vwOPTuAb2R66dkS4YqLbS0Benq7Hv5ic6C5UObbJeAIAvPMwazmyN7wCd4iNxb5Cz6FLdGekI_0wYfCD-idPC3dYbauSJ-8kYTN6yHggY2aWxtHAPH_SI7gmrRfZCPHSsygwnELKWVAam7XOOW0XF8SYVCpvV6e-7NIyFnXEuFHAr1dHPlORNwcrlMQWyEKcvIxvyMHn70pXvecgeL2lRtwDfLbtGOf2f-P6Y64lg0BbVSU_xmAQwjLrkzjNPnPEqgzfIMIgC8qucw2qEpRFc2rT6uGOBo2dPxVSali1lsYl0IKt-usx1M6o17LnZxLTk4C2pGRMw3MDkFqRkcibnnhDCvMrgdtQOdRv7QPrGESm5kSk_jIun9hQjDWjbIx8V_Xt1fY'),
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