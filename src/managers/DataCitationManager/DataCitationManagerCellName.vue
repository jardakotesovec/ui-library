<template>
	<TableCell>
		<span class="text-base-normal">
			{{ dataCitation.title }}
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';

const props = defineProps({dataCitation: {type: Object, required: true}});

</script>
