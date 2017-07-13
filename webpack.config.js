/**
 * 说明: webpack的配置请在该文件进行修改
 * webpack配置文档请查看:https://webpack.github.io/docs/configuration.html
 */

var path = require('path');
var os = require('os');
var _ = require('lodash');
var webpack = require('webpack');
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length + 2});
var glob = require('glob');
var RaxPlugin = require('rax-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

var srcPath = path.resolve(__dirname, './src'),
    outputPath = path.resolve(__dirname, './build');

var isWin = /^win/.test(process.platform);

/**
 * 获取demo文件夹中的入口文件
 * @param cwd
 * @returns {{}}
 */
function getDevEntry(cwd) {

    var entry = {};
    glob.sync('*.jsx', { cwd: cwd }).forEach(function(item, i) {
        var file = item.replace('.jsx', '');
        entry[file] = [
            item
        ];
    });
    return entry;
}

var config = {

    //服务器开启的端口号
    port: '3000',

    context: srcPath,

    //webpack 编译的入口文件
    entry: getDevEntry(srcPath),

    //输出的文件配置
    output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: '/build/'
    },

    resolve: {
        root: srcPath,
        extensions: ['', '.js', '.jsx']
    },

    "externals": [{
        "rax": "commonjs rax",
        "nuke": "commonjs nuke",
        "QAP-SDK": "commonjs QAP-SDK"
    }],

    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            include: [
                path.resolve(__dirname, "src")
            ],
            loader: 'happypack/loader?id=js'
        }, {
            test: /\.css$/,
            loader: 'happypack/loader?id=css',
            include: [
                path.resolve(__dirname, "src")
            ]
        }, {
            test: /\.less$/,
            loader: 'happypack/loader?id=less',
            include: [
                path.resolve(__dirname, "src")
            ]
        },{
            test: /\.rxscss$/,
            loader: 'happypack/loader?id=scss',
            include: [
                path.resolve(__dirname, "src")
            ]
        },{
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },

    plugins: [

        new HappyPack({
            cache: true,
            debug: true,
            id: 'js',
            loaders: ['babel?cacheDirectory=true'],
            threadPool: happyThreadPool
        }),

        new HappyPack({
            cache: true,
            debug: true,
            id: 'css',
            loaders: ['stylesheet'],
            threadPool: happyThreadPool
        }),

        new HappyPack({
            cache: true,
            debug: true,
            id: 'less',
            loaders: ['stylesheet!less'],
            threadPool: happyThreadPool
        }),

        new HappyPack({
            cache: true,
            debug: true,
            id: 'scss',
            loaders: ['rx-css-loader!fast-sass'],
            threadPool: happyThreadPool
        }),

        new RaxPlugin({
            target: 'bundle'
        }),
        //// Webpack will analyze and prioritize often used modules assigning them the smallest ids.
        new webpack.optimize.OccurenceOrderPlugin(),

        //进度插件
        new webpack.ProgressPlugin((percentage, msg) => {
            const stream = process.stderr;
            if (stream.isTTY && percentage < 0.71) {
                stream.cursorTo(0);
                stream.write(`📦   ${msg}`);
                stream.clearLine(1);
            }
        })
    ]
};




/**
 * 开发环境及demo编译时的配置
 * @returns {*}
 */
function dev() {

    var _config = _.cloneDeep(config);

    _config.plugins.push(

        new webpack.DefinePlugin({
            "process.env": { NODE_ENV: JSON.stringify('development') },
            "__DEV__": JSON.stringify(JSON.parse('true'))
        }),

        new LiveReloadPlugin()
    );

    //添加soure-map
    _config.devtool = 'inline-source-map';

    return _config;
}


/**
 * 编译到demo文件夹的配置
 * 与dev的区别是不需要调试相关的配置
 */
function prod() {
    var _config = _.cloneDeep(config);

    _config.plugins.push(

        //查找相等或近似的模块，避免在最终生成的文件中出现重复的模块。
        new webpack.optimize.DedupePlugin(),
        //Webpack gives IDs to identify your modules. With this plugin,
        // Webpack will analyze and prioritize often used modules assigning them the smallest ids.
        new webpack.optimize.OccurenceOrderPlugin(),


        new webpack.DefinePlugin({
            "process.env": { NODE_ENV: JSON.stringify('production') },
            "__DEV__": JSON.stringify(JSON.parse('false'))
        }),

        //UglifyJs
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: { warnings: false, drop_console: true },
            output: { comments: false }
        }),
        new webpack.BannerPlugin('// {"framework": "Rax"}', {raw: true})

    );

    return _config;
}


module.exports = {

    dev: dev,

    prod: prod

};