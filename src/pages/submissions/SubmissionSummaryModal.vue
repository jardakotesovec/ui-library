<template>
	<SideModalBody>
		<template #pre-title>
			{{ submission.id }}
		</template>
		<template #title>
			<span class="underline">
				{{ submission.publications[0].authorsStringShort }}
			</span>
		</template>
		<template #description>
			{{ submission.publications[0].fullTitle.en }}
		</template>
		<template #post-description>
			<StageBubble :stage-id="submission.stageId">
				<span class="text-lg-normal">
					{{ submission.stageName }}
				</span>
				<template
					v-if="
						(submission.stageId ===
							pkp.const.WORKFLOW_STAGE_ID_INTERNAL_REVIEW ||
							submission.stageId ===
								pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) &&
						submission.reviewRounds.length
					"
				>
					{{
						t('common.inParenthesis', {
							text: t('common.reviewRoundNumber', {
								round:
									submission.reviewRounds[submission.reviewRounds.length - 1]
										.round,
							}),
						})
					}}
				</template>
			</StageBubble>
		</template>
		<template #actions>
			<PkpButton element="a" :href="submission.urlWorkflow">
				View submission in detail
			</PkpButton>
		</template>
		<div class="body-container">
			<div class="left-panel">
				<div class="left-panel-content">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat.
					</p>
				</div>
			</div>
			<div class="right-panel">
				<div class="right-panel-actions">
					<div>
						<PkpButton :is-primary="true" class="inline-flex">
							Send submission for review
						</PkpButton>
					</div>
					<div>
						<PkpButton class="inline-flex">Accept and skip review</PkpButton>
					</div>
					<div>
						<PkpButton :is-warnable="true" class="inline-flex">
							Decline submission
						</PkpButton>
					</div>
				</div>
				<div class="p-4">
					<div class="text-lg-bold">Editors assigned:</div>
					<div>
						<PkpButton
							is-link="true"
							@click="summaryStore.openAssignParticipantModal"
						>
							Assign Editors
						</PkpButton>
					</div>
				</div>
			</div>
		</div>
		<SideModal
			close-label="Close"
			:open="summaryStore.isModalOpenedAssignParticipant"
			@close="summaryStore.closeAssignParticipantModal"
		>
			<AssignEditorsModal />
		</SideModal>
	</SideModalBody>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import PkpButton from '@/components/Button/Button.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import SideModal from '@/components/Modal/SideModal.vue';
import AssignEditorsModal from '@/pages/submissions/AssignEditorsModal.vue';

import {useSubmissionSummaryStore} from '@/pages/submissions/submissionSummaryStore';

const pkp = window.pkp;

const summaryStore = useSubmissionSummaryStore();

const {submission} = storeToRefs(summaryStore);
</script>

<style>
:root {
	--border-color-light: #dddddd;
	--border-width: 1px;
	--size-2: 0.5rem;

	--size-4: 1rem;
	--size-5: 1.25rem;
	--bg-color-lightest: #ffffff;
}
</style>
<style scoped>
.body-container {
	border-color: var(--border-color-light);
	display: flex;
	width: 100%;
	border-top-width: var(--border-width);
}

.left-panel {
	width: 60%;
	border-color: var(--border-color-light);
	border-right-width: var(--border-width);
	padding: var(--size-4);
}

.left-panel-content {
	background-color: var(--bg-color-lightest);
	padding: var(--size-5);
}

.right-panel {
	width: 40%;
}

.right-panel-actions {
	display: flex;
	flex-direction: column;
	border-bottom-width: var(--border-width);
	border-color: var(--border-color-light);
	padding: var(--size-4);
}

.right-panel-actions > * + * {
	margin-top: var(--size-2); /* or 8px */
}
</style>
