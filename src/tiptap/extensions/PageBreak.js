// src/extensions/PageBreak.js
import {Node} from '@tiptap/core';

export const PageBreak = Node.create({
	name: 'pageBreak',
	group: 'block',
	selectable: false,
	draggable: true,

	parseHTML() {
		return [
			{
				tag: 'div[data-type="page-break"]',
				getAttrs: (element) => ({
					'data-type': element.getAttribute('data-type'),
				}),
			},
		];
	},

	renderHTML() {
		return ['div', {'data-type': 'page-break'}];
	},

	addCommands() {
		return {
			insertPageBreak:
				() =>
				({commands}) =>
					commands.insertContent({type: this.name}),
		};
	},
});
