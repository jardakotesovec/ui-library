import {useLocalize} from '@/composables/useLocalize';
import {useApp} from '@/composables/useApp';
import {Actions} from './useDataCitationManagerActions';
import {useCurrentUser} from '@/composables/useCurrentUser';

export const DataCitationManagerConfiguration = {
	permissions: [
		{
			roles: [pkp.const.ROLE_ID_AUTHOR],
			actions: [Actions.DATA_CITATION_LIST],
		},
		{
			roles: [
				pkp.const.ROLE_ID_SUB_EDITOR,
				pkp.const.ROLE_ID_MANAGER,
				pkp.const.ROLE_ID_SITE_ADMIN,
				pkp.const.ROLE_ID_ASSISTANT,
			],
			actions: [
				Actions.DATA_CITATION_LIST,
				Actions.DATA_CITATION_ADD,
				Actions.DATA_CITATION_DELETE,
				Actions.DATA_CITATION_EDIT,
				Actions.DATA_CITATION_SORT,
			],
		},
	],
	actions: [
		Actions.DATA_CITATION_LIST,
		Actions.DATA_CITATION_ADD,
		Actions.DATA_CITATION_DELETE,
		Actions.DATA_CITATION_EDIT,
		Actions.DATA_CITATION_SORT,
	],
	actionsRequiresUnpublishedState: [
		Actions.DATA_CITATION_ADD,
		Actions.DATA_CITATION_DELETE,
		Actions.DATA_CITATION_SORT,
	],
};

export function useDataCitationManagerConfig() {
	const {t} = useLocalize();
	const {hasCurrentUserAtLeastOneAssignedRoleInStage} = useCurrentUser();

	function getDataCitationGridComponent() {
		return 'grid.dataCitations.DataCitationGridHandler';
	}

	function getColumns() {
		const columns = [];

		columns.push({
			header: t('submission.dataCitation.title'),
			component: 'DataCitationManagerCellName',
			props: {},
		});

		columns.push({
			header: t('submission.dataCitation.persistentIdentifier'),
			component: 'DataCitationManagerCellPersistentIdentifier',
			props: {},
		});

		columns.push({
			header: t('common.moreActions'),
			headerSrOnly: true,
			component: 'DataCitationManagerCellActions',
			props: {},
		});

		return columns;
	}

	function getManagerConfig({submission, publication}) {
		const permittedActions = DataCitationManagerConfiguration.actions
			.filter((action) => {
				if (
					publication.value.status === pkp.const.STATUS_PUBLISHED &&
					DataCitationManagerConfiguration.actionsRequiresUnpublishedState.includes(
						action,
					)
				) {
					return false;
				}

				return true;
			})
			.filter((action) => {
				return DataCitationManagerConfiguration.permissions.some((perm) => {
					return (
						perm.actions.includes(action) &&
						hasCurrentUserAtLeastOneAssignedRoleInStage(
							submission.value,
							pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
							perm.roles,
						)
					);
				});
			});
		return {permittedActions};
	}

	function getBottomItems({config}) {
		const actions = [];

		if (config.permittedActions.includes(Actions.DATA_CITATION_ADD)) {
			actions.push({
				component: 'DataCitationManagerActionButton',
				props: {label: t('grid.action.addDataCitation'), action: Actions.DATA_CITATION_ADD},
				isLink: true,
			});
		}

		return actions;
	}

	function getTopItems({config, dataCitations}) {
		const actions = [];

		if (
			config.permittedActions.includes(Actions.DATA_CITATION_SORT) &&
			dataCitations.value.length
		) {
			actions.push({component: 'DataCitationManagerSortButton'});
		}
	
		return actions;
	}

	function getItemActions({config, publication}) {
		const actions = [];

		if (config.permittedActions.includes(Actions.DATA_CITATION_EDIT)) {
			const label =
				publication.status === pkp.const.STATUS_PUBLISHED
					? t('common.view')
					: t('common.edit');

			const icon =
				publication.status === pkp.const.STATUS_PUBLISHED ? 'View' : 'Edit';

			actions.push({
				label,
				name: Actions.DATA_CITATION_EDIT,
				icon,
			});
		}

		if (config.permittedActions.includes(Actions.DATA_CITATION_DELETE)) {
			actions.push({
				label: t('common.delete'),
				name: Actions.DATA_CITATION_DELETE,
				icon: 'Cancel',
				isWarnable: true,
			});
		}

		return actions;
	}

	return {
		getColumns,
		getItemActions,
		getBottomItems,
		getTopItems,
		getDataCitationGridComponent,
		getManagerConfig,
	};
}
