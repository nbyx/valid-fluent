import {describe, expect, test} from "vitest";
import {ValidationBuilder} from "../../../validation-builder";

describe('StringValidationBuilder', () => {
    type UserModel = {
        username: string;
        email: string;
        password: string;
        website: string;
        id: string;
    };

    test('should validate maxLength', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('username', model => model.username)
            .isString()
            .withMessage('is not a string')
            .maxLength(10)
            .withMessage('Username must be at most 10 characters');

        const validation = builder.build();
        const model = { username: 'john_doe123', email: '', password: '', website: '', id: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.username.message).toBe('Username must be at most 10 characters');
    });

    test('should validate minLength', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .isString()
            .withMessage('is not a string')
            .minLength(8)
            .withMessage('Password must be at least 8 characters');

        const validation = builder.build();
        const model = { password: 'pass', username: 'john_doe123', email: '', website: '', id: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
            expect(outcome.result.password.message).toBe('Password must be at least 8 characters');
    });

    test('should validate isEmail', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('email', model => model.email)
            .isString()
            .withMessage('is not a string')
            .isEmail()
            .withMessage('Email is not valid');

        const validation = builder.build();
        const model = { email: 'john_doe', username: 'john_doe123', password: '', website: '', id: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
            expect(outcome.result.email.message).toBe('Email is not valid');

    });

    test('should validate isUUID', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('id', model => model.id)
            .isString()
            .withMessage('is not a string')
            .isUUID()
            .withMessage('ID must be a valid UUID');

        const validation = builder.build();
        const model = { id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '', password: '', website: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('id');

    });

    test('should validate isNumeric', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .isString()
            .withMessage('is not a string')
            .isNumeric()
            .withMessage('Field must be numeric');

        const validation = builder.build();
        const model = { id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '', password: '123a', website: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.password.message).toBe('Field must be numeric');
    });

    test('should validate matches', () => {
        const pattern = /^[a-z]+$/;
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .isString()
            .withMessage('is not a string')
            .matches(pattern)
            .withMessage('Field must match pattern');

        const validation = builder.build();
        const model = { password: '123abc', id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '', website: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.password.message).toBe('Field must match pattern');
    });

    test('should validate hasCapitalLetter', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .isString()
            .withMessage('is not a string')
            .hasCapitalLetter()
            .withMessage('Password must have at least one capital letter');

        const validation = builder.build();
        const model = { password: 'password123', date: '2022-09-30T15:30:00', id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '', website: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.password.message).toBe('Password must have at least one capital letter');
    });

    test('should validate hasLowercaseLetter', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .isString()
            .withMessage('is not a string')
            .hasLowercaseLetter()
            .withMessage('Password must have at least one lowercase letter');

        const validation = builder.build();
        const model = { password: 'PASSWORD123', date: '2022-09-30T15:30:00', id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '', website: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.password.message).toBe('Password must have at least one lowercase letter');
    });

    test('should validate hasNumber', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .isString()
            .withMessage('is not a string')
            .hasNumber()
            .withMessage('Password must have at least one number');

        const validation = builder.build();
        const model = { password: 'Password', date: '2022-09-30T15:30:00', id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '', website: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.password.message).toBe('Password must have at least one number');
    });

    test('should validate hasSpecialCharacter', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .isString()
            .withMessage('is not a string')
            .hasSpecialCharacter()
            .withMessage('Password must have at least one special character');

        const validation = builder.build();
        const model = { password: 'Password123', date: '2022-09-30T15:30:00', id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '', website: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.password.message).toBe('Password must have at least one special character');
    });

    test('should validate isIn', () => {
        const validValues = ['apple', 'banana', 'cherry'];
        const builder = ValidationBuilder.create<UserModel>()
            .forField('password', model => model.password)
            .isString()
            .withMessage('is not a string')
            .isIn(validValues)
            .withMessage('Favorite fruit must be one of the specified values');

        const validation = builder.build();
        const model = { password: 'grape', date: '2022-09-30T15:30:00', id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '', website: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.password.message).toBe('Favorite fruit must be one of the specified values');
    });

    test('should validate isURL', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('website', model => model.website)
            .isString()
            .withMessage('is not a string')
            .isURL()
            .withMessage('Website must be a valid URL');

        const validation = builder.build();
        const model = { website: 'invalid-url', password: 'grape', date: '2022-09-30T15:30:00', id: '0bd7f2f9-aa70-4a35-9a44-2472f0d77d90', username: 'john_doe123', email: '' };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.website.message).toBe('Website must be a valid URL');
    });
});