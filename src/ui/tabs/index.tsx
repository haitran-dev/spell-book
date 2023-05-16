import React, { useContext } from 'react';

const TabContext = React.createContext(null);
const TabDispatchContext = React.createContext(null);

const Tabs = ({ defaultLabel, children }) => {
	const [activeTab, setActiveTab] = React.useState(defaultLabel);

	return (
		<TabContext.Provider value={activeTab}>
			<TabDispatchContext.Provider value={setActiveTab}>
				<div className='flex flex-col gap-2 h-full'>{children}</div>
			</TabDispatchContext.Provider>
		</TabContext.Provider>
	);
};

Tabs.Labels = ({ children }) => (
	<div className='flex items-center gap-2 font-semibold'>{children}</div>
);

Tabs.Label = ({ label }) => {
	const activeTab = React.useContext(TabContext);
	const setActiveTab = React.useContext(TabDispatchContext);
	const isActive = activeTab === label;

	const activeClassName = isActive ? 'active' : '';

	return (
		<div
			className={
				'flex-1 p-1 text-center rounded bg-white shadow-md shadow-line duration-300 hover:bg-blue-400 cursor-pointer ' +
				activeClassName
			}
			onClick={() => setActiveTab(label)}
		>
			{label}
		</div>
	);
};

Tabs.Panels = ({ children }) => {
	return <div className='h-0 flex-1'>{children}</div>;
};

Tabs.Panel = ({ children, label }) => {
	const activeTab = React.useContext(TabContext);
	const isActive = activeTab === label;

	const activeClassName = isActive ? 'visible' : 'visible-hidden';

	return <div className={'h-full flex flex-col ' + activeClassName}>{children}</div>;
};

export default Tabs;
