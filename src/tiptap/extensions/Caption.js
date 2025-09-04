// src/extensions/Caption.js
import {Node} from '@tiptap/core';

export const Caption = Node.create({
	name: 'caption',
	content: 'label? block*',
	marks: '_',

	parseHTML() {
		return [{tag: 'figcaption'}];
	},

	renderHTML() {
		return ['figcaption', 0];
	},
});
