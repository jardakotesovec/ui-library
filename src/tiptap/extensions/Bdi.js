// src/extensions/Bdi.js
import {Mark} from '@tiptap/core';

export const Bdi = Mark.create({
	name: 'bdi',

	parseHTML() {
		return [{tag: 'bdi'}];
	},

	renderHTML() {
		return ['bdi', 0];
	},

	addCommands() {
		return {
			toggleBdi:
				() =>
				({commands}) =>
					commands.toggleMark(this.name),
		};
	},
});
