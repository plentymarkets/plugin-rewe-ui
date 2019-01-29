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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQ2MGJmMGNlZTYxNmI1Y2Y4MDAwZTFmMmI5MzliN2YyZTQxYTI4Zjc2ZTkxOGY2NDU3ZTNjYzIyYmEwMTI2NGY0ZDMyNDQyMTdkNzcxMjBlIn0.eyJhdWQiOiIxIiwianRpIjoiNDYwYmYwY2VlNjE2YjVjZjgwMDBlMWYyYjkzOWI3ZjJlNDFhMjhmNzZlOTE4ZjY0NTdlM2NjMjJiYTAxMjY0ZjRkMzI0NDIxN2Q3NzEyMGUiLCJpYXQiOjE1NDg3NjMyMTYsIm5iZiI6MTU0ODc2MzIxNiwiZXhwIjoxNTQ4ODQ5NjE2LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.GbuRmsxcH7-HbjklU_tQGtiOgPkUSdjSzvHbGj1r3IKmxx6uHP76DWy33njBI3jkt46r1lMCfh9QxPtLN-IQQO7qtuu4tQwUXEj4grMbniIQ9WaDW0wbmamPVxKfdpwb9Gw2H5KysaksMiKBh8LpzHJW3083a0apDK-pqije2vwGLgwbrlmUfmbNiDbtcs-FPHpcwV7g9QuOxyhdXzd-Mzcs023IMS2-MM5pl30p9-K87azXkY9qx5sK7MF1kyipYGMqPaermhShfTqZlTGpDnT5DTroMXimSwVdZiFWDCsEMmrW0hsOtqb8ks0M0zF-UNkafu89dAEv7EenPzjBGl7j5VGJL5_pMahdvry-oD3iEKIkJgLJgueBLRiADWz8zvHCYwY9QvJaGStNfEKWplYj_rh3VriWja9er-ncli8HiuxPk_XCrjGpB07OCephDr1hDtHoQZvpelybrUD5wGi5c-qlJUEahcscxHjWfJ_5Js_vVXfT8_L5sWne725XpfH-HJbQTj66cAem4hxMwzMFfqjBqhhAgJg5oRtOEbh0cTXM2zsKvQX9O28wtwdbiYsNi_MlxHWSynzp4mLv18hg2c1kPVn0DAotIylGbsCFnFe8sP2BoIfyOr8Tmh6GDwugycIlQFj1s3724d5xhTqxPfdPbkZQH5s1EkrOoVA'),
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