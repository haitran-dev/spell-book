import React from 'react';

type IconProps = {
	svg: React.ElementType;
	svgW?: number;
	svgH?: number;
	svgClassName?: string;
} & React.ComponentProps<'button'>;

const Icon = ({ svg: Svg, svgW = 24, svgH = svgW, svgClassName, ...delegated }: IconProps) => {
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
			<Svg width={svgW} height={svgH} className={svgClassName} />
		</button>
	);
};

export default Icon;
