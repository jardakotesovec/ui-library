// src/extensions/Subtitle.js
import {Node} from '@tiptap/core';

export const Subtitle = Node.create({
	name: 'subtitle',
	content: 'inline*',
	marks: '_', // All marks allowed

	parseHTML() {
		return [{tag: 'h2[data-type=subtitle]'}];
	},

	renderHTML({HTMLAttributes}) {
		return ['h2', {'data-type': 'subtitle'}, 0];
	},

	addCommands() {
		return {
			setSubtitle:
				() =>
				({commands}) =>
					commands.setNode(this.name),
		};
	},
});
