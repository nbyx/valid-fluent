import { describe, expect, expectTypeOf, test } from "vitest";
import { ValidationBuilder } from "./builder/validation-builder";

type UserModel = {
	username: string;
	password: string;
	active: boolean;
};

describe("e2e-library-test", () => {
	test("should validate model with forField, addRule, and withMessage", () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField("username", (model) => model.username)
			.addRule(({ value }) => value !== "")
			.withMessage("Username cannot be empty");

		const validation = builder.build();
		const model = { username: "", password: "", active: true };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid)
			expect(outcome.result.username.message).toBe("Username cannot be empty");
	});

	test("should validate model with aliasAs", () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField("username", (model) => model.username)
			.aliasAs("user")
			.addRule(({ value }) => value !== "")
			.withMessage("Username cannot be empty");

		const validation = builder.build();
		const model = { username: "", password: "", active: true };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result.username.message).toBe("Username cannot be empty");
			expect(outcome.result.username.propertyName).toBe("user");
		}
	});

	test("should validate model with dependsOn", () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField("password", (model) => model.password)
			.dependsOn((model) => model.username)
			.addRule(({ value, dependentValue }) => {
				expectTypeOf(value).toBeString();
				expectTypeOf(dependentValue).toBeString();

				return value === dependentValue;
			})
			.withMessage("Password must match username for some reason");

		const validation = builder.build();
		const model = { username: "user", password: "pass", active: true };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid)
			expect(outcome.result.password.message).toBe(
				"Password must match username for some reason",
			);
	});

	test("should validate model with when", () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField("username", (model) => model.username)
			.addRule(({ value }) => value !== "")
			.withMessage("Username cannot be empty")
			.when((model) => model.active);

		const validation = builder.build();
		const model = { username: "", active: false, password: "" };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(true);
	});

	test("should validate model with multiple fields and rules", () => {
		const builder = ValidationBuilder.create<UserModel>(false)
			.forField("username", (model) => model.username)
			.addRule(({ value }) => value !== "")
			.withMessage("Username cannot be empty")
			.forField("password", (model) => model.password)
			.addRule(({ value }) => value.length >= 8)
			.withMessage("Password must be at least 8 characters");

		const validation = builder.build();
		const model = { username: "", password: "short", active: true };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result.username.message).toBe("Username cannot be empty");
			expect(outcome.result.password.message).toBe(
				"Password must be at least 8 characters",
			);
		}
	});

	test("should validate model with dependencies between fields", () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField("password", (model) => model.password)
			.dependsOn((model) => model.username)
			.addRule(({ value, dependentValue }) => value === dependentValue)
			.withMessage("Password must match username for some reason");

		const validation = builder.build();
		const model = { username: "user", password: "pass", active: true };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid)
			expect(outcome.result.password.message).toBe(
				"Password must match username for some reason",
			);
	});

	test("should validate model with when() and builderCallback", () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField("username", (model) => model.username)
			.addRule(({ value }) => value !== "")
			.withMessage("Username cannot be empty")
			.when(
				(model) => model.username !== "admin",
				(builder) =>
					builder
						.forField("password", (model) => model.password)
						.addRule(({ value }) => value.length >= 8)
						.withMessage("Password must be at least 8 characters long"),
			);

		const validation = builder.build();

		let model = { username: "admin", password: "123", active: true };
		let outcome = validation.validate(model);
		expect(outcome.isValid).toBe(true);

		model = { username: "user", password: "123", active: true };
		outcome = validation.validate(model);
		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid)
			expect(outcome.result.password.message).toBe(
				"Password must be at least 8 characters long",
			);
	});

    test('should set propertyName correctly when using addRule after dependsOn', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .dependsOn(model => model.username)
            .addRule(({ value, dependentValue }) => value === dependentValue)
            .withMessage('Password must match username for some reason');

        const validation = builder.build();
        const model = { username: 'user', password: 'pass', active: true };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid) {
            expect(outcome.result.password.propertyName).toBe('password');
            expect(outcome.result.password.message).toBe('Password must match username for some reason');
        }
    });
});
