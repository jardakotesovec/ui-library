// src/extensions/Citation.js
import {Node} from '@tiptap/core';

export const Citation = Node.create({
	name: 'citation',
	inline: true,
	content: 'inline*',
	group: 'inline',
	draggable: true,
	selectable: true,
	isolating: false,
	atom: true,

	addAttributes() {
		return {
			source: {default: null},
			style: {default: 'apa'},
			id: {default: null},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'cite[data-source]',
				getAttrs: (element) => ({
					source: element.getAttribute('data-source'),
					style: element.getAttribute('data-style'),
				}),
			},
		];
	},

	renderHTML({node, HTMLAttributes}) {
		return [
			'cite',
			{'data-source': node.attrs.source, 'data-style': node.attrs.style},
			0,
		];
	},
});
