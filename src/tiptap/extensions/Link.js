// src/extensions/Link.js
import {Node} from '@tiptap/core';

export const Link = Node.create({
	name: 'link',
	inline: true,
	content: 'text*',
	group: 'inline',
	selectable: false,
	draggable: true,

	addAttributes() {
		return {
			id: {default: null},
			type: {default: null},
			href: {default: null},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'a[href][data-type=xref]',
				getAttrs: (element) => ({
					id: element.getAttribute('id'),
					type: element.getAttribute('data-type'),
					href: element.getAttribute('href'),
					'reference-format': element.getAttribute('reference-format'),
				}),
			},
		];
	},

	renderHTML({node}) {
		return [
			'a',
			{
				id: node.attrs.id,
				'data-type': node.attrs.type,
				href: node.attrs.href,
				'reference-format': node.attrs['reference-format'],
			},
			0,
		];
	},

	addCommands() {
		return {
			setLink:
				(attrs) =>
				({commands}) =>
					commands.setNode(this.name, attrs),
		};
	},
});
