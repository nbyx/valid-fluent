import { ValidationResult } from "../../types/validation.types";

export function createValidationOutcome<ModelType>(
	validationResult: ValidationResult<ModelType>,
	isValid: boolean,
) {
	return { result: validationResult, isValid };
}
