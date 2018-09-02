/**
 * Created by yuan on 2018/8/31.
 */
const path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    },
    // 配置查找loader的目录
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src', 'loaders')
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase:path.resolve(__dirname,'dist'),
        publicPath: '/',
        port: 8080,
        hot:true,
        compress:true,
        historyApiFallback: true,
        inline: true
    },
    watch: false, //只有在开启监听模式时，watchOptions才有意义
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300, //监听到变化发生后等300ms再去执行动作，防止文件更新太快导致编译频率太高
        poll: 1000 //通过不停的询问文件是否改变来判断文件是否发生变化，默认每秒询问1000次
    },
    module: {
        rules:
        [
           {
               test: /\.js$/,
               use: [
                   {
                       loader:'babel-loader',
                       options: {
                           presets: ['env','es2015'],
                       }
                   },
                   {
                       loader: 'env-loader',
                       options: {
                           env: process.env.NODE_ENV
                       }
                   }
               ]
           }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 热替换插件
        new webpack.NamedModulesPlugin(), // 执行热替换时打印模块名字
    ]
}