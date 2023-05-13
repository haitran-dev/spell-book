/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				'dark-txt': '#03052e',
				'light-txt': '#e7e8fc',
				line: '#aaa',
				danger: '#ff1111',
			},
		},
	},
	plugins: [],
};
