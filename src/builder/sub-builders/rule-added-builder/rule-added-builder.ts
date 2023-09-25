import {SharedBuilderState, ValidationRule} from "../../../types/validation.types";
import { CommonBuilder } from "../common-builder/common-builder";

export class RuleAddedBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled = false> {
	constructor(
		private readonly sharedState: SharedBuilderState<ModelType, FieldType, DependentFieldType, DependsOnCalled>
	) {}

	/**
	 * Adds an error message to the last validation rule
	 * @param errorMessage - A message that should be shown if there is a validation error
	 */
	withMessage(
		errorMessage: string | ((model: ModelType) => string),
	): CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled> {
		const lastRuleIndex = this.sharedState.validationRules.length - 1;
		if (lastRuleIndex >= 0) {
			const lastRule = { ...this.sharedState.validationRules[lastRuleIndex], errorMessage } as ValidationRule<ModelType, FieldType, DependentFieldType, DependsOnCalled>;
			const newValidationRules = [
				...this.sharedState.validationRules.slice(0, lastRuleIndex),
				lastRule,
			];

			return new CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled>(
				{
					...this.sharedState,
					validationRules: newValidationRules,
				}
			);
		}

		return new CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled>(
		this.sharedState
		);
	}
}
