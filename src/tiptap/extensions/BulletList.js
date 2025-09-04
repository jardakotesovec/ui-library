// src/extensions/BulletList.js
import BulletList from '@tiptap/extension-bullet-list';

export const CustomBulletList = BulletList.extend({
	name: 'bullet_list',
	content: 'list_item+', // Exact: 'list_item+' (Tiptap uses 'listItem' name)
	group: 'block',
	marks: '_',

	// parseHTML: Defaults to <ul>; matches your schema
	// renderHTML: Defaults to <ul>

	addCommands() {
		return {
			toggleBulletList:
				() =>
				({commands}) =>
					commands.toggleList(this.name, 'list_item'),
		};
	},

	addKeyboardShortcuts() {
		return {
			'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
		};
	},
});
