import React from 'react';

const Button = ({ className, children, ...delegated }: React.ComponentProps<'button'>) => {
	return (
		<button className={className} {...delegated}>
			{children}
		</button>
	);
};

export default Button;
