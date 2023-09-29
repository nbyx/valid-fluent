import { RuleAddedBuilder } from "./rule-added-builder";
import { describe, expect, test } from "vitest";
import { ValidationRule } from "../../../types/validation.types";

interface DummyModel {
	field1: string;
	field2: number;
}

const dummyRule1: ValidationRule<DummyModel, string, never> = {
	name: "field1",
	propertyName: "field1",
	propGetter: (model) => model.field1,
	validators: [{ validator: ({ value }) => value !== "" }],
	errorMessage: "Initial error message 1",
	isAsync: false,
};

const dummyRule2: ValidationRule<DummyModel, number, never> = {
	name: "field2",
	propertyName: "field2",
	propGetter: (model) => model.field2,
	validators: [{ validator: ({ value }) => value > 0 }],
	errorMessage: "Initial error message 2",
	isAsync: false,
};

const sharedState = {
	validationRules: [],
	currentFieldStartIndex: 0,
	currentAlias: null,
	failFast: true,
};

describe("RuleAddedBuilder class", () => {
	test("withMessage updates the last rule's error message", () => {
		const builder = new RuleAddedBuilder<DummyModel, string | number, never>({
			...sharedState,
			validationRules: [dummyRule1, dummyRule2] as ValidationRule<
				DummyModel,
				string | number,
				never
			>[],
		});
		const updatedBuilder = builder.withMessage("Updated error message");
		// rome-ignore lint: only for test
		const updatedRules = (updatedBuilder as any).sharedState.validationRules;

		expect(updatedRules[1].errorMessage).toBe("Updated error message");
	});

	test("withMessage does nothing when no rules are present", () => {
		const builder = new RuleAddedBuilder<DummyModel, string | number, never>(
			sharedState,
		);

		expect(() => builder.withMessage("Updated error message")).toThrow(
			"no rule was provided before calling withMessage"
		);
	});
});
