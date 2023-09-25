import { ValidationRule } from "../../../types/validation.types";
import { CommonBuilder } from "../common-builder/common-builder";

export class RuleAddedBuilder<ModelType, FieldType, DependentFieldType> {
	constructor(
		private readonly failFast: boolean = true,
		private readonly validationRules: ReadonlyArray<
			ValidationRule<ModelType, FieldType, DependentFieldType>
		> = [],
	) {}

	/**
	 * Adds an error message to the last validation rule
	 * @param errorMessage - A message that should be shown if there is a validation error
	 */
	withMessage(
		errorMessage: string | ((model: ModelType) => string),
	): CommonBuilder<ModelType, FieldType, DependentFieldType> {
		const lastRuleIndex = this.validationRules.length - 1;
		if (lastRuleIndex >= 0) {
			const lastRule = { ...this.validationRules[lastRuleIndex], errorMessage } as ValidationRule<ModelType, FieldType, DependentFieldType>;
			const newValidationRules = [
				...this.validationRules.slice(0, lastRuleIndex),
				lastRule,
			];

			return new CommonBuilder<ModelType, FieldType, DependentFieldType>(
				this.failFast,
				newValidationRules,
			);
		}

		return new CommonBuilder<ModelType, FieldType, DependentFieldType>(
			this.failFast,
			this.validationRules,
		);
	}
}
