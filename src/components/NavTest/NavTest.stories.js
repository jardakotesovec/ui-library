import NavTest from './NavTest.vue';
export default {
	title: 'Components/NavTest',
	component: NavTest,
	render: (args) => ({
		components: {NavTest},
		setup() {
			return {args};
		},
		template: '<NavTest v-bind="args">{{args.slot}}</NavTest>',
	}),
};

export const Primary = {
	args: {
		slot: 'Primary',
		isPrimary: true,
	},
};
