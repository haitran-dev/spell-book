import React from 'react';
import { Widget } from '../types/custom';
import { settingTypes } from '../constant/setting';

export const WidgetContext = React.createContext<Widget[]>(null);
export const WidgetDispatchContext = React.createContext(null);

export function WidgetProvider({ children }) {
	const [widgets, dispatch] = React.useReducer(widgetReducer, initialWidgets);

	return (
		<WidgetContext.Provider value={widgets}>
			<WidgetDispatchContext.Provider value={dispatch}>
				{children}
			</WidgetDispatchContext.Provider>
		</WidgetContext.Provider>
	);
}

function widgetReducer(widgets: Widget[], action: any) {
	switch (action.type) {
		case 'changed':
			return widgets.map((widget) => {
				if (widget.name === action.target) {
					return { ...widget, value: action.value };
				} else {
					return widget;
				}
			});

		default:
			throw Error('Unknown action ' + action.type);
	}
}

const initialWidgets: Widget[] = [
	{
		name: settingTypes.FONT_SIZE,
		label: 'Font size',
		type: 'range',
		value: 16,
		min: 12,
		max: 20,
	},
	{
		name: settingTypes.VOLUME,
		label: 'Volume',
		type: 'range',
		value: 1,
		min: 0,
		max: 1,
	},
];
