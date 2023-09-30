import { expect, describe, test } from 'vitest';
import {ValidationBuilder} from "../../../validation-builder";

type UserModel = {
    dateOfBirth: Date;
};

describe('DateValidationBuilder', () => {

    test('should validate isBefore', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isBefore(new Date('2000-01-01'))
            .withMessage('Date must be before 2000-01-01');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('1999-12-31') };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isAfter', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isAfter(new Date('2000-01-01'))
            .withMessage('Date must be after 2000-01-01');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('2000-01-02') };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isBetween', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isBetween(new Date('2000-01-01'), new Date('2010-01-01'))
            .withMessage('Date must be between 2000-01-01 and 2010-01-01');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('2005-06-15') };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isSameDay', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isSameDay(new Date('2000-01-01'))
            .withMessage('Date must be the same day as 2000-01-01');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('2000-01-01') };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isWeekend', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isWeekend()
            .withMessage('Date must be a weekend');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('2023-10-01') };  // A Sunday
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isWeekday', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isWeekday()
            .withMessage('Date must be a weekday');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('2023-10-02') };  // A Monday
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('dateOfBirth');
    });

    // test('should validate isIso8601', () => {
    //     const builder = ValidationBuilder.create<UserModel>()
    //         .forField('dateOfBirth', model => model.dateOfBirth)
    //         .isDate()
    //         .withMessage('is not a date')
    //         .isIso8601()
    //         .withMessage('Date must be in ISO 8601 format');
    //
    //     const validation = builder.build();
    //     const model = { dateOfBirth: new Date().toISOString() };
    //     const outcome = validation.validate(model);
    //
    //     expect(outcome).not.toHaveProperty('dateOfBirth');
    // });

    test('should validate isToday', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isToday()
            .withMessage('Date must be today');

        const validation = builder.build();
        const model = { dateOfBirth: new Date() };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isPast', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isPast()
            .withMessage('Date must be in the past');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('2000-01-01') };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isFuture', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isFuture()
            .withMessage('Date must be in the future');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('3000-01-01') };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isLeapYear', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isLeapYear()
            .withMessage('Date must be in a leap year');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('2024-02-29') };  // 2024 is a leap year
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('dateOfBirth');
    });

    test('should validate isSameMonth', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('dateOfBirth', model => model.dateOfBirth)
            .isDate()
            .withMessage('is not a date')
            .isSameMonth(new Date('2000-01-15'))
            .withMessage('Date must be in the same month as 2000-01-15');

        const validation = builder.build();
        const model = { dateOfBirth: new Date('2000-01-22') };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('dateOfBirth');
    });

});