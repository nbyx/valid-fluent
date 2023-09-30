import {
	SharedBuilderState, SharedStateFieldType,
	ValidationRule,
} from "../../../types/validation.types";
import { getBuilderInstance } from "../../utils/builder-instance.util";
import type {BuilderType} from "../../../types/builder.type";

export class RuleAddedBuilder<
	ModelType,
	FieldType,
	DependentFieldType,
	DependsOnCalled extends boolean = false,
	IsAsync extends boolean = false,
	CurrentType extends SharedStateFieldType | null = null
> {
	constructor(
		private readonly sharedState: SharedBuilderState<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			CurrentType
		>,
	) {}

	/**
	 * Adds an error message to the last validation rule
	 * @param errorMessage - A message that should be shown if there is a validation error
	 */
	withMessage(
		errorMessage: string | ((model: ModelType) => string),
	): BuilderType<CurrentType, ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync> {
		const lastRuleIndex = this.sharedState.validationRules.length - 1;
		if (lastRuleIndex === -1) throw new Error('no rule was provided before calling withMessage');

		const lastRule = {
			...this.sharedState.validationRules[lastRuleIndex],
			errorMessage,
		} as ValidationRule<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
		const newValidationRules = [
			...this.sharedState.validationRules.slice(0, lastRuleIndex),
			lastRule,
		] as ValidationRule<ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync>[];

		const newSharedState = {...this.sharedState, validationRules: newValidationRules }

		return getBuilderInstance<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync, CurrentType>(newSharedState);
	}
}
