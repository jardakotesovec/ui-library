import {defineComponentStore} from '@/utils/defineComponentStore';
import {useTranslation} from '@/composables/useTranslation';
import {useFetch} from '@/composables/useFetch';
import {useUrl} from '@/composables/useUrl';
import {computed, onMounted, ref, watch} from 'vue';
import {useModal} from '@/composables/useModal';
export const useUserInvitationPageStore = defineComponentStore(
	'userInvitationPage',
	(pageInitConfig) => {
		const {openDialog} = useModal();
		const {t} = useTranslation();

		/**
		 * Invitation payload, initial value
		 */
		const invitationPayload = ref({...pageInitConfig.invitationPayload});

		function updatePayload(fieldName, value) {
			invitationPayload.value[fieldName] = value;
		}

		/**
		 * Steps
		 */
		const currentStepId = ref(pageInitConfig.steps[0].id);
		const steps = ref(pageInitConfig.steps);
		const startedSteps = ref([]);

		/**
		 * The currently active step
		 */
		const currentStep = computed(() => {
			return steps.value.find((step) => step.id === currentStepId.value);
		});
		/**
		 * The index of the currently active step
		 * in the steps array
		 */
		const currentStepIndex = computed(() => {
			return steps.value.findIndex((step) => step.id === currentStepId.value);
		});
		/**
		 * Is the current step the first step?
		 */
		const isOnFirstStep = computed(() => {
			return !currentStepIndex.value;
		});

		/**
		 * Is the current step the last step?
		 */
		const isOnLastStep = computed(() => {
			return currentStepIndex.value === steps.value.length - 1;
		});

		/**
		 * Add a step change to the browser history so the
		 * user can use the browser's back button
		 *
		 * @param {Object} step The step to add
		 */
		function addHistory(step) {
			window.history.pushState({}, step.name, '#' + step.id);
		}

		/**
		 * Go to the next step or submit if this is the last step
		 */
		async function nextStep() {
			if (registeredActionsForSteps[currentStep.value.id]) {
				let shouldContinue = true;
				shouldContinue =
					await registeredActionsForSteps[currentStep.value.id]();
				if (!shouldContinue) {
					return;
				}
			}
			if (isOnLastStep.value) {
				submitInvitation();
			} else {
				if (!currentStep.value?.skipInvitationUpdate) {
					await updateInvitation();
					// this needs to check only relevant errors for given step using the step.validateFields
					if (currentStepErrorsPerSection.value.length === 0) {
						openStep(steps.value[1 + currentStepIndex.value].id);
					}
				} else {
					openStep(steps.value[1 + currentStepIndex.value].id);
				}
			}
		}

		/**
		 * Go to a step in the wizard
		 *
		 * @param {String} stepId
		 */
		function openStep(stepId) {
			startedSteps.value = [...new Set([...startedSteps.value, stepId])];
			const newStep = steps.value.find((step) => step.id === stepId);
			if (!newStep) {
				return;
			}
			errors.value = [];
			currentStepId.value = stepId;
		}

		/**
		 * Go to the previous step in the wizard
		 */
		function previousStep() {
			const previousIndex = currentStepIndex.value - 1;
			if (previousIndex >= 0) {
				openStep(steps.value[previousIndex].id);
			}
		}
		/**
		 * Update when the step changes
		 */
		watch(currentStepIndex, async (newVal, oldVal) => {
			if (newVal === oldVal) {
				return;
			}

			// Update the list of steps that have been started
			steps.value.forEach((step, i) => {
				if (
					!startedSteps.value.includes(step.id) &&
					i <= currentStepIndex.value
				) {
					startedSteps.value.push(step.id);
				}
			});

			// Track step changes in the title and browser history
			const step = steps.value[newVal];
			if (step.id !== window.location.hash.replace('#', '')) {
				addHistory(step);
			}
		});

		/** Page titles */
		const pageTitleDescription = ref(pageInitConfig.pageTitleDescription);
		const primaryLocale = ref(pageInitConfig.primaryLocale);
		/**
		 * The title to show at the top of the page
		 */
		const pageTitle = computed(() => {
			return pageInitConfig.pageTitle;
		});

		/**
		 * The step title to show at the top of the step
		 */
		const stepTitle = computed(() => {
			if (!currentStep.value) {
				return '';
			}
			return currentStep.value.reviewName.replace(
				'{$step}',
				'STEP -' + (1 + currentStepIndex.value),
			);
		});

		/** All Erros */
		const errors = ref({});

		/**
		 * Are there any validation errors?
		 */
		const isValid = computed(() => {
			return !Object.keys(errors.value).length;
		});

		/**
		 * set current step section errors
		 */
		const currentStepErrorsPerSection = computed(() => {
			let error = [];
			if (Object.keys(errors.value).length != 0) {
				currentStep.value.sections.forEach((element, index) => {
					if (element.props.validateFields.length > 0) {
						let sectionErr = {};
						element.props.validateFields.forEach((field) => {
							if (Object.keys(errors.value).includes(field)) {
								sectionErr[field] = errors.value[field];
							}
						});
						if (Object.keys(sectionErr).length != 0) {
							error[index] = sectionErr;
						}
					}
				});
			}

			return error;
		});

		/**
		 * Invitation actions
		 */
		const invitationId = ref(null);
		/**
		 * Create invitation
		 */
		async function createInvitation() {
			const {apiUrl} = useUrl('invitations');

			const {data, fetch: createInvitation} = useFetch(apiUrl, {
				method: 'POST',
				body: {type: pageInitConfig.invitationType},
			});
			await createInvitation();
			invitationId.value = data.value.invitationId;
		}

		/** Update invitation */
		async function updateInvitation() {
			if (!invitationId.value) {
				await createInvitation();
			}

			const {apiUrl} = useUrl(`invitations/${invitationId.value}`);

			const {fetch, validationError} = useFetch(apiUrl, {
				method: 'POST',
				body: invitationPayload.value,
				expectValidationError: true,
			});
			await fetch();
			if (validationError.value) {
				errors.value = validationError.value;
			} else {
				errors.value = [];
			}
		}

		/** Submit invitation */
		async function submitInvitation() {
			await updateInvitation();
			if (isValid.value) {
				const {apiUrl} = useUrl(`invitations/${invitationId.value}/submit`);

				const {data, fetch} = useFetch(apiUrl, {
					method: 'POST',
					body: {},
				});

				await fetch();
				if (data.value) {
					openDialog({
						title: t('userInvitation.modal.title'),
						message: t('userInvitation.modal.message', {
							email: invitationPayload.value.email,
						}),
						actions: [
							{
								label: t('userInvitation.modal.button'),
								callback: (close) => {
									close();
								},
							},
						],
					});
				}
			}
		}

		const registeredActionsForSteps = {};
		function registerActionForStepId(stepId, callback) {
			registeredActionsForSteps[stepId] = callback;
		}

		onMounted(() => {
			/**
			 * Open the correct step when the page is loaded
			 */
			if (!window.location.hash) {
				openStep(steps.value[0].id);
			}
		});

		return {
			invitationPayload,
			updatePayload,
			registerActionForStepId,
			//computed values
			currentStep,
			currentStepIndex,
			isOnFirstStep,
			isOnLastStep,
			isValid,
			pageTitle,
			startedSteps,
			stepTitle,
			openStep,
			currentStepErrorsPerSection,

			//page values
			steps,
			pageTitleDescription,
			errors,

			//form fields
			primaryLocale,

			//methods
			nextStep,
			previousStep,
		};
	},
);
