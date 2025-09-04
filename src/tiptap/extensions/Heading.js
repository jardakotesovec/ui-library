// src/extensions/Heading.js
import {Node} from '@tiptap/core';

export const Heading = Node.create({
	name: 'heading', // Matches your SFNodeType.heading
	priority: 1000, // Optional, for parsing order
	content: '(text | footnote)*', // From your spec; adjust if needed
	group: 'block',
	defining: false,
	selectable: false,
	draggable: true,
	addAttributes() {
		return {
			id: {
				default: null,
				parseHTML: (element) =>
					element.getAttribute('id') || element.getAttribute('data-id'),
			},
			level: {default: 1},
			role: {default: undefined},
			type: {default: 'chapter'},
			numbering: {default: undefined},
			placement: {default: undefined},
			data: {
				default: undefined,
				parseHTML: (element) => {
					const extra = element.getAttribute('data-extra');
					return extra ? JSON.parse(extra) : undefined;
				},
			},
		};
	},
	parseHTML() {
		const readCommonAttrs = (element) => {
			const attrs = {
				id: element.getAttribute('id') || element.getAttribute('data-id'),
				type: element.getAttribute('data-type'),
				numbering: element.getAttribute('data-numbering'),
				role: element.getAttribute('data-role'),
				placement: element.getAttribute('data-placement'),
			};
			const extra = element.getAttribute('data-extra');
			if (extra) attrs.data = JSON.parse(extra);
			return attrs;
		};

		return [
			{
				tag: 'h1',
				getAttrs: (element) => ({level: 1, ...readCommonAttrs(element)}),
			},
			{
				tag: 'h2',
				getAttrs: (element) => ({level: 2, ...readCommonAttrs(element)}),
			},
			{
				tag: 'h3',
				getAttrs: (element) => ({level: 3, ...readCommonAttrs(element)}),
			},
			{
				tag: 'h4',
				getAttrs: (element) => ({level: 4, ...readCommonAttrs(element)}),
			},
			{
				tag: 'h5',
				getAttrs: (element) => ({level: 5, ...readCommonAttrs(element)}),
			},
			{
				tag: 'h6',
				getAttrs: (element) => ({level: 6, ...readCommonAttrs(element)}),
			},
		];
	},
	renderHTML({node, HTMLAttributes}) {
		const level = node.attrs.level || 1;
		const attrs = {
			...HTMLAttributes,
			'data-type': node.attrs.type,
			'data-numbering': node.attrs.numbering,
			'data-role': node.attrs.role,
			'data-placement': node.attrs.placement,
		};
		if (node.attrs.data) {
			attrs['data-extra'] = JSON.stringify(node.attrs.data);
		}
		return [`h${level}`, attrs, 0];
	},
	addCommands() {
		return {
			setHeading:
				(attrs) =>
				({commands}) =>
					commands.setNode(this.name, attrs),
			toggleHeading:
				(attrs) =>
				({commands}) =>
					commands.toggleNode(this.name, 'paragraph', attrs),
		};
	},
	addKeyboardShortcuts() {
		return {
			'Mod-Alt-1': () => this.editor.commands.setHeading({level: 1}),
			'Mod-Alt-2': () => this.editor.commands.setHeading({level: 2}),
			'Mod-Alt-3': () => this.editor.commands.setHeading({level: 3}),
			'Mod-Alt-4': () => this.editor.commands.setHeading({level: 4}),
			'Mod-Alt-5': () => this.editor.commands.setHeading({level: 5}),
			'Mod-Alt-6': () => this.editor.commands.setHeading({level: 6}),
		};
	},
});
