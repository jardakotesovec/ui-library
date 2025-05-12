import {useLocalize} from '@/composables/useLocalize';
import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useModal} from '@/composables/useModal';
import {useFetch, getCSRFToken} from '@/composables/useFetch';
export const Actions = {
	DATA_CITATION_LIST: 'dataCitationList',
	DATA_CITATION_ADD: 'dataCitationAdd',
	DATA_CITATION_EDIT: 'dataCitationEdit',
	DATA_CITATION_DELETE: 'dataCitationDelete',
	DATA_CITATION_SORT: 'dataCitationSort',
};

export function useDataCitationManagerActions({dataCitationGridComponent}) {
	const {t} = useLocalize();

	function dataCitationAdd({submission, publication}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: dataCitationGridComponent,
			op: 'addDataCitation',
			params: {
				submissionId: submission.id,
				publicationId: publication.id,
			},
		});

		openLegacyModal({title: t('submission.dataCitation.add')}, finishedCallback);
	}

	function dataCitationEdit({submission, publication, dataCitation}, finishedCallback) {
		const {openLegacyModal} = useLegacyGridUrl({
			component: dataCitationGridComponent,
			op: 'editDataCitation',
			params: {
				submissionId: submission.id,
				publicationId: publication.id,
				dataCitationId: dataCitation.id,
			},
		});

		openLegacyModal({title: t('submission.dataCitation.edit')}, finishedCallback);
	}

	function dataCitationDelete({submission, publication, dataCitation}, finishedCallback) {
		const {openDialog, openDialogNetworkError} = useModal();
		openDialog({
			actions: [
				{
					label: t('common.ok'),
					isWarnable: true,
					callback: async (close) => {
						// http://localhost:7002/index.php/publicknowledge/$$$call$$$/grid/dataCitations/dataCitation-grid/delete-dataCitation
						// ?submissionId=17&publicationId=22&dataCitation=9
						const {url} = useLegacyGridUrl({
							component: dataCitationGridComponent,
							op: 'deleteDataCitation',
							params: {
								submissionId: submission.id,
								publicationId: publication.id,
								dataCitationId: dataCitation.id,
							},
						});
						const formData = new FormData();
						formData.append('csrfToken', getCSRFToken());

						const {fetch, data} = useFetch(url, {
							method: 'POST',
							body: formData,
						});
						await fetch();
						close();
						finishedCallback();

						if (data.value.status !== true) {
							openDialogNetworkError();
						}
					},
				},
				{
					label: t('common.cancel'),
					callback: (close) => {
						close();
						finishedCallback();
					},
				},
			],
			title: t('common.delete'),
			message: t('common.confirmDelete'),
			modalStyle: 'negative',
		});
	}

	return {
		dataCitationAdd,
		dataCitationEdit,
		dataCitationDelete,
	};
}
