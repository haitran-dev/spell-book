import React from 'react';

type IconProps = {
	svg: React.ElementType;
	svgW?: number;
	svgH?: number;
	svgClassName?: string;
} & React.ComponentProps<'div'>;

const Icon = ({ svg: Svg, svgW = 24, svgH = svgW, svgClassName, ...delegated }: IconProps) => {
	return (
		<div
			style={{
				width: '32px',
				height: '32px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
			}}
			{...delegated}
		>
			<Svg width={svgW} height={svgH} className={svgClassName} />
		</div>
	);
};

export default Icon;
