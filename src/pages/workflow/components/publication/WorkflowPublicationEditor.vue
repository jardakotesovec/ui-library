<template>
	<div class="editorPanel">
		<slot>
			<div v-if="hasLoadedContent" class="filePanel__ready">
				<div class="filePanel__header">
					<PkpHeader>
						<h2>{{ t('publication.bodyText') }}</h2>
						<template #actions>
							<PkpButton
								v-if="
									publication.status !== getConstant('STATUS_PUBLISHED') &&
									canEdit
								"
								ref="saveBodyTextButton"
								@click="saveBodyText"
							>
								{{ t('common.save') }}
							</PkpButton>
						</template>
					</PkpHeader>
				</div>
				<div class="filePanel__items">
					<div class="filePanel__fileContent">
						<div v-if="editor" class="container">
							<div class="control-group">
								<div class="button-group">
									<button
										:disabled="!editor.can().chain().focus().toggleBold().run()"
										:class="{'is-active': editor.isActive('bold')}"
										@click="editor.chain().focus().toggleBold().run()"
									>
										Bold
									</button>
									<button
										:disabled="
											!editor.can().chain().focus().toggleItalic().run()
										"
										:class="{'is-active': editor.isActive('italic')}"
										@click="editor.chain().focus().toggleItalic().run()"
									>
										Italic
									</button>

									<button
										:class="{'is-active': editor.isActive('paragraph')}"
										@click="editor.chain().focus().setParagraph().run()"
									>
										Paragraph
									</button>
									<button
										:class="{
											'is-active': editor.isActive('heading', {level: 1}),
										}"
										@click="
											editor.chain().focus().toggleHeading({level: 1}).run()
										"
									>
										H1
									</button>
									<button
										:class="{
											'is-active': editor.isActive('heading', {level: 2}),
										}"
										@click="
											editor.chain().focus().toggleHeading({level: 2}).run()
										"
									>
										H2
									</button>
									<button
										:class="{
											'is-active': editor.isActive('heading', {level: 3}),
										}"
										@click="
											editor.chain().focus().toggleHeading({level: 3}).run()
										"
									>
										H3
									</button>
									<button
										:class="{'is-active': editor.isActive('bulletList')}"
										@click="editor.chain().focus().toggleBulletList().run()"
									>
										Bullet list
									</button>
									<button
										:class="{'is-active': editor.isActive('orderedList')}"
										@click="editor.chain().focus().toggleOrderedList().run()"
									>
										Ordered list
									</button>
									<button
										:class="{'is-active': editor.isActive('codeBlock')}"
										@click="editor.chain().focus().toggleCodeBlock().run()"
									>
										Code block
									</button>
									<button
										:class="{'is-active': editor.isActive('blockquote')}"
										@click="editor.chain().focus().toggleBlockquote().run()"
									>
										Blockquote
									</button>
									<button
										@click="editor.chain().focus().setHorizontalRule().run()"
									>
										Horizontal rule
									</button>
									<button @click="editor.chain().focus().setHardBreak().run()">
										Hard break
									</button>
									<!--<button
										:disabled="!editor.can().chain().focus().undo().run()"
										@click="editor.chain().focus().undo().run()"
									>
										Undo
									</button>
									<button
										:disabled="!editor.can().chain().focus().redo().run()"
										@click="editor.chain().focus().redo().run()"
									>
										Redo
									</button>-->
								</div>
							</div>
							<EditorContent :editor="editor" />
						</div>
					</div>
				</div>
			</div>
			<div v-else class="filePanel__loading">
				<span class="pkpSpinner" aria-hidden="true"></span>
			</div>
		</slot>
	</div>
</template>

<script>
import Text from '@tiptap/extension-text';
import HardBreak from '@tiptap/extension-hard-break';
import {Editor, EditorContent} from '@tiptap/vue-3';
import {Anchor} from '@/tiptap/extensions/Anchor';
import {Bdi} from '@/tiptap/extensions/Bdi';
import {Blockquote} from '@/tiptap/extensions/Blockquote';
import {Caption} from '@/tiptap/extensions/Caption';
import {Citation} from '@/tiptap/extensions/Citation';
import {Code} from '@/tiptap/extensions/Code';
import {CustomDocument} from '@/tiptap/extensions/Document';
import {Figure} from '@/tiptap/extensions/Figure';
import {Footnote} from '@/tiptap/extensions/Footnote';
import {Header} from '@/tiptap/extensions/Header';
import {Heading} from '@/tiptap/extensions/Heading';
import {HorizontalRule} from '@/tiptap/extensions/HorizontalRule';
import {Image} from '@/tiptap/extensions/Image';
import {Label} from '@/tiptap/extensions/Label';
import {Link} from '@/tiptap/extensions/Link';
import {Math} from '@/tiptap/extensions/Math';
import {PageBreak} from '@/tiptap/extensions/PageBreak';
import {Paragraph} from '@/tiptap/extensions/Paragraph';
import {Part} from '@/tiptap/extensions/Part';
import {Placeholder} from '@/tiptap/extensions/Placeholder';
import {Sidebar} from '@/tiptap/extensions/Sidebar';
import {Subtitle} from '@/tiptap/extensions/Subtitle';
import {Subscript} from '@/tiptap/extensions/Subscript';
import {Superscript} from '@/tiptap/extensions/Superscript';
import {Tags} from '@/tiptap/extensions/Tags';
import {Emphasis} from '@/tiptap/extensions/Emphasis';
import {Strong} from '@/tiptap/extensions/Strong';

import {CustomListItem} from '@/tiptap/extensions/ListItem';
import {CustomBulletList} from '@/tiptap/extensions/BulletList';
import {CustomOrderedList} from '@/tiptap/extensions/OrderedList';
import {CustomTable} from '@/tiptap/extensions/Table';

import {CustomTableRow} from '@/tiptap/extensions/TableRow';
import {CustomTableCell} from '@/tiptap/extensions/TableCell';
import {CustomTableHeader} from '@/tiptap/extensions/TableHeader';

import {useId} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import {useUrl} from '@/composables/useUrl';

const documentExampleJson = {
	type: 'doc',
	attrs: {
		type: 'article',
	},
	content: [
		{
			type: 'header',
			content: [
				{
					type: 'heading',
					attrs: {
						id: 'c20f504',
						level: 1,
						type: 'chapter',
					},
					content: [
						{
							type: 'text',
							text: 'Testing title',
						},
					],
				},
			],
		},
		{
			type: 'part',
			attrs: {
				id: 'p-a1e34ca3-0a12-40d8-8169-184949d393a8',
				type: 'abstract',
				skipToc: false,
				data: {
					altTitle: [
						{
							type: 'running',
						},
					],
				},
			},
			content: [
				{
					type: 'heading',
					attrs: {
						id: 'a760aa29-d165-4eee-9da4-4b452c5315c7',
						level: 1,
						type: 'chapter',
					},
					content: [
						{
							type: 'text',
							text: 'Abstract section',
						},
					],
				},
				{
					type: 'paragraph',
					attrs: {
						id: 'p-a1e-f3ce9421',
					},
					content: [
						{
							type: 'text',
							text: 'Paragrapsh',
						},
					],
				},
				{
					type: 'bullet_list',
					content: [
						{
							type: 'list_item',
							content: [
								{
									type: 'paragraph',
									attrs: {
										id: 'p-a1e-8cc8f7c3',
									},
									content: [
										{
											type: 'text',
											text: 'List',
										},
									],
								},
							],
						},
						{
							type: 'list_item',
							content: [
								{
									type: 'paragraph',
									attrs: {
										id: 'f3ce9421',
									},
									content: [
										{
											type: 'text',
											text: 'a',
										},
									],
								},
							],
						},
						{
							type: 'list_item',
							content: [
								{
									type: 'paragraph',
									attrs: {
										id: 'c7c5ce1e',
									},
									content: [
										{
											type: 'text',
											text: 'b',
										},
									],
								},
							],
						},
					],
				},
				{
					type: 'figure',
					attrs: {
						id: 'p-a1e-3e4c374e',
						src: '',
						alt: '',
						type: 'native-table',
						orientation: 'portrait',
						'scale-width': 1,
					},
					content: [
						{
							type: 'table',
							attrs: {
								id: 'cagw4ca7ufllf',
							},
							content: [
								{
									type: 'table_row',
									attrs: {
										id: 'cagw4-8e765de6',
									},
									content: [
										{
											type: 'table_header',
											attrs: {
												colspan: 1,
												rowspan: 1,
												colwidth: null,
												background: null,
											},
											content: [
												{
													type: 'paragraph',
													attrs: {
														id: '3d189bc7',
													},
													content: [
														{
															type: 'text',
															text: 'a',
														},
													],
												},
											],
										},
										{
											type: 'table_header',
											attrs: {
												colspan: 1,
												rowspan: 1,
												colwidth: null,
												background: null,
											},
											content: [
												{
													type: 'paragraph',
													attrs: {
														id: 'f3ce9421af',
													},
													content: [
														{
															type: 'text',
															text: 'b',
														},
													],
												},
											],
										},
										{
											type: 'table_header',
											attrs: {
												colspan: 1,
												rowspan: 1,
												colwidth: null,
												background: null,
											},
											content: [
												{
													type: 'paragraph',
													attrs: {
														id: 'f3ce9421ea',
													},
													content: [
														{
															type: 'text',
															text: 'c',
														},
													],
												},
											],
										},
									],
								},
								{
									type: 'table_row',
									attrs: {
										id: 'cagw4-177fdd2f',
									},
									content: [
										{
											type: 'table_cell',
											attrs: {
												colspan: 1,
												rowspan: 1,
												colwidth: null,
												background: null,
											},
											content: [
												{
													type: 'paragraph',
													attrs: {
														id: 'f3ce94211e',
													},
													content: [
														{
															type: 'text',
															text: 'c',
														},
													],
												},
											],
										},
										{
											type: 'table_cell',
											attrs: {
												colspan: 1,
												rowspan: 1,
												colwidth: null,
												background: null,
											},
											content: [
												{
													type: 'paragraph',
													attrs: {
														id: 'f3ce9421a6',
													},
													content: [
														{
															type: 'text',
															text: 'd',
														},
													],
												},
											],
										},
										{
											type: 'table_cell',
											attrs: {
												colspan: 1,
												rowspan: 1,
												colwidth: null,
												background: null,
											},
											content: [
												{
													type: 'paragraph',
													attrs: {
														id: 'f3ce9421f5',
													},
													content: [
														{
															type: 'text',
															text: 'e',
														},
													],
												},
											],
										},
									],
								},
							],
						},
						{
							type: 'caption',
							content: [
								{
									type: 'paragraph',
									attrs: {
										id: 'jvo6wone2881',
									},
									content: [
										{
											type: 'text',
											text: 'table title',
										},
									],
								},
							],
						},
					],
				},
				{
					type: 'paragraph',
					attrs: {
						id: 'p-a1e-bb784eb5',
					},
				},
			],
		},
		{
			type: 'paragraph',
			attrs: {
				id: '95b4c5ca',
			},
		},
		{
			type: 'paragraph',
			attrs: {
				id: 'c7753aca',
			},
		},
		{
			type: 'paragraph',
			attrs: {
				id: '9e060aa4',
			},
		},
		{
			type: 'part',
			attrs: {
				id: 'rlamrrzawb5tu',
				type: 'chapter',
				skipToc: false,
			},
			content: [
				{
					type: 'heading',
					attrs: {
						id: 'svuae767xbog',
						level: 1,
						type: 'chapter',
					},
					content: [
						{
							type: 'text',
							text: 'Chapter title',
						},
					],
				},
			],
		},
	],
};

export default {
	components: {
		PkpButton,
		PkpHeader,
		EditorContent,
	},
	mixins: [ajaxError, dialog],
	props: {
		canEdit: {
			type: Boolean,
			required: true,
		},
		submission: {
			type: Object,
			required: true,
		},
		publication: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			isLoading: false,
			isModalOpenedForm: false,
			workingBodyTextProps: [],
			hasLoadedContent: false,
			id: useId(),
			editor: null,
		};
	},
	computed: {
		isDefaultContent() {
			return this.workingBodyTextProps['isDefaultContent'];
		},
		workingBodyTextContent() {
			return this.workingBodyTextProps['bodyTextContent'];
		},
		/**
		 * URL to the API endpoint for the current publication
		 */
		publicationApiUrl() {
			const {apiUrl} = useUrl(this.publicationApiUrlRelative);

			return apiUrl.value;
		},
		publicationApiUrlRelative() {
			return `submissions/${this.submission.id}/publications/${this.publication.id}/bodyText`;
		},
		fileStage() {
			return pkp.const.SUBMISSION_FILE_BODY_TEXT;
		},
	},
	watch: {
		publication(newValue, oldValue) {
			if (newValue != null) {
				this.fetchBodyTextFile();
			}
		},
	},
	mounted() {
		this.editor = new Editor({
			extensions: [
				/*StarterKit.configure({
					heading: false, // Disable default to use custom
					paragraph: false, // Disable default to use custom
					// Configure others as needed, e.g., history: false
				}),*/
				CustomDocument,
				Text,
				HardBreak,
				Anchor,
				Bdi,
				Blockquote,
				Caption,
				Citation,
				Code,
				Figure,
				Footnote,
				Header,
				Heading,
				HorizontalRule,
				Image,
				Label,
				Link,
				Math,
				PageBreak,
				Paragraph,
				Part,
				Placeholder,
				Sidebar,
				Subtitle,
				Subscript,
				Superscript,
				Tags,
				CustomListItem,
				CustomBulletList,
				CustomOrderedList,
				CustomTable,
				CustomTableRow,
				CustomTableCell,
				CustomTableHeader,
				Emphasis,
				Strong,
			],
			content: documentExampleJson,
		});
	},
	beforeUnmount() {
		this.editor.destroy();
	},
	created() {
		this.fetchBodyTextFile();
	},
	methods: {
		fetchWorkingBodyTextFile() {
			this.hasLoadedContent = false;
		},
		fetchBodyTextFile() {
			$.ajax({
				url: this.publicationApiUrl,
				type: 'GET',
				context: this,
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error: this.ajaxErrorCallback,
				success(r) {
					this.workingBodyTextProps = r;
					if (r.bodyTextContent?.trim()) {
						this.editor.commands.setContent(r.bodyTextContent);
					}
					this.hasLoadedContent = true;
				},
			});
		},
		saveBodyText() {
			$.ajax({
				url: this.publicationApiUrl,
				type: 'POST',
				data: {
					fileStage: pkp.const['SUBMISSION_FILE_BODY_TEXT'],
					bodyText: this.editor.getHTML(),
				},
				context: this,
				complete(r) {
					this.hasLoadedContent = true;
				},
				headers: {
					'X-Csrf-Token': pkp.currentUser.csrfToken,
				},
				error: this.ajaxErrorCallback,
				success(r) {},
			});
		},
		/**
		 * Helper method to access a global constant in the template
		 *
		 * @return {Object}
		 */
		getConstant(constant) {
			return pkp.const[constant];
		},
	},
};
</script>

<style lang="less">
@import '../../../../styles/_import';

.editorPanel {
	.filePanel__header {
		grid-column: span 12;
		background: #f3f3f3;
	}

	.filePanel__items {
		grid-column: span 12;
		background: white;
		padding: 20px;
	}

	.filePanel__fileContent {
		background: #f9f9f9;
		padding: 15px;
		border-radius: 5px;
	}

	.center-div {
		text-align: center;
	}

	/* Add responsive design adjustments */
	@media (max-width: 768px) {
		.editorPanel {
			grid-template-columns: repeat(1, 1fr);
		}
	}

	pre {
		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}

	.button-group {
		button {
			background-color: #aaaaaa;
			border-radius: 5px;
			padding: 2px;
			margin: 3px;
		}
	}

	/* Basic editor styles */
	.tiptap {
		background-color: #ffffff;

		:first-child {
			margin-top: 0;
		}

		/* List styles */
		ul,
		ol {
			padding: 0 1rem;
			margin: 1.25rem 1rem 1.25rem 0.4rem;

			li p {
				margin-top: 0.25em;
				margin-bottom: 0.25em;
			}
		}

		/* Heading styles */
		h1,
		h2,
		h3 {
			line-height: 1.1;
			margin-top: 2.5rem;
			text-wrap: pretty;
		}

		h1,
		h2 {
			margin-top: 3.5rem;
			margin-bottom: 1.5rem;
		}

		h1 {
			font-size: 1.4rem;
		}

		h2 {
			font-size: 1.2rem;
		}

		h3 {
			font-size: 1.1rem;
		}

		/* Code and preformatted text styles */
		code {
			background-color: var(--purple-light);
			border-radius: 0.4rem;
			color: var(--black);
			font-size: 0.85rem;
			padding: 0.25em 0.3em;
		}

		pre {
			background: var(--black);
			border-radius: 0.5rem;
			color: var(--white);
			font-family: 'JetBrainsMono', monospace;
			margin: 1.5rem 0;
			padding: 0.75rem 1rem;

			code {
				background: none;
				color: inherit;
				font-size: 0.8rem;
				padding: 0;
			}
		}

		blockquote {
			border-left: 3px solid var(--gray-3);
			margin: 1.5rem 0;
			padding-left: 1rem;
		}

		hr {
			border: none;
			border-top: 1px solid var(--gray-2);
			margin: 2rem 0;
		}
	}
}
</style>
