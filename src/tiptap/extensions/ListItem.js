// src/extensions/ListItem.js
import ListItem from '@tiptap/extension-list-item';

export const CustomListItem = ListItem.extend({
	name: 'list_item',
	content: 'block*', // Exact match to your schema: 'block*'
	marks: '_', // All marks allowed

	// No custom attrs needed (your schema uses defaults from prosemirror-schema-list)

	// parseHTML and renderHTML default to <li>; no override needed unless custom

	addCommands() {
		// Inherit defaults; add if needed
		return {
			...this.parent?.(),
		};
	},
});
