import {
	ValidationError,
	ValidationOutcome,
	ValidationResult,
	ValidationRule,
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

export function createSyncRule<
	ModelType,
	FieldValue = unknown,
	DependentValueType = unknown,
>(
	rule: Omit<
		ValidationRule<ModelType, FieldValue, DependentValueType, false, false>,
		"isAsync"
	>,
): ValidationRule<ModelType, FieldValue, DependentValueType, false, false> {
	return { ...rule, isAsync: false };
}

export function createAsyncRule<
	ModelType,
	FieldValue = unknown,
	DependentValueType = unknown,
>(
	rule: Omit<
		ValidationRule<ModelType, FieldValue, DependentValueType, false, true>,
		"isAsync"
	>,
): ValidationRule<ModelType, FieldValue, DependentValueType, false, true> {
	return { ...rule, isAsync: true };
}
