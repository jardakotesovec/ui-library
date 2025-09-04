// src/extensions/Figure.js
import {Node} from '@tiptap/core';

export const Figure = Node.create({
	name: 'figure',
	content: '(table|code_block)? caption',
	group: 'block',
	draggable: true,
	selectable: true,
	defining: true,
	isolating: true,
	marks: 'tags',

	addAttributes() {
		return {
			id: {default: null},
			src: {default: ''},
			alt: {default: ''},
			width: {default: undefined},
			height: {default: undefined},
			type: {default: 'figure'},
			environment: {default: undefined},
			orientation: {default: 'portrait'},
			decorative: {default: undefined},
			'scale-width': {default: 1},
			'float-placement': {default: undefined},
			'float-reference': {default: undefined},
			'float-defer-page': {default: undefined},
			'float-modifier': {default: undefined},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'figure',
				getAttrs: (element) => ({
					id: element.getAttribute('data-id'),
					src: element.getAttribute('data-src'),
					alt: element.getAttribute('data-alt'),
					orientation: element.getAttribute('data-orientation'),
					type: element.getAttribute('data-type'),
				}),
			},
		];
	},

	renderHTML({node}) {
		const baseAttrs = {
			'data-id': node.attrs.id,
			id: node.attrs.id,
			'data-type': node.attrs.type,
			'data-alt': node.attrs.alt,
			'data-src': node.attrs.src,
			'data-orientation': node.attrs.orientation,
		};
		if (node.attrs.src?.length > 0) {
			return [
				'figure',
				baseAttrs,
				[
					'img',
					{src: node.attrs.src, alt: node.attrs.alt, title: node.attrs.title},
				],
				['div', 0],
			];
		}
		return ['figure', baseAttrs, 0];
	},

	addCommands() {
		return {
			setFigure:
				(attrs) =>
				({commands}) =>
					commands.setNode(this.name, attrs),
		};
	},
});
