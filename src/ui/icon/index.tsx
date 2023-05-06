import React from 'react';

const Icon = ({ svg, svgW = 24, svgH = svgW, svgClassName, ...delegated }) => {
	const Comp = svg;
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
			<Comp width={svgW} height={svgH} className={svgClassName} />
		</button>
	);
};

export default Icon;
