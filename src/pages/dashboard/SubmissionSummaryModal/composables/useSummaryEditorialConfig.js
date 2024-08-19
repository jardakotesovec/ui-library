import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';

const {t, tk} = useLocalize();

export function useSummaryEditorialConfig() {
	const {hasSubmissionPassedStage, hasNotSubmissionStartedStage} =
		useSubmission();

	function getTitle({submission, selectedStageId, selectedReviewRound}) {
		const StageTitles = {
			[pkp.const.WORKFLOW_STAGE_ID_SUBMISSION]: tk(
				'dashboard.stage.submission',
			),
			[pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW]: tk(
				'dashboard.stage.review',
			),
			[pkp.const.WORKFLOW_STAGE_ID_EDITING]: tk('dashboard.stage.copyediting'),
			[pkp.const.WORKFLOW_STAGE_ID_PRODUCTION]: tk(
				'dashboard.stage.production',
			),
		};

		if (selectedStageId) {
			return `${t('manager.workflow')}: ${t(StageTitles[selectedStageId])}`;
		}
		return 'ollaa';
	}

	function getPrimaryItems({
		submission,
		currentPublication,
		selectedStageId,
		selectedReviewRound,
	}) {
		//const activeStage = getActiveStage(submission);

		//const isSelectedStageActive = selectedStageId === activeStage.id;

		const items = [];

		if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
			if (
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				)
			) {
				items.push({
					component: 'PrimaryBasicMetadata',
					props: {
						body: t(
							'editor.submission.workflowDecision.submission.underReview',
						),
					},
				});
			}

			items.push({
				component: 'FileManager',
				props: {
					configName: 'SUBMISSION_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			// TODO refine not sure if there are different discussions in different stages
			items.push({
				component: 'DiscussionManager',
				props: {submissionId: submission.id, stageId: selectedStageId},
			});
		} else if (
			selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
		) {
			if (!selectedReviewRound) {
				return [
					{
						component: 'PrimaryBasicMetadata',
						props: {body: t('editor.review.notInitiated')},
					},
				];
			}
			const {getCurrentReviewRound} = useSubmission();

			const currentReviewRound = getCurrentReviewRound(
				submission,
				selectedStageId,
			);

			if (selectedReviewRound.round < currentReviewRound.round) {
				items.push({
					component: 'PrimaryBasicMetadata',
					props: {
						body: t(
							'editor.submission.workflowDecision.submission.reviewRound',
						),
					},
				});
			}

			if (selectedReviewRound.id === currentReviewRound.id) {
				items.push({
					component: 'ReviewRoundStatus',
					props: {reviewRound: selectedReviewRound},
				});
			}

			items.push({
				component: 'FileManager',
				props: {
					configName: 'WORKFLOW_REVIEW_REVISIONS',
					submission: submission,
					submissionStageId: submission.stageId,
					reviewRoundId: selectedReviewRound?.id,
				},
			});

			items.push({
				component: 'FileManager',
				props: {
					configName: 'EDITOR_REVIEW_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
					reviewRoundId: selectedReviewRound?.id,
				},
			});

			items.push({
				component: 'ReviewerManager',
				props: {
					submission: submission,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EDITING) {
			if (
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EDITING,
				)
			) {
				items.push({
					component: 'PrimaryBasicMetadata',
					props: {
						body: t('editor.submission.workflowDecision.submission.production'),
					},
				});
			}

			items.push({
				component: 'FileManager',
				props: {
					configName: 'FINAL_DRAFT_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});

			items.push({
				component: 'FileManager',
				props: {
					configName: 'COPYEDITED_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION) {
			items.push({
				component: 'FileManager',
				props: {
					configName: 'PRODUCTION_READY_FILES',
					submission: submission,
					submissionStageId: submission.stageId,
				},
			});

			items.push({
				component: 'DiscussionManager',
				props: {
					submissionId: submission.id,
					stageId: selectedStageId,
				},
			});
		}

		return items;
	}

	function getSecondaryItems({
		submission,
		selectedReviewRound,
		selectedStageId,
	}) {
		const items = [];
		// When review stage has not started, show no items
		if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW) {
			if (!selectedReviewRound) {
				return [];
			}
		}

		items.push({
			component: 'ParticipantManager',
			props: {
				submission,
				submissionStageId: submission.stageId,
			},
		});

		return items;
	}

	function getActionItems({submission, selectedStageId, selectedReviewRound}) {
		const items = [];

		if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_SUBMISSION) {
			if (
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				)
			) {
				return [];
			}

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.sendSubmissionForReview'),
					isPrimary: true,
					action: 'decisionExternalReview',
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.acceptAndSkipReview'),
					isSecondary: true,
					action: 'decisionSkipExternalReview',
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.declineSubmission'),
					isWarnable: true,
					action: 'decisionInitialDecline',
				},
			});
		} else if (
			selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW
		) {
			const {getCurrentReviewRound} = useSubmission();

			const currentReviewRound = getCurrentReviewRound(
				submission,
				selectedStageId,
			);

			// if review stage has not started show no items
			if (
				hasNotSubmissionStartedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				) ||
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EXTERNAL_REVIEW,
				) ||
				selectedReviewRound.round < currentReviewRound.round
			) {
				return [];
			}

			const actionArgs = {
				stageId: pkp.const.WORKFLOW_STAGE_ID_SUBMISSION,
				reviewRoundId: selectedReviewRound.id,
			};

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.requestRevisions'),
					isSecondary: true,
					action: 'requestRevisions',
					actionArgs,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.acceptSubmission'),
					action: 'decisionAccept',
					isPrimary: true,
					actionArgs,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: 'New Review Round',
					action: 'decisionNewExternalRound',
					actionArgs,
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.cancelReviewRound'),
					isWarnable: true,
					action: 'decisionCancelReviewRound',
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.declineSubmission'),
					isWarnable: true,
					action: 'decisionDecline',
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_EDITING) {
			if (
				hasNotSubmissionStartedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EDITING,
				) ||
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_EDITING,
				)
			) {
				return [];
			}

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.sendToProduction'),
					isPrimary: true,
					action: 'decisionSendToProduction',
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.cancelCopyEditing'),
					isWarnable: true,
					action: 'decisionBackFromCopyediting',
				},
			});
		} else if (selectedStageId === pkp.const.WORKFLOW_STAGE_ID_PRODUCTION) {
			if (
				hasNotSubmissionStartedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				) ||
				hasSubmissionPassedStage(
					submission,
					pkp.const.WORKFLOW_STAGE_ID_PRODUCTION,
				)
			) {
				return [];
			}

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.scheduleForPublication'),
					isPrimary: true,
					action: 'scheduleForPublication',
				},
			});

			items.push({
				component: 'ActionButton',
				props: {
					label: t('dashboard.summary.backToCopyediting'),
					isWarnable: true,
					action: 'decisionBackFromProduction',
				},
			});
		}
		return items;
	}

	return {getTitle, getPrimaryItems, getSecondaryItems, getActionItems};
}