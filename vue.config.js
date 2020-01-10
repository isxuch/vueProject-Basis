const path = require('path');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const STATIC_PATH = process.env.VUE_APP_PATH || './';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
module.exports = {
    lintOnSave: true,
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 100, // 换算的基数
                        propList: ['*'],
                        selectorBlackList: ['.ig-']
                    }),
                ]
            }
        }
    },
    configureWebpack: config => {
        if (IS_PROD) {
            const plugins = [];
            plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
            config.plugins = [
                ...config.plugins,
                ...plugins
            ];
        }
        config.externals = {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios'
        }
        config.plugins.push(
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, './static'),
                to: 'static'
            }]),
        )
    },
    publicPath: STATIC_PATH,
    chainWebpack: config => {
        config.entry.app = ['babel-polyfill', './src/main.js'];
        // 打包分析
        if (process.env.IS_ANALYZ) {
            config.plugin('webpack-report')
                .use(BundleAnalyzerPlugin, [{
                    analyzerMode: 'static',
                }]);
        }
        //资源处理
        config.module.rule('images').use('url-loader').loader('url-loader').tap(options => { options.limit = 1 * 1024; return options; })
    },
    // 选项...
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: "http://act2.test-mmsay.com",
                changeOrigin: true
            }
        }
    }
}