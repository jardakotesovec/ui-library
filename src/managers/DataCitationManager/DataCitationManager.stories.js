import DataCitationManager from './DataCitationManager.vue';
import {getDataCitationMock} from '@/mockFactories/dataCitationMock';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getPublicationMock} from '@/mockFactories/publicationMock';
export default {
	title: 'Managers/DataCitationManager',
	component: DataCitationManager,
};

export const Default = {
	render: (args) => ({
		components: {DataCitationManager},
		setup() {
			return {args};
		},
		template: `
            <DataCitationManager v-bind="args"/>`,
	}),
	args: {
		submission: getSubmissionMock({
			stages: [
				{
					id: pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
					currentUserAssignedRoles: [16, 1],
				},
			],
		}),
		publication: getPublicationMock({
			dataCitations: [
				getDataCitationMock({}),
				getDataCitationMock({
					label: 'Content analysis of undergraduate psychology textbooks',
				}),
			],
		}),
	},
};
