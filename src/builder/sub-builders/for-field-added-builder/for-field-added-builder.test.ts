import { beforeEach, describe, expect, test } from "vitest";
import { ForFieldAddedBuilder } from "./for-field-added-builder";
import { InitialBuilder } from "../initial-builder/initial-builder";
import { SharedBuilderState } from "../../../types/validation.types";

interface TestModel {
	field1: string;
	field2: number;
	field3: boolean;
}

describe("ForFieldAddedBuilder class", () => {
	let sharedState: SharedBuilderState<TestModel, unknown, unknown, false, false>;

	beforeEach(() => {
		sharedState = {
			validationRules: [],
			currentFieldStartIndex: 0,
			currentAlias: null,
			failFast: true,
		};
	});

	test("addRule without prior forField call", () => {
		expect(() => {
			new ForFieldAddedBuilder<TestModel, unknown, unknown>({
				validationRules: [],
				currentFieldStartIndex: 0,
				currentAlias: null,
				failFast: true,
			}).addRule(({ value }) => value !== "");
		}).toThrow(Error);
	});

	test("addRule with condition", () => {
		const builder = new InitialBuilder<TestModel, unknown, unknown>(sharedState)
			.forField("field1", (model) => model.field1)
			.addRule(
				({ value }) => value !== "",
				(model) => model.field1 !== "",
			)
			.withMessage("test error message");

		const validation = builder.build();
		const model = { field1: "test", field2: 10, field3: true };
		const result = validation.validate(model);

		expect(result.isValid).toBe(true);
	});



	test("aliasAs without prior forField call", () => {
		expect(() => {
			new ForFieldAddedBuilder<TestModel, unknown, unknown>(
				sharedState,
			).aliasAs("alias");
		}).toThrow(Error);
	});

	test("aliasAs changes property name", () => {
		const initialBuilder = new InitialBuilder<TestModel, unknown, unknown>(
			sharedState,
		);
		const builder = initialBuilder
			.forField("field1", (model) => model.field1)
			.aliasAs("alias")
			.addRule(({ value }) => value !== "")
			.withMessage("error message");

		const validation = builder.build();
		const model = { field1: "", field2: 10, field3: true };
		const result = validation.validate(model);
		expect(result.result).toHaveProperty("field1");
		expect(result.isValid).toBe(false);
		if (!result.isValid)
			expect(result.result.field1.propertyName).toBe("alias");
	});

	test("dependsOn without prior forField call", () => {
		expect(() => {
			new ForFieldAddedBuilder<TestModel, unknown, unknown>(
				sharedState,
			).dependsOn((model) => model.field2);
		}).toThrow(Error);
	});

	test("dependsOn sets dependentFieldGetter", () => {
		const initialBuilder = new InitialBuilder<TestModel>(sharedState);
		const builder = initialBuilder
			.forField("field1", (model) => model.field1)
			.dependsOn((model) => model.field2)
			.addRule(
				({ value, dependentValue }) => value !== dependentValue.toString(),
			)
			.withMessage("test error message");

		const validation = builder.build();
		const model = { field1: "10", field2: 10, field3: true };
		const result = validation.validate(model);
		expect(result.isValid).toBe(false);
	});

	test("when sets condition on last rule", () => {
		const builder = new InitialBuilder<TestModel, unknown, unknown>(sharedState)
			.forField("field2", (model) => model.field2)
			.addRule(({ value }) => value === 12)
			.withMessage("test error")
			.when((model) => model.field1 === "");
		// Assuming you have a build() method to finalize the builder
		const validation = builder.build();
		const model = { field1: "test", field2: 10, field3: true };
		const result = validation.validate(model);

		expect(result.isValid).toBe(true);
	});

	test("when with builderCallback", () => {
		const builder = new ForFieldAddedBuilder<TestModel, unknown, unknown>(
			sharedState,
		).when(
			(model) => model.field1 !== "",
			(subBuilder) => {
				return subBuilder
					.forField("field1", (model) => model.field1)
					.addRule(({ value }) => value !== "")
					.withMessage("test error");
			},
		);
		// Assuming you have a build() method to finalize the builder
		const validation = builder.build();
		const model = { field1: "test", field2: 10, field3: true };
		const result = validation.validate(model);

		expect(result.isValid).toBe(true);
	});
});
