const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC = path.resolve(__dirname, 'src');


let entries = {
	home: path.join(SRC, '/js/page/home/index.js'),	
}


module.exports = {
    entry: entries,
	output:{
		filename: '[name]/index.js',
		path: path.resolve(__dirname, 'dist/page/'),
		// 绝对路径，因此html引入时也应该用绝对路径
		publicPath: '/assets/page/',
	},
	resolve: {
		alias: {
			Src: path.resolve(__dirname, 'src'),
			JS: path.resolve(__dirname, 'src/js'),
			CSS: path.resolve(__dirname, 'src/css'),
		}
	},	
	module: {
		rules:[
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, 'src')],
				exclude: [/node_modules/],
				loader: 'babel-loader',
			},
			{
				test: /\.css$/,
				include: [path.resolve(__dirname, 'src')],
				use: ExtractTextPlugin.extract({
					// filename: '[name].css',
					// fallback: "style-loader", // 编译后用什么loader来提取css文件
          			use: [{
          				loader: "css-loader", // 指需要什么样的loader去编译文件,这里由于源文件是.css所以选择css-loader
						options: {},
					},{
						loader: "postcss-loader", // 必须在sass之前，因为loader解析是从最末一个依次向前推进的
						options: {},
					}],
				}),
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename:  (getPath) => {
		    	return getPath('[name]/index.css');
		    },
		}), // 要先引入
	]
}

if (process.env.NODE_ENV === 'production') {
	module.exports.plugins = module.exports.plugins.concat([
		new webpack.optimize.UglifyJsPlugin({		
			// 删除所有的注释
			comments: false,
			compress: {
				// 对IE8必须 
				// if true ,rewrite property access using the dot notation, for example foo["bar"] → foo.bar
				properties: false,
				// 在UglifyJs删除没有用到的代码时不输出警告
        		warnings: false,
        		// 删除所有的 `console` 语句
        		// 还可以兼容ie浏览器
        		drop_console: false
     		},
     		output: {
     			// 最紧凑的输出
				beautify: false,
     		}
		})
	])
}

module.exports.devtool = '#cheap-module-eval-source-map';
module.exports.devServer = {
	// proxy: {
	// 	'/mork/': {
	// 		target: 'http://127.0.0.1:8080',
	// 	}
	// },
	host: '0.0.0.0',
	// contentBase指定了devServer寻找资源的根目录，包括html、ajax请求等
	// 当未设置publicpath时，也包括静态资源
	// 如果html放在子目录中，访问时要到对应目录路径
	contentBase: './',
	inline: true,
	port: 8080,
	// gzip压缩，开启与不开启传输浏览差别很大
	compress: true

}