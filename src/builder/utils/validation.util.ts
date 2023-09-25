import {
	ValidationError,
	ValidationOutcome,
	ValidationResult,
	ValidationSuccess,
} from "../../types/validation.types";

type ValidationOutcomeArgs<ModelType> =
	| { isValid: true }
	| { isValid: false; result: ValidationResult<ModelType> };
export function createValidationOutcome<ModelType>(
	args: ValidationOutcomeArgs<ModelType>,
): ValidationOutcome<ModelType> {
	if (args.isValid)
		return { isValid: args.isValid, result: {} } as ValidationSuccess;

	return {
		isValid: args.isValid,
		result: args.result,
	} as ValidationError<ModelType>;
}
