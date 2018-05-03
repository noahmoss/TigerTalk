//require our dependencies
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
	// the base directory for resolving the entry option
	context: __dirname,

	// entry point

	entry: {
	    main: './assets/js/index',
		vendor: Object.keys(package.dependencies),
	    about: './assets/js/about',
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
		})
		new HtmlWebpackPlugin({
			hash: true,
			// title: 'My Awesome application',
			// myPageHeader: 'Hello World',
			template: './templates/index.html',
			chunks: ['vendor', 'app'],
			filename: './templates/index.html' //relative to root of the application
		}),
		new HtmlWebpackPlugin({
			hash: true,
			// title: 'My Awesome application',
			// myPageHeader: 'Settings',
			template: './templates/index.html',
			chunks: ['vendor', 'settings'],
			filename: './templates/about.html'
		})

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
