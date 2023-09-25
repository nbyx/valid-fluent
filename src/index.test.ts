import { describe, expect, expectTypeOf, test } from "vitest";
import { ValidationBuilder } from "./index";
import { InitialBuilder } from "./builder/sub-builders/initial-builder/initial-builder"; // Adjust the import to your project structure
import {
	ValidatorArgs,
	Validator,
	NestedPropGetter,
	ValidationRule,
	ValidationOutcome,
	ValidationResult,
} from "./index";
import { BuilderValidator } from "./types/validation.types"; // Adjust the import to your project structure

type UserModel = {
	id: string;
	name: string;
	age: number;
};

describe("Index", () => {
	test("ValidationBuilder is exported", () => {
		expect(ValidationBuilder).toBeDefined();
	});

	test("ValidationBuilder has a static create method", () => {
		expect(typeof ValidationBuilder.create).toBe("function");
	});

	test("ValidationBuilder.create returns an InitialBuilder instance", () => {
		const builder = ValidationBuilder.create();
		expect(builder).toBeInstanceOf(InitialBuilder); // Import InitialBuilder as needed
	});

	test("ValidatorArgs is a type with expected shape", () => {
		type TestType = ValidatorArgs<UserModel, string, number, true>;
		expectTypeOf<TestType>().toHaveProperty("model");
		expectTypeOf<TestType["model"]>().toMatchTypeOf<UserModel>();
		expectTypeOf<TestType>().toHaveProperty("value");
		expectTypeOf<TestType["value"]>().toMatchTypeOf<string>();
		expectTypeOf<TestType>().toHaveProperty("dependentValue");
		expectTypeOf<TestType["dependentValue"]>().toMatchTypeOf<number>();
	});

	test("Validator is a type with expected shape", () => {
		expectTypeOf<Validator<UserModel, string, number, true>>().toBeFunction();
		expectTypeOf<Validator<UserModel, string, number, true>>()
			.parameter(0)
			.toMatchTypeOf<ValidatorArgs<UserModel, string, number, true>>();
		expectTypeOf<
			ReturnType<Validator<UserModel, string, number, true>>
		>().toBeBoolean();
	});

	test("NestedPropGetter is a type with expected shape", () => {
		expectTypeOf<NestedPropGetter<UserModel, string>>().toBeFunction();
		expectTypeOf<NestedPropGetter<UserModel, string>>().toMatchTypeOf<
			(model: UserModel) => string
		>();
	});

	test("Validator return type is boolean", () => {
		type TestType = ReturnType<Validator<UserModel, string, number, true>>;
		expectTypeOf<TestType>().toBeBoolean();
	});

	test("NestedPropGetter return type is PropType", () => {
		type TestType = ReturnType<NestedPropGetter<UserModel, string>>;
		expectTypeOf<TestType>().toBeString();
	});

	test("ValidationRule is a type with expected shape", () => {
		type TestType = ValidationRule<UserModel, string, number, true>;
		expectTypeOf<TestType["name"]>().toMatchTypeOf<keyof UserModel>();
		expectTypeOf<TestType["propGetter"]>().toBeFunction();
		expectTypeOf<TestType["validators"]>().toMatchTypeOf<
			BuilderValidator<UserModel, string, number, true>[]
		>();
		expectTypeOf<TestType["propertyCondition"]>().toMatchTypeOf<
			((model: UserModel) => boolean) | undefined
		>();
		expectTypeOf<TestType["errorMessage"]>().toMatchTypeOf<
			string | ((model: UserModel) => string)
		>();
		expectTypeOf<TestType["propertyName"]>().toMatchTypeOf<string>();
	});

	test("ValidationOutcome is a type with expected shape", () => {
		type TestType = ValidationOutcome<UserModel>;
		expectTypeOf<TestType>().toHaveProperty("isValid");
		expectTypeOf<TestType["isValid"]>().toBeBoolean();
		expectTypeOf<TestType>().toHaveProperty("result");
		expectTypeOf<TestType["result"]>().toMatchTypeOf<
			ValidationResult<UserModel> | {}
		>();
	});

	test("ValidationResult has expected shape", () => {
		type TestType = ValidationResult<{ field1: string; field2: number }>;
		expectTypeOf<TestType>().toMatchTypeOf({
			field1: {
				propertyName: expect.any(String),
				message: expect.any(String),
			},
			field2: {
				propertyName: expect.any(String),
				message: expect.any(String),
			},
		});
	});
});
