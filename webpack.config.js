//require our dependencies
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
	// the base directory for resolving the entry option
	context: __dirname,

	// entry point
	entry: './assets/js/index',

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
		})
	],

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react']
				}
			}
		]
	},

	resolve: {
		// where to look for modules
		modules: ['node_modules'],

		// extensions for resolving modules
		extensions: ['*', '.js', '.jsx']
	}

}
