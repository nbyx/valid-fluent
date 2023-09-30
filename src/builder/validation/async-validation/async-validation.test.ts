import { beforeEach, describe, expect, it } from "vitest";
import { createAsyncRule, createSyncRule } from "../../utils/validation.util";
import { AsyncValidation } from "./async-validation";
import { ValidationRule } from "../../../types/validation.types";

interface TestModel {
	field1: string;
	field2: number;
	field3: boolean;
}

// Define some validation rules
const validationRules = [
	createSyncRule<TestModel>({
		name: "field1",
		propertyName: "field1",
		errorMessage: "test error field 1",
		propGetter: (model) => model.field1,
		validators: [
			{
				validator: ({ value }) => value !== "",
				condition: () => true,
			},
		],
	}),
	createAsyncRule<TestModel>({
		name: "field2",
		propertyName: "field2",
		errorMessage: "field2 value should be less than 50",
		propGetter: (model) => model.field2,
		validators: [
			{
				validator: async ({ value }) => Promise.resolve((value as number) < 50),
				condition: () => true,
			},
		],
	}),
	createSyncRule<TestModel>({
		name: "field3",
		propertyName: "field3",
		errorMessage: "field3 must be true",
		propGetter: (model) => model.field3,
		validators: [
			{
				validator: ({ value }) => value === true,
				condition: () => true,
			},
		],
	}),
];

// Now set up the tests
describe("AsyncValidation", () => {
	let asyncValidation: AsyncValidation<TestModel>;

	beforeEach(() => {
		asyncValidation = new AsyncValidation<TestModel>(
			false,
			validationRules as ValidationRule<TestModel, unknown, unknown>[],
		);
	});

	it("should validate async rules and sync rules correctly", async () => {
		const testModel: TestModel = {
			field1: "test",
			field2: 10,
			field3: true,
		};

		const outcome = await asyncValidation.validateAsync(testModel);

		expect(outcome.isValid).toBe(true);
	});

	it("should stop at first invalid rule in failFast mode", async () => {
		asyncValidation = new AsyncValidation<TestModel>(
			true,
			validationRules as ValidationRule<TestModel, unknown, unknown>[],
		);

		const testModel: TestModel = {
			field1: "",
			field2: 10,
			field3: true,
		};

		const outcome = await asyncValidation.validateAsync(testModel);

		expect(outcome.isValid).toBe(false);
	});

	it("should handle mixed valid and invalid rules correctly with fail fast false", async () => {
		const testModel: TestModel = {
			field1: "",
			field2: 60,
			field3: true,
		};

		const outcome = await asyncValidation.validateAsync(testModel);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result.field1).toBeDefined();
			expect(outcome.result.field2).toBeDefined();
			expect(outcome.result.field3).toBeUndefined();
		}
	});
});
