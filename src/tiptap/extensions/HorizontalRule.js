// src/extensions/HorizontalRule.js
import {Node} from '@tiptap/core';

export const HorizontalRule = Node.create({
	name: 'horizontalRule',
	group: 'block',

	parseHTML() {
		return [{tag: 'hr'}];
	},

	renderHTML() {
		return ['hr'];
	},

	addCommands() {
		return {
			insertHorizontalRule:
				() =>
				({commands}) =>
					commands.insertContent({type: this.name}),
		};
	},
});
