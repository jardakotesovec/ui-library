<template>
	<SelectRoot v-model="selected" multiple>
		<template v-if="name">
			<input
				v-for="value in selected"
				:key="value"
				type="hidden"
				:name="`${name}[]`"
				:value="value"
			/>
		</template>
		<SelectTrigger
			:id="id"
			class="inline-flex min-h-10 min-w-[16rem] items-center justify-between gap-2 rounded border border-light bg-secondary px-3 py-2 text-start text-base-normal text-default focus:outline-none focus:ring-2 focus:ring-primary"
		>
			<SelectValue :placeholder="placeholder" class="truncate" />
			<SelectIcon as-child>
				<Icon icon="ChevronDown" class="h-4 w-4 shrink-0" />
			</SelectIcon>
		</SelectTrigger>
		<SelectPortal>
			<SelectContent
				position="popper"
				:side-offset="4"
				class="shadow-lg z-30 max-h-60 min-w-[var(--reka-select-trigger-width)] overflow-y-auto rounded border border-light bg-secondary"
			>
				<SelectViewport class="p-1">
					<SelectItem
						v-for="option in options"
						:key="option.value"
						:value="option.value"
						class="relative flex cursor-pointer select-none items-center gap-2 rounded px-3 py-2 text-base-normal text-default outline-none data-[highlighted]:bg-primary data-[highlighted]:text-on-dark data-[disabled]:opacity-50"
					>
						<SelectItemIndicator
							class="inline-flex h-4 w-4 shrink-0 items-center justify-center"
						>
							<Icon icon="Complete" class="h-4 w-4" />
						</SelectItemIndicator>
						<span
							v-if="!isSelected(option.value)"
							class="inline-block h-4 w-4 shrink-0"
							aria-hidden="true"
						/>
						<SelectItemText>{{ option.label }}</SelectItemText>
					</SelectItem>
				</SelectViewport>
			</SelectContent>
		</SelectPortal>
	</SelectRoot>
</template>

<script setup>
import {
	SelectRoot,
	SelectTrigger,
	SelectValue,
	SelectIcon,
	SelectPortal,
	SelectContent,
	SelectViewport,
	SelectItem,
	SelectItemText,
	SelectItemIndicator,
} from 'reka-ui';
import Icon from '@/components/Icon/Icon.vue';

defineProps({
	id: {type: String, default: null},
	options: {type: Array, default: () => []},
	placeholder: {type: String, default: 'Select...'},
	name: {type: String, default: null},
});

const selected = defineModel({type: Array, default: () => []});

function isSelected(value) {
	return selected.value?.includes(value);
}
</script>
