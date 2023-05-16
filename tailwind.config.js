/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				main: 'hsl(270,20%,97%)',
				'dark-txt': '#03052e',
				'light-txt': '#e7e8fc',
				line: 'hsl(0,0%,85%)',
				danger: '#ff1111',
			},
			boxShadow: {
				card: '0 1px 40px 1px hsl(0,0%,0%,0.3)',
			},
		},
	},
	plugins: [],
};
