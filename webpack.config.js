//require our dependencies
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	// the base directory for resolving the entry option
	context: __dirname,

	// entry point
	entry: {
	    main: './assets/js/index.js',
	    about: './assets/js/about.js',
		post: './assets/js/post.js',
		splash: './assets/js/splash.js',
		search: './assets/js/search.js',
		navbar: './assets/js/404.js',
	},

	// default to dev mode
	mode: 'development',

	// location and naming convention for compiled bundles
	output: {
		path: path.resolve('./assets/bundles/'),
		filename: '[name]-[hash].js'
	},

	plugins: [
		// where to store data about bundles
		new BundleTracker({filename: './webpack-stats.json'}),

		// make jquery available in every module
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
	],

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ["es2015", 'react']
				}
			},
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.png$/, loader: "url-loader?limit=100000" },
			{ test: /\.jpg$/, loader: "file-loader" },
		]
	},

	resolve: {
		// where to look for modules
		modules: ['node_modules'],

		// extensions for resolving modules
		extensions: ['*', '.js', '.jsx']
	}
}
