<template>
	<SideModalBody>
		<template #pre-title>
			{{ submissionId }}
		</template>
		<template #title>
			<span>{{ t('editor.review.logResponse.for') }}</span>
		</template>
		<template #description>
			<span>{{ description }}</span>
		</template>
		<div class="px-8 h-full">
			<div class="bg-secondary h-full">
				<form class="pkpForm -pkpClearfix h-full" method="GET" action="https://httpbin.org" issaving="false">
					<div class="form-flex h-full">
						<fieldset class="pkpFormGroup -pkpClearfix">
							<FieldOptions
								v-bind="form"
								@change="change"
							/>
						</fieldset>
						<div>
							<div class="buttonRow pkpFormPage__footer">
								<div>
									<PkpButton :is-warnable="true" class="cancelButton">{{ t('common.cancel') }}</PkpButton>
									<PkpButton class="saveFormButton bg-primary" @click="submit">{{ t('editor.review.logResponse') }}</PkpButton>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</SideModalBody>
</template>

<script>
import {ref, inject} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpButton from '@/components/Button/Button.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
import {t} from "@/utils/i18n";
import ajaxError from '@/mixins/ajaxError';
import ButtonRow from '@/components/ButtonRow/ButtonRow.vue';

export default {
	components: {
		SideModalBody,
		PkpButton,
		FieldOptions,
		ButtonRow,
		PkpForm,
	},
	mixins: [ajaxError],
	props: {
		description: {
			type: String,
			required: true
		},
		submissionLocale: {
			type: String,
			required: true
		},
		journalLocales: {
			type: Array,
			required: true
		},
		submissionId: {
			type: Number,
			required: true
		},
		reviewAssignmentId: {
			type: Number,
			required: true
		},
		legacyOptions: {
			type: Object,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	},
	setup(props, {emit}) {
		const acceptReview = ref(false);
		const closeModal = inject('closeModal');

		const logResponseForm = {
			// groupId: 'preferences',
			formId: 'default',
			isRequired: true,
			primaryLocale: props.submissionLocale,
			locales: props.journalLocales,
			// allErrors: {
			// 	acceptReview: [this.responseRequired],
			// },
			name: 'acceptReview',
			component: 'field-options',
			label: t('editor.review.logResponse.form.detail'),
			description: t('editor.review.logResponse.form.subDetail'),
			value: {},
			type: 'radio',
			showWhen: 'options-confirmation',
			options: {
				0: {value: true, label: t('editor.review.logResponse.form.option.accepted')},
				1: {value: false, label: t('editor.review.logResponse.form.option.declined')},
			}
		}

		function change(field, label, value) {
			acceptReview.value = value;
		}

		function submit() {
			// props.legacyOptions.modalHandler
			// .getHtmlElement()
			// .trigger('dataChanged', props.reviewAssignmentId);

			$.ajax({
				url: props.url,
				type: 'POST',
				data: {
					acceptReview: acceptReview.value,
					csrfToken: pkp.currentUser.csrfToken,
				},
				error: this.ajaxErrorCallback,
				success(r) {
					//SHOW SUCCESS MESSAGE
				},
			});

			closeModal();
		}

		return {submit, change, acceptReview, logResponseForm};
	},
	data() {
		return {
			form: {
				// groupId: 'preferences',
				formId: 'default',
				isRequired: true,
				primaryLocale: this.submissionLocale,
				locales: this.journalLocales,
				// allErrors: {
				// 	acceptReview: [this.responseRequired],
				// },
				name: 'acceptReview',
				component: 'field-options',
				label: t('editor.review.logResponse.form.detail'),
				description: t('editor.review.logResponse.form.subDetail'),
				value: {},
				type: 'radio',
				showWhen: 'options-confirmation',
				options: {
					0: {value: true, label: t('editor.review.logResponse.form.option.accepted')},
					1: {value: false, label: t('editor.review.logResponse.form.option.declined')},
				}
			}
		}
	}
};

</script>

<style lang="less" scoped>
	.form-flex {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
