import React from 'react';

const Icon = ({ svg, ...delegated }) => {
	return (
		<button
			style={{
				width: '32px',
				height: '32px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			{...delegated}
		>
			{svg}
		</button>
	);
};

export default Icon;
