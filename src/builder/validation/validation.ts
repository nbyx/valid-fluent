import {
	ValidationOutcome,
	ValidationResult,
	ValidationRule,
	ValidatorArgs,
} from "../../types/validation.types";
import { createValidationOutcome } from "../utils/validation.util";
import { isNonEmptyObject } from "../utils/misc.util";

export class Validation<ModelType> {
	constructor(
		private readonly failFast: boolean,
		private readonly validationRules: ValidationRule<
			ModelType,
			unknown,
			unknown,
			false
		>[],
	) {}

	/**
	 *  Validates the state object
	 * @param state - The state to be validated
	 * @returns The ValidationOutcome based on the ModelType.
	 */
	validate(state: ModelType): ValidationOutcome<ModelType> {
		let allValid = true;
		const results: ValidationResult<ModelType>[] = [];

		for (const rule of this.validationRules) {
			const { isValid, result } = this.runValidatorsForRule(rule, state);
			allValid = allValid && isValid;

			if (isNonEmptyObject(result)) results.push(result);

			if (this.failFast && !isValid) break;
		}

		const result = Object.assign({}, ...results);

		return {
			result,
			isValid: allValid,
		};
	}

	private runValidatorsForRule(
		rule: ValidationRule<ModelType, unknown, unknown, false>,
		state: ModelType,
	): ValidationOutcome<ModelType> {
		if (rule.propertyCondition && !rule.propertyCondition(state))
			return createValidationOutcome({ isValid: true });

		let isValid = true;
		const result = {} as ValidationResult<ModelType>;

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

			const isResultValid = validator(
				validatorArgs as ValidatorArgs<ModelType, unknown, unknown, false>,
			);

			if (isResultValid) continue;

			isValid = false;
			const message =
				typeof rule.errorMessage === "function"
					? rule.errorMessage(state)
					: rule.errorMessage;

			result[rule.name] = {
				propertyName: rule.propertyName,
				message,
			};

			if (this.failFast) {
				return createValidationOutcome({ result, isValid: false });
			}
		}

		return createValidationOutcome({ result, isValid });
	}
}
