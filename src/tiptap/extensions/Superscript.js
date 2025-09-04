// src/extensions/Superscript.js
import {Mark} from '@tiptap/core';

export const Superscript = Mark.create({
	name: 'sup',

	parseHTML() {
		return [{tag: 'sup'}];
	},

	renderHTML() {
		return ['sup', 0];
	},

	addCommands() {
		return {
			toggleSuperscript:
				() =>
				({commands}) =>
					commands.toggleMark(this.name),
		};
	},

	addKeyboardShortcuts() {
		return {'Mod-.': () => this.editor.commands.toggleSuperscript()};
	},
});
