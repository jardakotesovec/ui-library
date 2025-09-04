// src/extensions/Anchor.js
import {Mark} from '@tiptap/core';

export const Anchor = Mark.create({
	name: 'anchor',
	inline: true,
	selectable: false,
	defining: true,
	group: 'inline',

	addAttributes() {
		return {
			href: {default: null},
			title: {default: null},
			id: {default: null},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'a[href]:not([data-type=xref])',
				getAttrs: (element) => ({
					href: element.getAttribute('href'),
					title: element.getAttribute('title'),
					id: element.getAttribute('data-id'),
				}),
			},
		];
	},

	renderHTML({mark}) {
		return [
			'a',
			{
				href: mark.attrs.href,
				title: mark.attrs.title,
				'data-id': mark.attrs.id,
			},
			0,
		];
	},

	addCommands() {
		return {
			setAnchor:
				(attrs) =>
				({commands}) =>
					commands.setMark(this.name, attrs),
			toggleAnchor:
				() =>
				({commands}) =>
					commands.toggleMark(this.name),
			unsetAnchor:
				() =>
				({commands}) =>
					commands.unsetMark(this.name),
		};
	},
});
