export default {
	acceptInvitationApiUrl: 'https://mock/index.php/publicknowledge/api/v1/users',
	primaryLocale: 'en',
	pageTitle: 'Invite user to take a role',
	pageTitleDescription:
		'You are inviting a user to take a role in OJS along with appearing in the journal masthead',
	csrfToken: '3e964b3403ec2daf5d595121b888ab4c',
	invitationId: 65,
	invitationKey: '8aqc3W',
	steps: [
		{
			id: 'verifyOrcid',
			name: 'Verify ORCID iD',
			reviewName: '',
			stepName: '{$step} - Verify ORCID iD',
			type: 'popup',
			description: 'Please verify orcid iD',
			sections: [
				{
					id: 'userVerifyOrcid',
					sectionComponent: 'AcceptInvitationVerifyOrcid',
				},
			],
		},
		{
			id: 'userCreate',
			name: 'Create OJS account',
			reviewName: 'Account details',
			stepName: '{$step} - Create OJS account',
			type: 'form',
			description:
				'To get started with OJS and accept the new role, you will need to create an account with us. For this purpose please enter a username and password.',
			sections: [
				{
					id: 'userCreateForm',
					sectionComponent: 'AcceptInvitationCreateUserAccount',
				},
			],
			reviewData: [],
		},
		{
			id: 'userDetails',
			name: 'Enter details',
			reviewName: 'User Details',
			stepName: '{$step} - Enter details',
			type: 'form',
			description:
				'Enter your details like email ID, affiliation ect. As per the GDPR compliance, this information can only modified by you. You can also choose if you want this information to be visible on your profile to the editor. ',
			sections: [
				{
					id: 'userCreateDetailsForm',
					type: 'form',
					description:
						'<p>Please provide the following details to help us manage your submission in our system.</p>',
					form: {
						id: 'userDetails',
						method: 'POST',
						action:
							'http://localhost/ojs/index.php/publicknowledge/api/v1/users',
						fields: [
							{
								name: 'email',
								component: 'field-text',
								label: 'Email address',
								groupId: 'default',
								isRequired: true,
								isMultilingual: false,
								value: 'test@mailinator.com',
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'large',
								prefix: '',
							},
							{
								name: 'orcid',
								component: 'field-text',
								label: 'ORCID iD',
								groupId: 'default',
								isRequired: false,
								isMultilingual: false,
								value: null,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'large',
								prefix: '',
							},
							{
								name: 'givenName',
								component: 'field-text',
								label: 'Given Name',
								groupId: 'default',
								isRequired: true,
								isMultilingual: false,
								value: null,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'large',
								prefix: '',
							},
							{
								name: 'familyName',
								component: 'field-text',
								label: 'Family Name',
								groupId: 'default',
								isRequired: true,
								isMultilingual: false,
								value: null,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'large',
								prefix: '',
							},
							{
								name: 'affiliation',
								component: 'field-text',
								label: 'Affiliation',
								groupId: 'default',
								isRequired: true,
								isMultilingual: false,
								value: null,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'large',
								prefix: '',
							},
							{
								name: 'country',
								component: 'field-text',
								label: 'County of affiliation',
								groupId: 'default',
								isRequired: true,
								isMultilingual: false,
								value: null,
								inputType: 'text',
								optIntoEdit: false,
								optIntoEditLabel: '',
								size: 'large',
								prefix: '',
							},
						],
						groups: [
							{
								id: 'default',
								pageId: 'default',
							},
						],
						hiddenFields: {},
						pages: [
							{
								id: 'default',
								submitButton: {
									label: 'Save',
								},
							},
						],
						primaryLocale: 'en',
						visibleLocales: ['en'],
						supportedFormLocales: [
							{
								key: 'en',
								label: 'English',
							},
							{
								key: 'fr_CA',
								label: 'French',
							},
						],
						errors: {},
					},
					sectionComponent: 'AcceptInvitationCreateUserForms',
				},
			],
		},
		{
			id: 'userCreateReview',
			name: 'Review & create account',
			reviewName: 'Roles',
			stepName: '{$step} - Review & create account',
			type: 'review',
			description: 'Review details to start your new roles in OJS',
			sections: [
				{
					id: 'userCreateRoles',
					sectionComponent: 'AcceptInvitationReview',
					type: 'table',
					description: '',
					rows: [
						{
							date_start: '2024-03-01',
							date_end: '2025-01-01',
							user_group_id: 3,
							setting_value: 'test',
						},
					],
				},
			],
		},
	],
};
