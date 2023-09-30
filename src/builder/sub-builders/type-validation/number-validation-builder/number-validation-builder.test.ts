import { expect, describe, test } from 'vitest';
import {ValidationBuilder} from "../../../validation-builder";
interface UserModel {
    salary: number;
    debt: number;
    age: number;
    rating: number;
    score: number;
    balance: number;
}

describe('NumberValidationBuilder', () => {
    test('should validate range', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('salary', model => model.salary)
            .isNumber()
            .withMessage('is not a number')
            .range(30000, 100000)
            .withMessage('Salary must be between 30000 and 100000');

        const validation = builder.build();
        const model = { salary: 50000, debt: 0, age: 0, rating: 0, score: 0, balance: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('salary');
    });

    test('should validate isPositive', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('salary', model => model.salary)
            .isNumber()
            .withMessage('is not a number')
            .isPositive()
            .withMessage('Salary must be positive');

        const validation = builder.build();
        const model = { salary: 30000, debt: 0, age: 0, rating: 0, score: 0, balance: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('salary');
    });

    test('should validate isNegative', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('debt', model => model.debt)
            .isNumber()
            .withMessage('is not a number')
            .isNegative()
            .withMessage('Debt must be negative');

        const validation = builder.build();
        const model = { salary: 0, age: 0, debt: -5000 , rating: 0, score: 0, balance: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('debt');
    });

    test('should validate isInteger', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('age', model => model.age)
            .isNumber()
            .withMessage('is not a number')
            .isInteger()
            .withMessage('Age must be an integer');

        const validation = builder.build();
        const model = { age: 25, rating: 0, score: 0, balance: 0, salary: 0, debt: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('age');
    });

    test('should validate isOdd', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('age', model => model.age)
            .isNumber()
            .withMessage('is not a number')
            .isOdd()
            .withMessage('Age must be an odd number');

        const validation = builder.build();
        const model = { age: 25, rating: 0, score: 0, balance: 0, salary: 0, debt: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('age');
    });

    test('should validate isNegative', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('debt', model => model.debt)
            .isNumber()
            .withMessage('is not a number')
            .isNegative()
            .withMessage('Debt must be negative');

        const validation = builder.build();
        const model = { debt: -5000, rating: 0, score: 0, balance: 0, salary: 0, age: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('debt');
    });

    test('should validate isInteger', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('age', model => model.age)
            .isNumber()
            .withMessage('is not a number')
            .isInteger()
            .withMessage('Age must be an integer');

        const validation = builder.build();
        const model = { age: 25, debt: -5000, rating: 0, score: 0, balance: 0, salary: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('age');
    });

    test('should validate isDecimal', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('rating', model => model.rating)
            .isNumber()
            .withMessage('is not a number')
            .isDecimal()
            .withMessage('Rating must be a decimal number');

        const validation = builder.build();
        const model = { rating: 4.5, age: 25, debt: -5000, score: 0, balance: 0, salary: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('rating');
    });

    test('should validate greaterThan', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('score', model => model.score)
            .isNumber()
            .withMessage('is not a number')
            .greaterThan(50)
            .withMessage('Score must be greater than 50');

        const validation = builder.build();
        const model = { score: 75, age: 25, debt: -5000, rating: 0, balance: 0, salary: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('score');
    });

    test('should validate lessThan', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('score', model => model.score)
            .isNumber()
            .withMessage('is not a number')
            .lessThan(100)
            .withMessage('Score must be less than 100');

        const validation = builder.build();
        const model = { score: 75,age: 25, debt: -5000, rating: 0, balance: 0, salary: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('score');
    });

    test('should validate between', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('score', model => model.score)
            .isNumber()
            .withMessage('is not a number')
            .between(50, 100)
            .withMessage('Score must be between 50 and 100');

        const validation = builder.build();
        const model = { score: 75,age: 25, debt: -5000, rating: 0,  balance: 0, salary: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('score');
    });

    test('should validate isZero', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('balance', model => model.balance)
            .isNumber()
            .withMessage('is not a number')
            .isZero()
            .withMessage('Balance must be zero');

        const validation = builder.build();
        const model = { balance: 0,age: 25, debt: -5000, rating: 0, score: 0, salary: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('balance');
    });

    test('should validate notZero', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('balance', model => model.balance)
            .isNumber()
            .withMessage('is not a number')
            .notZero()
            .withMessage('Balance must not be zero');

        const validation = builder.build();
        const model = { balance: 10,age: 25, debt: -5000, rating: 0, score: 0, salary: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('balance');
    });

    test('should validate isEven', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('age', model => model.age)
            .isNumber()
            .withMessage('is not a number')
            .isEven()
            .withMessage('Age must be an even number');

        const validation = builder.build();
        const model = { age: 26, debt: -5000, rating: 0, score: 0, balance: 0, salary: 0 };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('age');
    });
});