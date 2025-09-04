// src/extensions/Placeholder.js
import {Node} from '@tiptap/core';

export const Placeholder = Node.create({
	name: 'placeholder',
	content: '',
	selectable: true,
	inline: false,
	draggable: true,
	isolating: false,
	atom: true,
	group: 'block',

	addAttributes() {
		return {
			id: {default: null},
			type: {default: 'logo'},
			label: {default: 'Logo'},
		};
	},

	renderHTML({node}) {
		return [
			'div',
			{
				id: node.attrs.id,
				'data-type': node.attrs.type,
				label: node.attrs.label,
				title: node.attrs.type,
			},
		];
	},
});
