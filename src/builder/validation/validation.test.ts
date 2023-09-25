import { describe, expect, test } from 'vitest';
import { Validation } from './validation';
import {ValidationRule} from "../../types/validation.types"; // Adjust the import to your project structure

interface UserModel {
    username: string;
    age: number;
    email?: string;
}

const usernameRule: ValidationRule<UserModel, string, never> = {
    name: 'username',
    propertyName: 'username',
    propGetter: (model) => model.username,
    validators: [
        {
            validator: ({ value }) => value !== '',
        },
    ],
    errorMessage: 'Username cannot be empty',
};

const ageRule: ValidationRule<UserModel, number, never> = {
    name: 'age',
    propertyName: 'age',
    propGetter: (model) => model.age,
    validators: [
        {
            validator: ({ value }) => value >= 18,
        },
    ],
    errorMessage: 'Must be 18 or older',
};

const mockRules: ValidationRule<UserModel, unknown, unknown>[] = [usernameRule, ageRule] as unknown as ValidationRule<UserModel, unknown, unknown>[];

interface AdvancedUserModel extends UserModel {
    password: string;
    confirmPassword: string;
}

// New Rule with dependent fields
const passwordRule: ValidationRule<AdvancedUserModel, string, string> = {
    name: 'password',
    propertyName: 'password',
    propGetter: (model) => model.password,
    dependentFieldGetter: (model) => model.confirmPassword,
    validators: [
        {
            validator: ({ value, dependentValue }) => value === dependentValue,
        },
    ],
    errorMessage: 'Passwords must match',
};


describe('Validation class', () => {
    test('constructor initializes correctly', () => {
        const validation = new Validation(true, mockRules);
        expect(validation).toBeTruthy();
    });

    test('validate returns allValid true when all rules are valid', () => {
        const validation = new Validation(false, mockRules);
        const model: UserModel = {
            username: 'JohnDoe',
            age: 30,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(true);
        expect(outcome.result).toEqual({});
    });

    test('validate returns allValid false when some rules are invalid', () => {
        const validation = new Validation(false, mockRules);
        const model: UserModel = {
            username: '',
            age: 30,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(false);
        expect(outcome.result).toHaveProperty('username');
    });

    test('validate respects failFast', () => {
        const validation = new Validation(true, mockRules);
        const model: UserModel = {
            username: '',
            age: 15,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(false);
        expect(outcome.result).toHaveProperty('username');
        expect(outcome.result).not.toHaveProperty('age');
    });

    test('validate handles empty rules array', () => {
        const validation = new Validation(false, []);
        const model: UserModel = {
            username: 'JohnDoe',
            age: 30,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(true);
        expect(outcome.result).toEqual({});
    });

    test('validate skips rule when propertyCondition is false', () => {
        const validation = new Validation(false, [
            {
                ...ageRule,
                propertyCondition: (model) => model.age > 100,
            },
        ] as ValidationRule<UserModel, unknown, unknown>[]);
        const model: UserModel = {
            username: 'JohnDoe',
            age: 30,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('age');
    });

    test('validate skips validator when condition is false', () => {
        const modifiedAgeRule = {
            ...ageRule,
            validators: [
                {
                    validator: ({ value } : { value: number }) => value < 18,
                    condition: (model: UserModel) => model.age > 100,
                },
            ],
        };
        const validation = new Validation(false, [usernameRule, modifiedAgeRule] as ValidationRule<UserModel, unknown, unknown>[]);
        const model: UserModel = {
            username: 'JohnDoe',
            age: 30,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('age');
    });

    test('validate returns allValid false when all rules are invalid', () => {
        const validation = new Validation(false, mockRules);
        const model: UserModel = {
            username: '',
            age: 15,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(false);
        expect(outcome.result).toHaveProperty('username');
        expect(outcome.result).toHaveProperty('age');
    });

    test('validate handles mixed conditions', () => {
        const modifiedAgeRule = {
            ...ageRule,
            validators: [
                {
                    validator: ({ value } : { value: number }) => value < 18,
                    condition: (model: UserModel) => model.age > 100,
                },
            ],
        };
        const validation = new Validation(false, [usernameRule, modifiedAgeRule] as ValidationRule<UserModel, unknown, unknown>[]);
        const model: UserModel = {
            username: '',
            age: 30,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(false);
        expect(outcome.result).toHaveProperty('username');
        expect(outcome.result).not.toHaveProperty('age');
    });

    test('validate handles dependent fields correctly', () => {
        const validation = new Validation(false, [passwordRule] as ValidationRule<UserModel, unknown, unknown>[]);
        const model: AdvancedUserModel = {
            username: 'JohnDoe',
            age: 30,
            password: '123',
            confirmPassword: '123',
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(true);
    });

    test('validate handles multiple validators for a single rule', () => {
        const multiValidatorRule: ValidationRule<UserModel, string, never> = {
            ...usernameRule,
            validators: [
                {
                    validator: ({ value }) => value !== '',
                },
                {
                    validator: ({ value }) => value.length >= 3,
                },
            ],
            errorMessage: 'Username must be at least 3 characters',
        };
        const validation = new Validation(false, [multiValidatorRule] as unknown as ValidationRule<UserModel, unknown, unknown>[]);
        const model: UserModel = {
            username: 'Jo',
            age: 30,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(false);
        expect(outcome.result).toHaveProperty('username');
    });

    test('validate handles dynamic error messages', () => {
        const dynamicMessageRule: ValidationRule<UserModel, number, never> = {
            ...ageRule,
            errorMessage: (model) => `Must be 18 or older, you are ${model.age}`,
        };
        const validation = new Validation(false, [dynamicMessageRule ] as unknown as ValidationRule<UserModel, unknown, unknown>[]);
        const model: UserModel = {
            username: 'JohnDoe',
            age: 17,
        };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.age.message).toBe('Must be 18 or older, you are 17');
    });

    test('validate does not mutate the input model', () => {
        const validation = new Validation(false, [usernameRule, ageRule] as unknown as ValidationRule<UserModel, unknown, unknown>[]);
        const model: UserModel = {
            username: 'JohnDoe',
            age: 30,
        };
        const originalModel = { ...model };
        validation.validate(model);
        expect(model).toEqual(originalModel);
    });
});