<template>
	<TableCell class="w-28">
		<TableRowSortControls
			v-if="dataCitationManagerStore.sortingEnabled"
			@up="dataCitationManagerStore.sortMoveUp(dataCitation.id)"
			@down="dataCitationManagerStore.sortMoveDown(dataCitation.id)"
		/>
		<DropdownActions
			v-if="
				!dataCitationManagerStore.sortingEnabled &&
				dataCitationManagerStore.itemActions.length
			"
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="dataCitationManagerStore.itemActions"
			@action="(actionName) => dataCitationManagerStore[actionName]({dataCitation})"
		></DropdownActions>
	</TableCell>
</template>
<script setup>
import {useDataCitationManagerStore} from './dataCitationManagerStore';
import TableRowSortControls from './TableRowSortControls.vue';

defineProps({
	dataCitation: {type: Object, required: true},
});

import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';

const dataCitationManagerStore = useDataCitationManagerStore();
</script>
