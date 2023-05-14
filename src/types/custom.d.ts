export type Meaning = {
	text: string;
	examples: Array<string>;
};

export type Widget = {
	name: string;
	type: string;
	label?: string;
	value?: number;
	min?: number;
	max?: number;
};
