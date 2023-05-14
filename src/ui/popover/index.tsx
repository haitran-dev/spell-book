import React from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const PopoverContext = React.createContext<boolean>(null);
const PopoverDispatchContext = React.createContext(null);

const PopoverProvider = ({ children }) => {
	const [isOpen, setOpen] = React.useState<boolean>(false);

	return (
		<PopoverContext.Provider value={isOpen}>
			<PopoverDispatchContext.Provider value={setOpen}>
				{children}
			</PopoverDispatchContext.Provider>
		</PopoverContext.Provider>
	);
};

const Popover = ({ className, children }) => {
	return (
		<PopoverProvider>
			<div className={className}>{children}</div>
		</PopoverProvider>
	);
};

Popover.Trigger = ({ children }) => {
	const togglePopover = React.useContext(PopoverDispatchContext);

	return <div onMouseOver={() => togglePopover(true)}>{children}</div>;
};

Popover.Body = ({ children }) => {
	const isOpen = React.useContext(PopoverContext);
	const setOpen = React.useContext(PopoverDispatchContext);
	const bodyRef = useOnClickOutside(() => setOpen(false));

	if (!isOpen) return null;

	return (
		<div ref={bodyRef} className='absolute top-[calc(100%+4px)] right-0'>
			{children}
		</div>
	);
};

export default Popover;
