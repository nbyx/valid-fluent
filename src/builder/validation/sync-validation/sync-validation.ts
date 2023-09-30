import {
	ValidationOutcome,
	ValidationResult,
	ValidationRule,
} from "../../../types/validation.types";
import { isNonEmptyObject } from "../../utils/misc.util";
import { BaseValidation } from "../base-validation/base-validation";

export class SyncValidation<ModelType> extends BaseValidation<ModelType> {
	constructor(
		failFast: boolean,
		private readonly validationRules: ValidationRule<
			ModelType,
			unknown,
			unknown
		>[],
	) {
		super(failFast);
	}

	/**
	 *  Validates the state object
	 * @param state - The state to be validated
	 * @returns The ValidationOutcome based on the ModelType.
	 */
	validate(state: ModelType): ValidationOutcome<ModelType> {
		let allValid = true;
		const results: ValidationResult<ModelType>[] = [];

		for (const rule of this.validationRules) {
			if (rule.isAsync)
				throw new Error("Unexpected async validation in sync context");

			const { isValid, result } = this.runValidators(rule, state);
			allValid = allValid && isValid;
			if (isNonEmptyObject(result)) results.push(result);
			if (this.failFast && !isValid) break;
		}

		const result = Object.assign({}, ...results);
		return { result, isValid: allValid };
	}

	private runValidators(
		rule: ValidationRule<ModelType, unknown, unknown>,
		state: ModelType,
	): ValidationOutcome<ModelType> {
		const outcome = super.runValidatorsForRuleSync(
			rule,
			state,
			(validator, args) => {
				const result = validator(args);
				if (result instanceof Promise) {
					throw new Error("Async validator detected in a sync context");
				}
				return result;
			},
		);

		if ("then" in outcome) {
			throw new Error("Async validator detected in a sync context");
		}

		return outcome;
	}
}
