import { describe, expect, beforeEach, test } from "vitest";
import { SharedBuilderState } from "../../../types/validation.types";
import { InitialBuilder } from "./initial-builder";

interface TestModel {
	field1: string;
	field2: number;
	field3: boolean;
}

describe("InitialBuilder", () => {
	let sharedState: SharedBuilderState<TestModel, unknown, unknown, false>;

	beforeEach(() => {
		sharedState = {
			validationRules: [],
			currentFieldStartIndex: 0,
			currentAlias: null,
			failFast: true,
		};
	});

	test("forField adds a new rule", () => {
		const initialBuilder = new InitialBuilder<
			TestModel,
			unknown,
			unknown,
			false
		>(sharedState);
		const forFieldAddedBuilder = initialBuilder.forField(
			"field1",
			(model) => model.field1,
		);
		// rome-ignore lint: only for test
		const internalState = (forFieldAddedBuilder as any).sharedState;

		expect(internalState.validationRules.length).toBe(1);
		expect(internalState.validationRules[0].name).toBe("field1");
	});

	test("forField sets currentFieldStartIndex", () => {
		const builder = new InitialBuilder<TestModel, unknown, unknown, false>(
			sharedState,
		);
		builder.forField("field1", (model) => model.field1);

		expect(sharedState.currentFieldStartIndex).toBe(0);
	});
});
