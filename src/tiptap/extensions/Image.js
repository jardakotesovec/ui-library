// src/extensions/Image.js
import {Node} from '@tiptap/core';

export const Image = Node.create({
	name: 'image',
	inline: true,
	group: 'inline',
	draggable: true,
	atom: true, // If you want it treated as atomic

	addAttributes() {
		return {
			id: {default: null},
			src: {default: undefined},
			alt: {default: undefined},
			title: {default: undefined},
			width: {default: undefined},
			height: {default: undefined},
			metaData: {default: undefined},
			decorative: {default: undefined},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'img[src]',
				getAttrs: (element) => ({
					src: element.getAttribute('src'),
					title: element.getAttribute('title') || undefined,
					alt: element.getAttribute('alt'),
					decorative:
						element.getAttribute('role') === 'presentation' ? true : undefined,
					id: element.getAttribute('id') || element.getAttribute('data-id'),
				}),
			},
		];
	},

	renderHTML({node, HTMLAttributes}) {
		const attrs = {
			...HTMLAttributes,
			src: node.attrs.src,
			title: node.attrs.title,
			alt: node.attrs.alt || (node.attrs.decorative ? '' : undefined),
			id: node.attrs.id,
			width: node.attrs.width,
			height: node.attrs.height,
		};
		if (node.attrs.decorative) {
			attrs.role = 'presentation';
			attrs.alt = '';
		}
		return ['img', attrs];
	},

	addCommands() {
		return {
			setImage:
				(attrs) =>
				({commands}) =>
					commands.setNode(this.name, attrs),
		};
	},
});
