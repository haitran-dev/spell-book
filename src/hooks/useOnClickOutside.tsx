import React from 'react';

const useOnClickOutside = (callback: () => void) => {
	const nodeRef = React.useRef(null);

	const handleClick = (e: MouseEvent) => {
		if (nodeRef.current && !nodeRef.current.contains(e.target)) {
			callback();
		}
	};

	React.useEffect(() => {
		document.addEventListener('click', handleClick);

		return () => document.removeEventListener('click', handleClick);
	}, []);

	return nodeRef;
};

export default useOnClickOutside;
