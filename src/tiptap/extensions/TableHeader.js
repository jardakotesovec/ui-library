// src/extensions/TableHeader.js
import {TableHeader} from '@tiptap/extension-table';

export const CustomTableHeader = TableHeader.extend({
	name: 'table_header',
	content: '(paragraph | ordered_list | bullet_list | figure | blockquote)*', // Same as cell
	marks: '_',

	addAttributes() {
		return {
			...this.parent?.(),
			background: {
				// Same as cell
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

	// parseHTML: <th>
	// renderHTML: <th> with style
});
