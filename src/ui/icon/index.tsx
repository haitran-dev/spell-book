import React from 'react';

type IconProps = {
	svg: React.ElementType;
	svgW?: number;
	svgH?: number;
	style?: object;
} & React.ComponentProps<'div'>;

const Icon = ({ svg: Svg, svgW = 24, svgH = svgW, style, ...delegated }: IconProps) => {
	return (
		<div
			style={{
				...{
					width: '32px',
					height: '32px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer',
				},
				...style,
			}}
			{...delegated}
		>
			<Svg width={svgW} height={svgH} />
		</div>
	);
};

export default Icon;
