// src/extensions/Italic.js
import {Italic} from '@tiptap/extension-italic'; // Named import (Tiptap v3 style)

export const Emphasis = Italic.extend({
	name: 'em',
});
