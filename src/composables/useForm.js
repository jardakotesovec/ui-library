import {ref} from 'vue';

function getField(form, name) {
	const fields = form.fields;

	return fields.find((field) => field.name === name);
}

function getClearValue(field, localeKey = null) {
	if (localeKey) {
		if (field.component === 'field-slider') {
			return field.min;
		}
		return Array.isArray(field.value[localeKey]) || field.selected ? [] : '';
	}

	if (field.component === 'field-slider') {
		return field.min;
	}
	return Array.isArray(field.value) || field.selected ? [] : '';
}

function mapFromSelectedToValue(selected) {
	return selected.map((iv) => iv.value);
}

export function useForm(_form) {
	const form = ref(_form);

	function setValue(name, inputValue) {
		const field = getField(form.value, name);
		if (!field) {
			return;
		}
		if (field.selected) {
			if (field.isMultilingual) {
				field.value = {};
				Object.keys(inputValue).forEach((localeKey) => {
					field.value[localeKey] = mapFromSelectedToValue(
						inputValue[localeKey],
					);
				});
				field.selected = inputValue;
			} else {
				const onlyValues = mapFromSelectedToValue(inputValue);
				field.value = onlyValues;
				field.selected = inputValue;
			}
		} else {
			field.value = inputValue;
		}
	}

	function clearForm() {
		form.value.fields.forEach((field) => {
			if (field.isMultilingual) {
				const newValueMultilingual = {};
				form.value.supportedFormLocales.forEach((localeObject) => {
					const localeKey = localeObject.key;
					const newValue = getClearValue(field, localeKey);
					newValueMultilingual[localeKey] = newValue;
				});
				setValue(field.name, newValueMultilingual);
			} else {
				const newValue = getClearValue(field);
				setValue(field.name, newValue);
			}
		});
	}

	return {
		setValue,
		clearForm,
		form,
	};
}
