// src/extensions/Header.js
import {Node} from '@tiptap/core';

export const Header = Node.create({
	name: 'header',
	content: 'heading subtitle?',
	marks: 'sub sup em strong bdi tags', // Specific marks from schema
	isolating: true,

	parseHTML() {
		return [{tag: 'header'}];
	},

	renderHTML() {
		return ['header', 0];
	},

	addCommands() {
		return {
			setHeader:
				() =>
				({commands}) =>
					commands.setNode(this.name),
		};
	},
});
