import {ref} from 'vue';
import MultiSelect from './MultiSelect.vue';

export default {
	title: 'Components/MultiSelect',
	component: MultiSelect,
};

const countries = [
	{value: 'us', label: 'United States'},
	{value: 'ca', label: 'Canada'},
	{value: 'mx', label: 'Mexico'},
	{value: 'gb', label: 'United Kingdom'},
	{value: 'fr', label: 'France'},
	{value: 'de', label: 'Germany'},
	{value: 'es', label: 'Spain'},
	{value: 'it', label: 'Italy'},
	{value: 'jp', label: 'Japan'},
	{value: 'cn', label: 'China'},
	{value: 'br', label: 'Brazil'},
	{value: 'au', label: 'Australia'},
];

export const Default = {
	args: {
		id: 'multiselect-default',
		options: countries,
		placeholder: 'Select countries...',
	},
	render: (args) => ({
		components: {MultiSelect},
		setup() {
			return {args};
		},
		template: `
			<div class="p-6">
				<label for="multiselect-default" class="mb-2 block text-base-bold">
					Countries
				</label>
				<MultiSelect v-bind="args" />
			</div>
		`,
	}),
};

export const Controlled = {
	args: {
		id: 'multiselect-controlled',
		options: countries,
		placeholder: 'Select countries...',
	},
	render: (args) => ({
		components: {MultiSelect},
		setup() {
			const selected = ref([]);
			const setThree = () => {
				selected.value = ['us', 'ca', 'fr'];
			};
			const reset = () => {
				selected.value = [];
			};
			return {args, selected, setThree, reset};
		},
		template: `
			<div class="p-6">
				<label for="multiselect-controlled" class="mb-2 block text-base-bold">
					Countries (controlled)
				</label>
				<MultiSelect v-bind="args" v-model="selected" />
				<div class="mt-4 text-base-normal">
					<strong>Selected:</strong> {{ selected.length ? selected.join(', ') : 'None' }}
				</div>
				<div class="mt-2 flex gap-2">
					<button class="rounded border border-light px-3 py-1" @click="setThree">
						Set US, Canada, France
					</button>
					<button class="rounded border border-light px-3 py-1" @click="reset">
						Reset
					</button>
				</div>
			</div>
		`,
	}),
};
