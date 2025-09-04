import {Node, mergeAttributes} from '@tiptap/core';

export const Part = Node.create({
	name: 'part',

	content: 'heading? block*',

	marks: '_',

	group: 'structural',

	selectable: true,

	draggable: false,

	defining: false,

	isolating: false,

	addAttributes() {
		return {
			id: {
				default: null,
				parseHTML: (element) =>
					element.getAttribute('id') || element.getAttribute('data-id'),
				renderHTML: (attributes) => {
					if (!attributes.id) {
						return {};
					}
					return {
						id: attributes.id,
						'data-id': attributes.id,
					};
				},
			},
			type: {
				default: 'chapter',
				parseHTML: (element) => element.getAttribute('data-type') || 'chapter',
				renderHTML: (attributes) => ({
					'data-type': attributes.type,
				}),
			},
			locale: {
				default: undefined,
				parseHTML: (element) => element.getAttribute('data-locale'),
				renderHTML: (attributes) => {
					if (attributes.locale === undefined) {
						return {};
					}
					return {
						'data-locale': attributes.locale,
					};
				},
			},
			numbering: {
				default: undefined,
				parseHTML: (element) => element.getAttribute('data-numbering'),
				renderHTML: (attributes) => {
					if (attributes.numbering === undefined) {
						return {};
					}
					return {
						'data-numbering': attributes.numbering,
					};
				},
			},
			placement: {
				default: undefined,
				parseHTML: (element) => element.getAttribute('data-placement'),
				renderHTML: (attributes) => {
					if (attributes.placement === undefined) {
						return {};
					}
					return {
						'data-placement': attributes.placement,
					};
				},
			},
			role: {
				default: undefined,
				parseHTML: (element) => element.getAttribute('data-role'),
				renderHTML: (attributes) => {
					if (attributes.role === undefined) {
						return {};
					}
					return {
						'data-role': attributes.role,
					};
				},
			},
			'text-direction': {
				default: undefined,
				parseHTML: (element) => element.getAttribute('text-direction'),
				renderHTML: (attributes) => {
					if (attributes['text-direction'] === undefined) {
						return {};
					}
					return {
						'text-direction': attributes['text-direction'],
					};
				},
			},
			class: {
				default: undefined,
				parseHTML: (element) => element.getAttribute('data-class'),
				renderHTML: (attributes) => {
					if (attributes.class === undefined) {
						return {};
					}
					return {
						'data-class': attributes.class,
					};
				},
			},
			skipToc: {
				default: false,
				parseHTML: (element) =>
					element.getAttribute('data-skip-toc') === 'true',
				renderHTML: (attributes) => {
					if (!attributes.skipToc) {
						return {};
					}
					return {
						'data-skip-toc': 'true',
					};
				},
			},
			data: {
				default: undefined,
				parseHTML: (element) => {
					const extraData = element.getAttribute('data-extra');
					return extraData ? JSON.parse(extraData) : undefined;
				},
				renderHTML: (attributes) => {
					if (attributes.data === undefined) {
						return {};
					}
					return {
						'data-extra': JSON.stringify(attributes.data),
					};
				},
			},
			pageBreak: {
				default: undefined,
				parseHTML: (element) => element.getAttribute('data-page-break'),
				renderHTML: (attributes) => {
					if (attributes.pageBreak === undefined) {
						return {};
					}
					return {
						'data-page-break': attributes.pageBreak,
					};
				},
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'section[data-type]',
			},
		];
	},

	renderHTML({HTMLAttributes}) {
		return ['section', mergeAttributes(HTMLAttributes), 0];
	},
});
