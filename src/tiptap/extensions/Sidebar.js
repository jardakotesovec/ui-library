// src/extensions/Sidebar.js
import {Node} from '@tiptap/core';

export const Sidebar = Node.create({
	name: 'sidebar',
	content: 'heading? block+',

	parseHTML() {
		return [{tag: 'aside'}];
	},

	renderHTML() {
		return ['aside', {'data-type': 'sidebar', class: 'htmlbook-box'}, 0];
	},

	addCommands() {
		return {
			setSidebar:
				() =>
				({commands}) =>
					commands.setNode(this.name),
		};
	},
});
