// src/extensions/Label.js
import {Node} from '@tiptap/core';

export const Label = Node.create({
	name: 'label',
	content: 'text*',
	marks: '_',

	parseHTML() {
		return [{tag: 'label'}];
	},

	renderHTML() {
		return ['label', 0];
	},
});
