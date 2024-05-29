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
			<div class="bg-secondary ml-8 mr-8">
				<pkp-form
					v-bind="form"
				  @success="formSuccess"
					@set="updateForm"
				></pkp-form>
			</div>
		</SideModalBody>
</template>

<script>
import {inject} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpForm from '@/components/Form/Form.vue';
import PkpButton from '@/components/Button/Button.vue';
import FieldOptions from '@/components/Form/fields/FieldOptions.vue';
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
		description: {type: String, required: true},
		submissionId: {type: Number, required: true},
		legacyOptions: {type: Object, required: true},
		logResponseForm: {type: Object, required: true},
	},
  data() {
		return {
			form: this.logResponseForm,
		};
	},
	methods: {
		updateForm(formId, data) {
			let form = {...this.form};
			Object.keys(data).forEach((key) => (form[key] = data[key]));
			this.form = form;
		},
  },
	setup() {
		const closeModal = inject('closeModal');

		function formSuccess() {
		  closeModal();
		}

		return {formSuccess, closeModal};
	}
};

</script>
