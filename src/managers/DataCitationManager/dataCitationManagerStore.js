import {defineComponentStore} from '@/utils/defineComponentStore';
import {ref, computed, toRefs} from 'vue';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
import {useModal} from '@/composables/useModal';
import {useDataCitationManagerActions} from './useDataCitationManagerActions';
import {useDataChanged} from '@/composables/useDataChanged';
import {useDataCitationManagerConfig} from './useDataCitationManagerConfig';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useExtender} from '@/composables/useExtender';
import { onMounted } from 'vue';

export const useDataCitationManagerStore = defineComponentStore(
	'dataCitationManager',
	(props) => {
		const extender = useExtender();

		const {submission, publication} = toRefs(props);

		onMounted(() => {
			console.log('📦 publication:', props.publication);
		});

		const dataCitations = computed(() => {
			return sortingEnabled.value
				? dataCitationsOrdered.value
				: props?.publication?.dataCitations || [];
		});

		/** Reload files when data on screen changes */

		/** Columns */
		const dataCitationManagerConfig = extender.addFns(useDataCitationManagerConfig());
		const columns = computed(() => dataCitationManagerConfig.getColumns());

		/**
		 * Configs
		 */
		const dataCitationConfig = computed(() =>
			dataCitationManagerConfig.getManagerConfig({
				submission,
				publication,
			}),
		);

		const itemActions = computed(() =>
			dataCitationManagerConfig.getItemActions(getActionArgs()),
		);
		const bottomItems = computed(() =>
			dataCitationManagerConfig.getBottomItems(getActionArgs()),
		);
		const topItems = computed(() =>
			dataCitationManagerConfig.getTopItems(getActionArgs()),
		);

		/**
		 * Sorting
		 */
		const dataCitationsOrdered = ref([]);
		const sortingEnabled = ref(false);
		function startSorting() {
			dataCitationsOrdered.value = [...props.publication.dataCitations];
			sortingEnabled.value = true;
		}
		async function saveSorting() {
			const {openDialogNetworkError} = useModal();
			const {url} = useLegacyGridUrl({
				component: 'grid.dataCitations.DataCitationGridHandler',
				op: 'saveSequence',
				params: {
					submissionId: props.submission.id,
					publicationId: props.publication.id,
				},
			});

			const sequence = dataCitationsOrdered.value.map((dataCitation) => dataCitation.id);

			const formData = new FormData();
			formData.append('csrfToken', getCSRFToken());
			formData.append('data', sequence);

			const payload = {
				csrfToken: getCSRFToken(),
				data: JSON.stringify(sequence),
			};

			const body = new URLSearchParams(payload);

			const {fetch, data} = useFetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body,
			});
			await fetch();
			if (data.value.status !== true) {
				openDialogNetworkError();
			}
			await triggerDataChange();
			sortingEnabled.value = false;
		}

		function sortMoveDown(itemId) {
			const index = dataCitationsOrdered.value.findIndex(
				(dataCitation) => dataCitation.id === itemId,
			);

			if (index === dataCitationsOrdered.value.length - 1) {
				return;
			}

			const tempArray = [...dataCitationsOrdered.value];
			const tempItem = tempArray[index];
			tempArray[index] = tempArray[index + 1];
			tempArray[index + 1] = tempItem;

			dataCitationsOrdered.value = tempArray;
		}

		function sortMoveUp(itemId) {
			const index = dataCitationsOrdered.value.findIndex(
				(dataCitation) => dataCitation.id === itemId,
			);

			if (index === 0) {
				return;
			}

			const temp = dataCitationsOrdered.value[index];
			dataCitationsOrdered.value[index] = dataCitationsOrdered.value[index - 1];
			dataCitationsOrdered.value[index - 1] = temp;
		}

		/**
		 * Actions
		 */
		const dataCitationManagerActions = useDataCitationManagerActions({
			dataCitationGridComponent: dataCitationManagerConfig.getDataCitationGridComponent(),
		});

		function getActionArgs() {
			return {
				config: dataCitationConfig.value,
				dataCitations: dataCitations,
				publication: publication.value,
			};
		}

		const {triggerDataChange} = useDataChanged();

		function triggerDataChangeCallback() {
			triggerDataChange();
		}

		function dataCitationAdd() {
			dataCitationManagerActions.dataCitationAdd(
				{
					publication: props.publication,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function dataCitationEdit({dataCitation}) {
			dataCitationManagerActions.dataCitationEdit(
				{
					dataCitation,
					publication: props.publication,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		function dataCitationDelete({dataCitation}) {
			dataCitationManagerActions.dataCitationDelete(
				{
					dataCitation,
					publication: props.publication,
					submission: props.submission,
				},
				triggerDataChangeCallback,
			);
		}

		return {
			submission: props.submission,
			publication: props.publication,
			dataCitations,

			/** Config */
			columns,
			itemActions,
			topItems,
			bottomItems,

			/** Sorting */
			sortingEnabled,
			startSorting,
			saveSorting,
			sortMoveDown,
			sortMoveUp,

			/** Actions */
			dataCitationAdd,
			dataCitationEdit,
			dataCitationDelete,

			/** Extender */
			extender,
		};
	},
);
