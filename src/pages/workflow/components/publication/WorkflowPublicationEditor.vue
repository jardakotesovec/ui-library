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
										@click="editor.chain().focus().toggleBold().run()"
										:disabled="!editor.can().chain().focus().toggleBold().run()"
										:class="{'is-active': editor.isActive('bold')}"
									>
										Bold
									</button>
									<button
										@click="editor.chain().focus().toggleItalic().run()"
										:disabled="
											!editor.can().chain().focus().toggleItalic().run()
										"
										:class="{'is-active': editor.isActive('italic')}"
									>
										Italic
									</button>
									<button
										@click="editor.chain().focus().toggleStrike().run()"
										:disabled="
											!editor.can().chain().focus().toggleStrike().run()
										"
										:class="{'is-active': editor.isActive('strike')}"
									>
										Strike
									</button>
									<button
										@click="editor.chain().focus().toggleCode().run()"
										:disabled="!editor.can().chain().focus().toggleCode().run()"
										:class="{'is-active': editor.isActive('code')}"
									>
										Code
									</button>
									<button
										@click="editor.chain().focus().setParagraph().run()"
										:class="{'is-active': editor.isActive('paragraph')}"
									>
										Paragraph
									</button>
									<button
										@click="
											editor.chain().focus().toggleHeading({level: 1}).run()
										"
										:class="{
											'is-active': editor.isActive('heading', {level: 1}),
										}"
									>
										H1
									</button>
									<button
										@click="
											editor.chain().focus().toggleHeading({level: 2}).run()
										"
										:class="{
											'is-active': editor.isActive('heading', {level: 2}),
										}"
									>
										H2
									</button>
									<button
										@click="
											editor.chain().focus().toggleHeading({level: 3}).run()
										"
										:class="{
											'is-active': editor.isActive('heading', {level: 3}),
										}"
									>
										H3
									</button>
									<button
										@click="editor.chain().focus().toggleBulletList().run()"
										:class="{'is-active': editor.isActive('bulletList')}"
									>
										Bullet list
									</button>
									<button
										@click="editor.chain().focus().toggleOrderedList().run()"
										:class="{'is-active': editor.isActive('orderedList')}"
									>
										Ordered list
									</button>
									<button
										@click="editor.chain().focus().toggleCodeBlock().run()"
										:class="{'is-active': editor.isActive('codeBlock')}"
									>
										Code block
									</button>
									<button
										@click="editor.chain().focus().toggleBlockquote().run()"
										:class="{'is-active': editor.isActive('blockquote')}"
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
									<button
										@click="editor.chain().focus().undo().run()"
										:disabled="!editor.can().chain().focus().undo().run()"
									>
										Undo
									</button>
									<button
										@click="editor.chain().focus().redo().run()"
										:disabled="!editor.can().chain().focus().redo().run()"
									>
										Redo
									</button>
								</div>
							</div>
							<editor-content :editor="editor" />
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
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import {Editor, EditorContent} from '@tiptap/vue-3';

import {useId} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import PkpHeader from '@/components/Header/Header.vue';
import ajaxError from '@/mixins/ajaxError';
import dialog from '@/mixins/dialog.js';
import {useUrl} from '@/composables/useUrl';
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
	mounted() {
		this.editor = new Editor({
			extensions: [TextStyle.configure({types: [ListItem.name]}), StarterKit],
			content: '<p>Body text here</p>',
		});
	},
	beforeUnmount() {
		this.editor.destroy();
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
					//this.workingBodyTextProps = r;
					this.editor.commands.setContent(r.bodyTextContent);
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
