import {
	ValidationOutcome,
	ValidationResult,
	ValidationRule,
} from "../../types/validation.types";
import { createValidationOutcome } from "../utils/validation.util";

export class Validation<ModelType> {
	constructor(
		private readonly failFast: boolean,
		private readonly validationRules: ValidationRule<
			ModelType,
			unknown,
			unknown
		>[],
	) {}

	/**
	 *  Validates the state object
	 * @param state - The state to be validated
	 * @returns The ValidationOutcome based on the ModelType.
	 */
	validate(state: ModelType): ValidationOutcome<ModelType> {
		const { allValid, results } = this.validationRules.reduce((acc, rule) => {
			const { isValid, result } = this.runValidatorsForRule(rule, state);
			return {
				allValid: acc.allValid && isValid,
				results: [...acc.results, result],
			}
		}, { allValid: true, results: [] as ValidationResult<ModelType>[] });

		const result = Object.assign({}, ...results);

		return {
			result,
			isValid: allValid,
		};
	}

	private runValidatorsForRule(
		rule: ValidationRule<ModelType, unknown, unknown>,
		state: ModelType,
	): ValidationOutcome<ModelType> {
		if (rule.propertyCondition && !rule.propertyCondition(state))
			return createValidationOutcome({}, true);

		let isValid = true;
		const result: ValidationResult<ModelType> = {};

		const value = rule.propGetter(state);
		const dependentValue = rule.dependentFieldGetter
			? rule.dependentFieldGetter(state)
			: undefined;

		const validatorArgs = {
			model: state,
			value,
			dependentValue,
		};

		for (const { validator, condition } of rule.validators) {
			if (condition && !condition(state)) continue;

			const isResultValid = validator(validatorArgs);

			if (isResultValid) continue;

			isValid = false;
			result[rule.name] = {
				propertyName: rule.propertyName,
				message: rule.errorMessage,
			};

			if (this.failFast) {
				return createValidationOutcome(result, false);
			}
		}

		return createValidationOutcome(result, isValid);
	}
}
