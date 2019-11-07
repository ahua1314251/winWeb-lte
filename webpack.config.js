const HtmlWebpackPlugin = require('html-webpack-plugin');//用于自动生成html入口文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//将CSS代码提取为独立文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");//CSS模块资源优化插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports={
    mode: 'production',
    entry:{
        index:'./index.js'
    },
    output: {
        path: __dirname + '/dists',
        filename: "bundle.js"
    },

    module:{
        rules:[
            {test:/\.css$/,use:['style-loader','css-loader']},
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 12000
                }
            },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: ['url-loader']},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: ['url-loader']},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: ['url-loader']},
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: ['url-loader']
            }
        ]},
    plugins:[
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin(),//生成入口html文件
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })//为抽取出的独立的CSS文件设置配置参数
        ,
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template:"./starter.html",
            filename:"starter.html"

        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                sourceMap: false,
                compress: {
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true

                },
                output: {
                    // 最紧凑的输出
                    beautify: false,
                    // 删除所有的注释
                    comments: false
                }
            }
        })
    ],
    devServer: {
        contentBase:__dirname + '/dists',
        compress: true,
        port: 9000
    },
    optimization: {
        splitChunks: {
            chunks: "all",//在做代码分割时，只对异步代码生效，写成all的话，同步异步代码都会分割
            minSize: 300000, //引入的包大于500KB才做代码分割
            maxSize: 400000,
            minChunks: 1, //当一个包至少被用了多少次的时候才进行代码分割
            maxAsyncRequests: 8, //同时加载的模块数最多是5个
            maxInitialRequests: 6, //入口文件做代码分割最多能分成3个js文件
            automaticNameDelimiter: '~',//文件生成时的连接符
            name: true,//让cacheGroups里设置的名字有效
            cacheGroups: {//当打包同步代码时,上面的参数生效
                vendors: {
                    priority: -10,//值越大,优先级越高.模块先打包到优先级高的组里
                    filename: 'vendors.js'//把所有的库都打包到一个叫vendors.js的文件里
                },
                commom: {
                    priority: -20,
                    reuseExistingChunk: true,//如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
                    filename: 'common.js'
                    // test: /[\\/]node_modules[\\/]/ //检测引入的库是否在node_modlues目录下的
                    // minChunks: 2
                }
            }
        }
        //以上是默认配置

        //无论是同步还是异步代码分割，上面的配置都会生效
        //都需要用到SplitChunkPlugin这个插件
    }

}


