<template>
	<PkpTable data-cy="data-citation-manager">
		<template #label>
			<h3 class="text-3xl-bold">
				{{ t('submission.dataCitation.dataCitations') }}
			</h3>
			<p class="text-xs11 font-normal">
				{{ t('submission.dataCitation.dataCitations.description') }}
			</p>
		</template>
		<template #top-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in dataCitationManagerStore.topItems"
					:key="i"
				></component>
			</div>
		</template>
		<TableHeader>
			<TableColumn v-for="(column, i) in dataCitationManagerStore.columns" :key="i">
				<span :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow v-for="dataCitation in dataCitationManagerStore.dataCitations" :key="dataCitation.id">
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, i) in dataCitationManagerStore.columns"
					:key="i"
					:dataCitation="dataCitation"
				></component>
			</TableRow>
		</TableBody>
		<template v-if="dataCitationManagerStore.bottomItems.length" #bottom-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in dataCitationManagerStore.bottomItems"
					:key="i"
				></component>
			</div>
		</template>
	</PkpTable>
</template>

<script setup>
import {useLocalize} from '@/composables/useLocalize';
import {useDataCitationManagerStore} from './dataCitationManagerStore';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';

import DataCitationManagerActionButton from './DataCitationManagerActionButton.vue';
import DataCitationManagerCellName from './DataCitationManagerCellName.vue';
import DataCitationManagerCellPersistentIdentifier from './DataCitationManagerCellPersistentIdentifier.vue';
import DataCitationManagerCellActions from './DataCitationManagerCellActions.vue';
import DataCitationManagerSortButton from './DataCitationManagerSortButton.vue';

const Components = {
	DataCitationManagerCellName,
	DataCitationManagerCellPersistentIdentifier,
	DataCitationManagerCellActions,
	DataCitationManagerSortButton,
	DataCitationManagerActionButton,
};

const props = defineProps({
	publication: {type: Object, required: true},
	submission: {type: Object, required: true},
});

const {t} = useLocalize();

const dataCitationManagerStore = useDataCitationManagerStore(props);
</script>
