// src/extensions/Blockquote.js
import {Node} from '@tiptap/core';

export const Blockquote = Node.create({
	name: 'blockquote',
	content: 'block+',
	group: 'block',
	marks: '_',
	defining: true,

	addAttributes() {
		return {
			id: {default: null},
			lang: {default: undefined},
		};
	},

	parseHTML() {
		return [{tag: 'blockquote'}];
	},

	renderHTML() {
		return ['blockquote', 0];
	},

	addCommands() {
		return {
			toggleBlockquote:
				() =>
				({commands}) =>
					commands.toggleWrap(this.name),
		};
	},
});
