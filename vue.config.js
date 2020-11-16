const path = require("path");
const webpack = require("webpack");

function resolve(dir) {
    return path.join(__dirname, dir)
}

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    // 部署应用包时的基本 URL
    publicPath: isProduction ? '../column' : '',

    // 生产环境构建不需要sourceMap
    productionSourceMap: false,
    outputDir: 'dist',

    lintOnSave: false,
    assetsDir: 'static',

    // webpack简单的配置方式
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            // 全局jquery
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    // 开发配置
    devServer: require('./devServer.config.js'),

    lintOnSave: false,
    // 由于项目里用的element-ui的内置组件，这里需要添加对应路径去转
    chainWebpack: config => {
        config.module // webpackChain 提供的添加 loader 方法
            .rule('compile')
            .test(/\.js$/)
            .include
            .add(resolve('node_modules/element-ui/packages'))
            .add(resolve('node_modules/element-ui/src'))
            .end()
            .exclude
            .add(resolve('node_modules/element-ui/src/utils/date.js'))
            .end()
            .use('babel')
            .loader('babel-loader')
    }
}