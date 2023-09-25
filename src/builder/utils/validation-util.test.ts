import { describe, expect, test } from "vitest";
import { createValidationOutcome } from "./validation.util";
import { ValidationResult } from "../../types/validation.types"; // Adjust the import to your project structure

interface DummyModel {
	field1: string;
	field2: number;
}

describe("Validation Util", () => {
	test("createValidationOutcome returns ValidationSuccess when isValid is true", () => {
		const outcome = createValidationOutcome<DummyModel>({ isValid: true });
		expect(outcome.isValid).toBe(true);
		expect(outcome.result).toEqual({});
	});

	test("createValidationOutcome returns ValidationError when isValid is false", () => {
		const validationResult: ValidationResult<DummyModel> = {
			field1: {
				propertyName: "field1",
				message: "Error message 1",
			},
			field2: {
				propertyName: "field2",
				message: "Error message 2",
			},
		};

		const outcome = createValidationOutcome<DummyModel>({
			isValid: false,
			result: validationResult,
		});
		expect(outcome.isValid).toBe(false);
		expect(outcome.result).toEqual(validationResult);
	});
});
