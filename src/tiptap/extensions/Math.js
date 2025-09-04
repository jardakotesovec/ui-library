// src/extensions/Math.js
import {Node} from '@tiptap/core';

export const Math = Node.create({
	name: 'math',
	group: 'inline',
	content: 'text*',
	inline: true,
	code: true,
	draggable: true,
	defining: true,
	atom: true,

	addAttributes() {
		return {
			id: {default: null},
			tex: {default: ''},
			style: {default: 'inline'},
			label: {default: undefined},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'math',
				getAttrs: (element) => ({
					id: element.getAttribute('data-id'),
					tex: element.getAttribute('data-tex'),
					style: element.getAttribute('data-style'),
					label: element.getAttribute('data-label'),
				}),
			},
		];
	},

	renderHTML({node, HTMLAttributes}) {
		return [
			'math',
			{
				'data-id': node.attrs.id,
				id: node.attrs.id,
				'data-tex': node.attrs.tex,
				'data-style': node.attrs.style,
				'data-label': node.attrs.label,
			},
			0,
		];
	},
});
