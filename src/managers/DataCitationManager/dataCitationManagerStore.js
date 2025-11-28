import {computed, onUnmounted, ref, toRefs} from 'vue';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useExtender} from '@/composables/useExtender';
import {useDataCitationManagerConfig} from './useDataCitationManagerConfig';
import {useDataCitationManagerActions} from './useDataCitationManagerActions';

export const useDataCitationManagerStore = defineComponentStore(
	'dataCitationManager',
	(props) => {

		const extender = useExtender();
		const dataCitationManagerConfig = extender.addFns(useDataCitationManagerConfig());
		const columns = computed(() => dataCitationManagerConfig.getColumns());
		const topItems = computed(() => dataCitationManagerConfig.getTopItems());

		function getItemActions({dataCitation}) {
			return dataCitationManagerConfig.getItemActions({
				dataCitation,
				store,
			});
		}

		const {
			submission,
			publication,
		} = toRefs(props);
		
		const { apiUrl } = useUrl(`dataCitations/publications/${publication.value.id}`);
		const {data: apiResponse, fetch: fetchDataCitations} = useFetch(apiUrl, {
			method: 'GET',
		});

		fetchDataCitations();
		const dataCitations = computed(() => { return apiResponse.value?.items ?? []; });

		/**
		 * Actions
		 */
		const dataCitationManagerActions = useDataCitationManagerActions();

		function dataUpdateCallback() {
			fetchDataCitations();
		}

		function getActionArgs(additionalArgs = {}) {
			return {
				submission: props.submission,
				publication: props.publication,
				dataCitationEditForm: props.dataCitationEditForm,
				...additionalArgs,
			};
		}
		function dataCitationAddDataCitation({}) {
			dataCitationManagerActions.dataCitationAddDataCitation(
				getActionArgs({}),
				dataUpdateCallback,
			);
		}
		function dataCitationEditDataCitation({dataCitation}) {
			dataCitationManagerActions.dataCitationEditDataCitation(
				getActionArgs({dataCitation}),
				dataUpdateCallback,
			);
		}
		function dataCitationDeleteDataCitation({dataCitation}) {
			dataCitationManagerActions.dataCitationDeleteDataCitation(
				getActionArgs({dataCitation}),
				dataUpdateCallback,
			);
		}

		const store = {
			columns,
			topItems,
			getItemActions,

			submission,
			publication,

			dataCitations,
			dataCitationAddDataCitation,
			dataCitationEditDataCitation,
			dataCitationDeleteDataCitation,
		};

		return store;
	},
);
