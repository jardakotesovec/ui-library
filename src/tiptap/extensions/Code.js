// src/extensions/Code.js
import {Node} from '@tiptap/core';

export const Code = Node.create({
	name: 'code_block',
	content: 'text*',
	marks: '',
	code: true,
	defining: true,
	group: 'block',

	addAttributes() {
		return {
			id: {default: null},
			text: {default: ''},
			type: {default: 'code'},
			language: {default: 'text/plain'},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'pre',
				getAttrs: (element) => ({
					text: element.textContent,
					language: element.getAttribute('data-language') || 'text/plain',
				}),
			},
		];
	},

	renderHTML({node}) {
		return ['pre', {'data-language': node.attrs.language}, node.attrs.text];
	},

	addCommands() {
		return {
			setCode:
				(attrs) =>
				({commands}) =>
					commands.setNode(this.name, attrs),
		};
	},
});
