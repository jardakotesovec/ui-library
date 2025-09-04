// src/extensions/Table.js
import {Table} from '@tiptap/extension-table';

export const CustomTable = Table.extend({
	name: 'table',
	content: 'table_row+',
	group: 'block',
	marks: '_', // All marks

	addAttributes() {
		return {
			...this.parent?.(),
			id: {default: null}, // Add id attr as in your schema
		};
	},

	// cellContent is handled in TableCell/TableHeader below
	// parseHTML: Defaults to <table>
	// renderHTML: Defaults to <table>

	addCommands() {
		return {
			insertTable:
				({rows = 3, cols = 3}) =>
				({tr, dispatch}) => {
					// Inherit and customize if needed
					return this.parent?.()({rows, cols})({tr, dispatch});
				},
		};
	},
});
