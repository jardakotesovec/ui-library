// src/extensions/Tags.js
import {Mark} from '@tiptap/core';

export const Tags = Mark.create({
	name: 'tags',
	inclusive: false, // From schema: inclusives: false (typo in your code, but maps to inclusive)

	addAttributes() {
		return {
			tags: {default: []},
		};
	},

	parseHTML() {
		return [{tag: 'span[data-tags]'}];
	},

	renderHTML({mark}) {
		return [
			'span',
			{
				'data-tags': JSON.stringify(
					mark.attrs.tags.map((tag) => tag.key).join(' '),
				),
			},
			0,
		];
	},

	addCommands() {
		return {
			setTags:
				(attrs) =>
				({commands}) =>
					commands.setMark(this.name, attrs),
		};
	},
});
