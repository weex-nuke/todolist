var path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    babel = require('gulp-babel'),
    os = require('os'),
    _ = require("underscore"),
    del = require('del'),
    open = require('open'),
    webpackDevServer = require('webpack-dev-server');

var work_path = process.cwd();
var config = require(path.join(work_path, 'webpack.config.js'));

function getPublicIP() {
    var publicIP = "127.0.0.1"; //fallbck ip
    var ifaces = os.networkInterfaces();
    var address = _.flatten(_.values(ifaces));
    address = _.filter(address, function(ifObj) {
        return ifObj.family == "IPv4" && ifObj.address != "127.0.0.1";
    });
    if (address.length > 0) {
        publicIP = address[0].address;
    }
    return publicIP;
}

var host = getPublicIP();

gulp.task('clean', function(cb) {
    del(['build', 'lib']).then(function() {
        cb();
    })
});

gulp.task('start', function(cb) {
    //alert && alert('start');
    var buildFirstTime = true;
    var webpackConfig = config.dev();
    var compiler = webpack(webpackConfig);
    var devHost = "http://" + host + ":" + webpackConfig.port;
    compiler.plugin('done', stats => {
        process.send && process.send({ stats: stats.toString({colors: true}), buildFirstTime:buildFirstTime, hasErrors:stats.hasErrors()});
        if (!stats.hasErrors()){
            if(buildFirstTime){
                cb && cb();
            }
            buildFirstTime = false;
        }
        // if (stats.hasErrors()) {
        //     console.log(stats.toString({ colors: true }));
        // } else if (buildFirstTime) { //只有第一次启动start的时候才执行
        //     //只有第一次启动start的时候才执行
        //     buildFirstTime = false;
        //     cb && cb();
        //     // listening
        //     gutil.log("[webpack-dev-server]", gutil.colors.magenta(devHost));
        //     gutil.log("[webpack-dev-server]", "To stop service, press [Ctrl + C] ..");

        //     if (typeof process.send === 'function') {
        //         process.send({ start: 'done' });
        //     }
        // }else{
        //     console.log('\n编译成功，请刷新千牛或者刷新浏览器');
        // }
    });

    var server = new webpackDevServer(compiler, {
        hot: false,
        inline: true,
        quiet: true,
        publicPath: webpackConfig.output.publicPath,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentBase: path.resolve(__dirname, './')
    }).listen(webpackConfig.port, '0.0.0.0', function(err) {
        if (err) {
            throw new gutil.PluginError("webpack-dev-server", err)
        }

    });
});


gulp.task('build:dist', ['clean'], function(cb) {

    var webpackConfig = config.prod();

    var compiler = webpack(webpackConfig, function(err, stats) {
        if (err) {
            gutil.log(err);
        }

        gutil.log(stats.toString({
            colors: true,
            chunks: false
        }));
    });
    compiler.plugin('done', stats => {
        if (stats.hasErrors()) {
            console.log(stats.toString({ colors: true }));
        }
        cb && cb();
        if (typeof process.send === 'function') {
            process.send({ build: 'done' });
        }
    });

});

gulp.task('build:lib', ['clean'], function() {

    return gulp.src('src/**/*.js?(x)')
        .pipe(babel())
        .pipe(gulp.dest('lib'));

});

gulp.task('default', ['start']);
gulp.task('build', ['build:lib', 'build:dist']);

module.exports = gulp;