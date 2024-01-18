<script>
import {h, resolveComponent} from 'vue';
import VueRegistry from '../../../../pkp/js/classes/VueRegistry.js';

export default function IDiv(props, {slots, attrs}) {
	const idivId = props.idiv || null;

	if (idivId) {
		const injectableSlot = VueRegistry.getSlot(idivId);
		if (injectableSlot) {
			if (injectableSlot.position === 'replace') {
				return h('div', props, h(resolveComponent(injectableSlot.component)));
			} else if (injectableSlot.position === 'start') {
				const content = slots.default ? [slots.default()] : [];
				content.unshift(h(resolveComponent(injectableSlot.component)));

				return h('div', props, content);
			} else if (injectableSlot.position === 'end') {
				const content = slots.default ? [slots.default()] : [];
				content.push(h(resolveComponent(injectableSlot.component)));

				return h('div', props, content);
			}
		}
	}

	return h('div', props, slots);
}
</script>
