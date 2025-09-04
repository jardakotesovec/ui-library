// src/extensions/OrderedList.js
import OrderedList from '@tiptap/extension-ordered-list';

export const CustomOrderedList = OrderedList.extend({
	name: 'ordered_list',
	content: 'list_item+', // Exact match
	group: 'block',
	marks: '_',

	// parseHTML: Defaults to <ol>; matches
	// renderHTML: Defaults to <ol>

	addCommands() {
		return {
			toggleOrderedList:
				() =>
				({commands}) =>
					commands.toggleList(this.name, 'list_item'),
		};
	},

	addKeyboardShortcuts() {
		return {
			'Mod-Shift-7': () => this.editor.commands.toggleOrderedList(),
		};
	},
});
