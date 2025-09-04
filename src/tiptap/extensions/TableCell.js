// src/extensions/TableCell.js
import {TableCell} from '@tiptap/extension-table';

export const CustomTableCell = TableCell.extend({
	name: 'table_cell',
	content: '(paragraph | ordered_list | bullet_list | figure | blockquote)*', // Exact match to your cellContent
	marks: '_',

	addAttributes() {
		return {
			...this.parent?.(),
			background: {
				default: null,
				parseHTML: (element) => element.style.backgroundColor || null,
				renderHTML: (attributes) => {
					if (attributes.background) {
						return {style: `background-color: ${attributes.background};`};
					}
					return {};
				},
			},
		};
	},

	// parseHTML: <td>
	// renderHTML: <td> with style if background set
});
