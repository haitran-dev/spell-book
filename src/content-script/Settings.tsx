import React from 'react';
import { WidgetContext, WidgetDispatchContext } from './WidgetContext';

const Settings = () => {
	const widgets = React.useContext(WidgetContext);
	const dispatch = React.useContext(WidgetDispatchContext);

	const handleChangeWidgetValue = ({ target, value }) => {
		dispatch({
			type: 'changed',
			target,
			value,
		});
	};

	return (
		<div className='w-[300px] bg-white backdrop-blur-sm border-single border-opacity-30 border-line rounded p-2 shadow-md grid grid-cols-2 gap-y-2 gap-x-5'>
			{widgets.map((widget) => {
				return (
					<label className='font-semibold text-[14px]' key={widget.name}>
						{widget.label}
						<input
							type={widget.type}
							value={widget.value}
							min={widget.min}
							max={widget.max}
							step={0.01}
							onChange={(e) =>
								handleChangeWidgetValue({
									target: widget.name,
									value: e.target.value,
								})
							}
						/>
					</label>
				);
			})}
		</div>
	);
};

export default Settings;
