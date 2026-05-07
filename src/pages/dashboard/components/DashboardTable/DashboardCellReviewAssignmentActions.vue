<template>
	<TableCell>
		<PkpButton
			v-if="actionLabel"
			class="-ms-3"
			:aria-describedby="'submission-title-' + item.id"
			:is-link="true"
			@click="
				dashboardPageStore.openReviewerForm({
					submissionId: item.submissionId,
				})
			"
		>
			{{ actionLabel }}
		</PkpButton>
	</TableCell>
</template>
<script setup>
import {defineProps, computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import TableCell from '@/components/Table/TableCell.vue';
import {CompletedReviewAssignmentStatuses} from '@/composables/useSubmission.js';

import {useDashboardPageStore} from '@/pages/dashboard/dashboardPageStore.js';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	item: {type: Object, required: true},
});

const actionLabel = computed(() => {
	// If the review round has been terminally closed (Accept / Decline / SentToExternal),
	// the assignment is archived from the reviewer's perspective: hide the in-flight
	// action and fall through to "View" only when the review was actually completed.
	const roundClosed = [
		pkp.const.REVIEW_ROUND_STATUS_ACCEPTED,
		pkp.const.REVIEW_ROUND_STATUS_DECLINED,
		pkp.const.REVIEW_ROUND_STATUS_SENT_TO_EXTERNAL,
	].includes(props.item.reviewRoundStatus);

	if (roundClosed) {
		if (!CompletedReviewAssignmentStatuses.includes(props.item.status)) {
			return null;
		}
	}
	switch (props.item.status) {
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_AWAITING_RESPONSE:
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_RESPONSE_OVERDUE:
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_REQUEST_RESEND:
			return t('dashboard.actions.respondToRequest');
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_ACCEPTED:
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_REVIEW_OVERDUE:
			return t('dashboard.actions.finishReview');
		case pkp.const.REVIEW_ASSIGNMENT_STATUS_DECLINED:
			return null;
		default:
			return t('common.view');
	}
});

const dashboardPageStore = useDashboardPageStore();
</script>
