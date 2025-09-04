// src/extensions/Footnote.js
import {Node} from '@tiptap/core';

export const Footnote = Node.create({
	name: 'footnote',
	group: 'inline',
	content: 'inline*',
	inline: true,
	selectable: false,
	draggable: false,
	atom: true,

	addAttributes() {
		return {
			id: {default: null},
			type: {default: 'footnote'},
		};
	},

	parseHTML() {
		return [
			{
				tag: "span[data-type='footnote']",
				getAttrs: (element) => ({
					id: element.getAttribute('data-id'),
				}),
			},
		];
	},

	renderHTML({node}) {
		return [
			'span',
			{'data-type': 'footnote', 'data-id': node.attrs.id, id: node.attrs.id},
			0,
		];
	},
});
