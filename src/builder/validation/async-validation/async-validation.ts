import {
	ValidationOutcome,
	ValidationResult,
	ValidationRule,
} from "../../../types/validation.types";
import { BaseValidation } from "../base-validation/base-validation";
import { isNonEmptyObject } from "../../utils/misc.util";

export class AsyncValidation<ModelType> extends BaseValidation<ModelType> {
	public constructor(
		failFast: boolean,
		private readonly validationRules: ValidationRule<
			ModelType,
			unknown,
			unknown
		>[],
	) {
		super(failFast);
	}

	async validateAsync(state: ModelType): Promise<ValidationOutcome<ModelType>> {
		const abortController = new AbortController();
		const asyncValidators: Promise<ValidationOutcome<ModelType>>[] = [];
		let allValid = true;
		const syncResults: ValidationResult<ModelType>[] = [];

		for (const rule of this.validationRules) {
			if (rule.isAsync) {
				const createAsyncValidator = (
					rule: ValidationRule<ModelType, unknown, unknown>,
					state: ModelType,
					abortSignal: AbortSignal,
				): Promise<ValidationOutcome<ModelType>> => {
					return super.runValidatorsForRuleAsync(
						rule,
						state,
						(validator, args) => validator(args),
						abortSignal,
					) as Promise<ValidationOutcome<ModelType>>;
				};

				const asyncValidator = createAsyncValidator(
					rule,
					state,
					abortController.signal,
				);

				asyncValidators.push(asyncValidator);
				continue;
			}

			const syncOutcome = super.runValidatorsForRuleSync(
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

			if ("then" in syncOutcome) {
				throw new Error("Unexpected async validation in sync context");
			}

			if (isNonEmptyObject(syncOutcome.result)) {
				syncResults.push(syncOutcome.result);
			}

			if (!syncOutcome.isValid) {
				allValid = false;
				if (this.failFast) {
					return syncOutcome;
				}
			}
		}

		if (this.failFast && !allValid) {
			return {
				result: Object.assign({}, ...syncResults),
				isValid: false,
			};
		}

		if (this.failFast) {
			for (const asyncValidator of asyncValidators) {
				const asyncOutcome = await asyncValidator;
				if (isNonEmptyObject(asyncOutcome.result)) {
					syncResults.push(asyncOutcome.result);
				}

				if (!asyncOutcome.isValid) {
					return {
						result: Object.assign({}, ...syncResults),
						isValid: false,
					};
				}
			}
			return {
				result: Object.assign({}, ...syncResults),
				isValid: true,
			};
		}

		const asyncOutcomes = await Promise.allSettled(asyncValidators);
		const mergedAsyncOutcome = this.mergeOutcomes(asyncOutcomes);
		const mergedSyncResult = Object.assign({}, ...syncResults);

		// Merge the results and validity of sync and async validations
		const mergedResult = Object.assign(
			{},
			mergedSyncResult,
			mergedAsyncOutcome.result,
		);
		allValid = allValid && mergedAsyncOutcome.isValid;

		return {
			result: mergedResult,
			isValid: allValid,
		};
	}
}
