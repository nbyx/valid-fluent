import { describe, expect, test } from "vitest";
import { SyncValidation } from "./sync-validation";
import { ValidationRule } from "../../../types/validation.types";

interface UserModel {
	username: string;
	age: number;
	email?: string;
}

const usernameRule: ValidationRule<UserModel, string, never> = {
	name: "username",
	propertyName: "username",
	propGetter: (model) => model.username,
	validators: [
		{
			validator: ({ value }) => value !== "",
		},
	],
	errorMessage: "Username cannot be empty",
	isAsync: false,
};

const ageRule: ValidationRule<UserModel, number, never> = {
	name: "age",
	propertyName: "age",
	propGetter: (model) => model.age,
	validators: [
		{
			validator: ({ value }) => value >= 18,
		},
	],
	errorMessage: "Must be 18 or older",
	isAsync: false,
};

const mockRules: ValidationRule<UserModel, unknown, unknown>[] = [
	usernameRule,
	ageRule,
] as unknown as ValidationRule<UserModel, unknown, unknown>[];

interface AdvancedUserModel extends UserModel {
	password: string;
	confirmPassword: string;
}

// New Rule with dependent fields
const passwordRule: ValidationRule<AdvancedUserModel, string, string> = {
	name: "password",
	propertyName: "password",
	propGetter: (model) => model.password,
	dependentFieldGetter: (model) => model.confirmPassword,
	validators: [
		{
			validator: ({ value, dependentValue }) => value === dependentValue,
		},
	],
	errorMessage: "Passwords must match",
	isAsync: false,
};

describe("Validation class", () => {
	test("constructor initializes correctly", () => {
		const validation = new SyncValidation(true, mockRules);
		expect(validation).toBeTruthy();
	});

	test("validate returns allValid true when all rules are valid", () => {
		const validation = new SyncValidation(false, mockRules);
		const model: UserModel = {
			username: "JohnDoe",
			age: 30,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(true);
		expect(result.result).toEqual({});
	});

	test("validate returns allValid false when some rules are invalid", () => {
		const validation = new SyncValidation(false, mockRules);
		const model: UserModel = {
			username: "",
			age: 30,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(false);
		expect(result.result).toHaveProperty("username");
	});

	test("validate respects failFast", () => {
		const validation = new SyncValidation(true, mockRules);
		const model: UserModel = {
			username: "",
			age: 15,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(false);
		expect(result.result).toHaveProperty("username");
		expect(result.result).not.toHaveProperty("age");
	});

	test("validate handles empty rules array", () => {
		const validation = new SyncValidation(false, []);
		const model: UserModel = {
			username: "JohnDoe",
			age: 30,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(true);
		expect(result.result).toEqual({});
	});

	test("validate skips rule when propertyCondition is false", () => {
		const validation = new SyncValidation(false, [
			{
				...ageRule,
				propertyCondition: (model) => model.age > 100,
			},
		] as ValidationRule<UserModel, unknown, unknown, false>[]);
		const model: UserModel = {
			username: "JohnDoe",
			age: 30,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(true);
		expect(result.result).not.toHaveProperty("age");
	});

	test("validate skips validator when condition is false", () => {
		const modifiedAgeRule = {
			...ageRule,
			validators: [
				{
					validator: ({ value }: { value: number }) => value < 18,
					condition: (model: UserModel) => model.age > 100,
				},
			],
		};
		const validation = new SyncValidation(false, [
			usernameRule,
			modifiedAgeRule,
		] as ValidationRule<UserModel, unknown, unknown, false>[]);
		const model: UserModel = {
			username: "JohnDoe",
			age: 30,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(true);
		expect(result.result).not.toHaveProperty("age");
	});

	test("validate returns allValid false when all rules are invalid", () => {
		const validation = new SyncValidation(false, mockRules);
		const model: UserModel = {
			username: "",
			age: 15,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(false);
		expect(result.result).toHaveProperty("username");
		expect(result.result).toHaveProperty("age");
	});

	test("validate handles mixed conditions", () => {
		const modifiedAgeRule = {
			...ageRule,
			validators: [
				{
					validator: ({ value }: { value: number }) => value < 18,
					condition: (model: UserModel) => model.age > 100,
				},
			],
		};
		const validation = new SyncValidation(false, [
			usernameRule,
			modifiedAgeRule,
		] as ValidationRule<UserModel, unknown, unknown, false>[]);
		const model: UserModel = {
			username: "",
			age: 30,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(false);
		expect(result.result).toHaveProperty("username");
		expect(result.result).not.toHaveProperty("age");
	});

	test("validate handles dependent fields correctly", () => {
		const validation = new SyncValidation(false, [
			passwordRule,
		] as ValidationRule<UserModel, unknown, unknown, false>[]);
		const model: AdvancedUserModel = {
			username: "JohnDoe",
			age: 30,
			password: "123",
			confirmPassword: "123",
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(true);
	});

	test("validate handles multiple validators for a single rule", () => {
		const multiValidatorRule: ValidationRule<UserModel, string, never, false> =
			{
				...usernameRule,
				validators: [
					{
						validator: ({ value }) => value !== "",
					},
					{
						validator: ({ value }) => value.length >= 3,
					},
				],
				errorMessage: "Username must be at least 3 characters",
			};
		const validation = new SyncValidation(false, [
			multiValidatorRule,
		] as unknown as ValidationRule<UserModel, unknown, unknown, false>[]);
		const model: UserModel = {
			username: "Jo",
			age: 30,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(false);
		expect(result.result).toHaveProperty("username");
	});

	test("validate handles dynamic error messages", () => {
		const dynamicMessageRule: ValidationRule<UserModel, number, never, false> =
			{
				...ageRule,
				errorMessage: (model) => `Must be 18 or older, you are ${model.age}`,
			};
		const validation = new SyncValidation(false, [
			dynamicMessageRule,
		] as unknown as ValidationRule<UserModel, unknown, unknown, false>[]);
		const model: UserModel = {
			username: "JohnDoe",
			age: 17,
		};
		const result = validation.validate(model);

		expect(result.isValid).toBe(false);
		if (!result.isValid)
			expect(result.result.age.message).toBe("Must be 18 or older, you are 17");
	});

	test("validate does not mutate the input model", () => {
		const validation = new SyncValidation(false, [
			usernameRule,
			ageRule,
		] as unknown as ValidationRule<UserModel, unknown, unknown, false>[]);
		const model: UserModel = {
			username: "JohnDoe",
			age: 30,
		};
		const originalModel = { ...model };
		validation.validate(model);
		expect(model).toEqual(originalModel);
	});
});
