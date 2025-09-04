// src/extensions/Paragraph.js
import {Node} from '@tiptap/core';

export const Paragraph = Node.create({
	name: 'paragraph',
	priority: 1000, // High priority to be default fallback
	content: 'inline*',
	group: 'block',

	addAttributes() {
		return {
			id: {default: null},
			'text-align': {default: undefined},
			'text-direction': {default: undefined},
			class: {default: undefined},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'p',
				getAttrs: (element) => ({
					id: element.getAttribute('id') || element.getAttribute('data-id'),
					'text-align': element.style.textAlign,
					'text-direction': element.getAttribute('text-direction'),
					class: element.getAttribute('data-class'),
				}),
			},
		];
	},

	renderHTML({node, HTMLAttributes}) {
		const attrs = {
			...HTMLAttributes,
			id: node.attrs.id,
			'data-id': node.attrs.id,
			'data-class': node.attrs.class,
			'text-direction': node.attrs['text-direction'] || null,
		};
		if (node.attrs['text-align']) {
			attrs.style = `text-align: ${node.attrs['text-align']}`;
		}
		return ['p', attrs, 0];
	},
});
