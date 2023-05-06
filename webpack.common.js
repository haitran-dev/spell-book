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
		// options: path.resolve('./src/options/options.tsx'),
		background: path.resolve('./src/background/background.ts'),
		contentScript: path.resolve('./src/content-script/index.tsx'),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-react'],
						},
					},
					'ts-loader',
				],
			},
			{
				test: /\.css$/i,
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
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
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
					from: path.resolve('src/static'),
					to: path.resolve('dist'),
				},
			],
		}),
		...getHTMLPlugins(['popup']),
	],
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	optimization: {
		splitChunks: {
			chunks(chunk) {
				//  content script dom don't need spit chunk
				return chunk.name !== 'contentScript';
			},
		},
	},
};

function getHTMLPlugins(chunks) {
	return chunks.map(
		(chunk) =>
			new HtmlPlugin({
				title: `${chunk} page`,
				filename: `${chunk}.html`,
				chunks: [chunk],
			})
	);
}
