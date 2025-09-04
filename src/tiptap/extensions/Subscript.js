// src/extensions/Subscript.js
import {Mark} from '@tiptap/core';

export const Subscript = Mark.create({
	name: 'sub',

	parseHTML() {
		return [{tag: 'sub'}];
	},

	renderHTML() {
		return ['sub', 0];
	},

	addCommands() {
		return {
			toggleSubscript:
				() =>
				({commands}) =>
					commands.toggleMark(this.name),
		};
	},

	addKeyboardShortcuts() {
		return {'Mod-,': () => this.editor.commands.toggleSubscript()};
	},
});
