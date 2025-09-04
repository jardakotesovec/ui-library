import {Document} from '@tiptap/extension-document';

export const CustomDocument = Document.extend({
	content: 'header? (structural | block)*', // Port from your ProseMirror schema
});
