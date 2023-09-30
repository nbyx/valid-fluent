import { describe, expect, expectTypeOf, test } from "vitest";
import { ValidationBuilder } from "./builder/validation-builder";

type UserModel = {
	username: string;
	password: string;
	age: number;
	birthDate: Date;
	active: boolean;
};

describe("e2e-library-test", () => {
	test("should validate model with forField, addRule, and withMessage", () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField("username", (model) => model.username)
			.addRule(({ value }) => value !== "")
			.withMessage("Username cannot be empty");

		const validation = builder.build();
		const model = { username: "", password: "", active: true, birthDate: new Date(), age: 0 };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result.username.message).toBe("Username cannot be empty");
		}
	});

	test("should validate model with aliasAs", () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField("username", (model) => model.username)
			.aliasAs("user")
			.addRule(({ value }) => value !== "")
			.withMessage("Username cannot be empty");

		const validation = builder.build();
		const model = { username: "", password: "", active: true, age: 0, birthDate: new Date() };
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
		const model = { username: "user", password: "pass", active: true, age: 0, birthDate: new Date() };
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
		const model = { username: "", active: false, password: "", age: 0, birthDate: new Date() };
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
		const model = { username: "", password: "short", active: true, age: 0, birthDate: new Date() };
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
		const model = { username: "user", password: "pass", active: true, age: 0, birthDate: new Date() };
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

		let model = { username: "admin", password: "123", active: true, age: 0, birthDate: new Date() };
		let outcome = validation.validate(model);
		expect(outcome.isValid).toBe(true);

		model = { username: "user", password: "123", active: true, age: 0, birthDate: new Date() };
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
        const model = { username: 'user', password: 'pass', active: true, age: 0, birthDate: new Date() };
        const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result.password.propertyName).toBe('password');
			expect(outcome.result.password.message).toBe('Password must match username for some reason');
		}
    });

	test('should handle async validation rules correctly', async () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField('password', model => model.password)
			.dependsOn(model => model.username)
			.addRule(async ({ value, dependentValue }) => value === dependentValue)
			.withMessage('Password must match username for some reason');

		const validation = builder.build();
		const model = { username: 'user', password: 'pass', active: true, age: 0, birthDate: new Date() };
		const outcome = await validation.validateAsync(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result.password.propertyName).toBe('password');
			expect(outcome.result.password.message).toBe('Password must match username for some reason');
		}
	});

	test('should handle mixed sync and async validation rules correctly', async () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField('password', model => model.password)
			.dependsOn(model => model.username)
			.addRule(({ value }) => value !== '')  // Sync rule
			.withMessage('Password cannot be empty')
			.addRule(async ({ value, dependentValue }) => value === dependentValue)  // Async rule
			.withMessage('Password must match username for some reason');

		const validation = builder.build();
		const model = { username: 'user', password: 'user', active: true, age: 0, birthDate: new Date() };  // Now password matches username
		const outcome = await validation.validateAsync(model);

		expect(outcome.isValid).toBe(true);
	});

	test('should remain async if an async rule is added, then a sync rule', async () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField('password', model => model.password)
			.addRule(async ({ value }) => value.length > 0)
			.withMessage('test error message')
			.addRule(({ value }) => value !== 'password123')
			.withMessage('test error message 2');  // sync rule

		const validation = builder.build();
		const model = { password: 'password123', username: '123', active: false, age: 0, birthDate: new Date() };
		const outcome = await validation.validateAsync(model);

		expect(outcome.isValid).toBe(false);
	});

	test('should become async if a sync rule is added, then an async rule', async () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField('password', model => model.password)
			.addRule(({ value }) => value !== 'password123')
			.withMessage('test error message')// sync rule
			.addRule(async ({ value }) => value.length > 0)
			.withMessage('test error message 2');

		const validation = builder.build();
		const model = { password: 'password123', username: '123', active: false, age: 0, birthDate: new Date()  };
		const outcome = await validation.validateAsync(model);

		expect(outcome.isValid).toBe(false);
	});


	test('should validate UserModel password field', () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField('password', model => model.password)
			.isString()
			.withMessage('Password must be a string')
			.isUUID()
			.withMessage('Password must be a UUID');

		const validation = builder.build();
		const model = { password: 'password123', username: '123', active: false, age: 0, birthDate: new Date() };
		const outcome = validation.validate(model);
		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result).toHaveProperty('password');
			expect(outcome.result.password.message).toContain('Password must be a UUID');
		}
	});

	test('should validate UserModel active field', () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField('active', model => model.active)
			.isBoolean()
			.withMessage('Active must be a boolean');

		const validation = builder.build();
		const model = { password: 'password123', username: '123', active: 'false'as unknown as boolean, age: 0, birthDate: new Date() };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result).toHaveProperty('active');
			expect(outcome.result.active.message).toContain('Active must be a boolean');
		}
	});

	// Number Validation
	test('should validate UserModel age field', () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField('age', model => model.age)
			.isNumber()
			.withMessage('Age must be a number')
			.isPositive()
			.withMessage('Age must be positive');

		const validation = builder.build();
		const model = { password: 'password123', username: '123', active: false, age: -5, birthDate: new Date() };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result).toHaveProperty('age');
			expect(outcome.result.age.message).toContain('Age must be positive');
		}
	});

	// Date Validation
	test('should validate UserModel birthDate field', () => {
		const builder = ValidationBuilder.create<UserModel>()
			.forField('birthDate', model => model.birthDate)
			.isDate()
			.withMessage('BirthDate must be a date')
			.isPast()
			.withMessage('BirthDate must be in the past');

		const validation = builder.build();
		const model = { password: 'password123', username: '123', active: false, birthDate: new Date('2099-01-01'), age: 0 };
		const outcome = validation.validate(model);

		expect(outcome.isValid).toBe(false);
		if (!outcome.isValid) {
			expect(outcome.result).toHaveProperty('birthDate');
			expect(outcome.result.birthDate.message).toContain('BirthDate must be in the past');
		}
	});
});
