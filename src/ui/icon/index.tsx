import React from 'react';

type IconProps = {
	svg: React.ElementType;
	svgW?: number;
	svgH?: number;
	svgClassName?: string;
} & React.HTMLAttributes<unknown>;

const Icon = ({ svg, svgW = 24, svgH = svgW, svgClassName, ...delegated }: IconProps) => {
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
