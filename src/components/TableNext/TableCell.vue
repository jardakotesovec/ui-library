<template>
	<component
		:is="isRowHeader ? 'th' : 'td'"
		:scope="isRowHeader ? 'row' : false"
		class="pkpTableCell"
	>
		<slot />
	</component>
</template>

<script setup>
import {defineProps} from 'vue';

defineProps({
	isRowHeader: {
		type: Boolean,
		default() {
			return false;
		},
	},
});
</script>
