// src/extensions/TableRow.js
import {TableRow} from '@tiptap/extension-table';

export const CustomTableRow = TableRow.extend({
	name: 'table_row',
	content: '(table_cell | table_header)*',

	addAttributes() {
		return {
			...this.parent?.(),
			id: {default: null}, // Add id as in schema
		};
	},

	// parseHTML: <tr>
	// renderHTML: <tr>
});
