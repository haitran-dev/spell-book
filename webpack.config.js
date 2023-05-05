const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	entry: {
		popup: path.resolve('./src/popup/popup.tsx'),
	},
	module: {
		rules: [
			{
				use: 'ts-loader',
				test: /\.tsx$/,
				exclude: /node_modules/,
			},
			{
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [tailwindcss, autoprefixer],
							},
						},
					},
				],
				test: /\.css$/i,
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve('src/manifest.json'),
					to: path.resolve('dist'),
				},
				{
					from: path.resolve('src/static/icon.png'),
					to: path.resolve('dist'),
				},
			],
		}),
		new HtmlPlugin({
			title: 'Visual dictionary',
			filename: 'popup.html',
			chunks: ['popup'],
		}),
	],
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: '[name].js',
	},
};
