
import { describe, expect, test } from 'vitest';
import { CommonBuilder } from './common-builder';
import { Validation } from '../../validation/validation';
import {ForFieldAddedBuilder} from "../for-field-added-builder/for-field-added-builder";

interface UserModel {
    username: string;
    age: number;
}

interface TestModel {
    field1: string;
    field2: number;
    field3: boolean;
}

const sharedState = {
    validationRules: [],
    currentFieldStartIndex: 0,
    currentAlias: null,
    failFast: true,
};

describe('CommonBuilder', () => {

    test('forField returns ForFieldAddedBuilder', () => {
        const builder = new CommonBuilder<UserModel, string, never>(sharedState);
        const result = builder.forField('username', model => model.username);

        expect(result).toBeInstanceOf(ForFieldAddedBuilder);
    });

    test('when sets condition on last validator', () => {
        const builder = new CommonBuilder<UserModel, string, never>(sharedState)
            .forField('username', model => model.username)
            .addRule(({value}) => value.length > 0)
            .withMessage('test error')
            .when(model => model.username !== 'admin');
        const validation = builder.build();
        const outcome = validation.validate({ username: 'admin', age: 30 });

        expect(outcome.isValid).toBe(true); // Assuming that the condition prevents the validation
    });

    test('when sets condition with builderCallback', () => {
        const builder = new CommonBuilder<UserModel, string, never>(sharedState)
            .forField('username', model => model.username)
            .when(
                model => model.username !== 'admin',
                subBuilder => subBuilder
                    .forField('username', model => model.username)
                    .addRule(({value}) => value.length > 0)
                    .withMessage('test error message')
            );
        const validation = builder.build();
        const outcome = validation.validate({ username: 'admin', age: 30 });

        expect(outcome.isValid).toBe(true); // Assuming that the condition prevents the validation
    });

    test('build returns Validation instance', () => {
        const builder = new CommonBuilder<UserModel, string, never>(sharedState);
        const result = builder.build();

        expect(result).toBeInstanceOf(Validation);
    });

    test('build returns Validation instance with correct rules', () => {
        const builder = new CommonBuilder<UserModel, string, never>(sharedState)
            .forField('username', model => model.username)
            .addRule(({value}) => value.length > 0)
            .withMessage('Your error message here');
        const validation = builder.build();
        const outcome = validation.validate({ username: '', age: 30 });

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid)
        expect(outcome.result.username.message).toBe('Your error message here');
    });

    test('No forField before when', () => {
        expect(() => {
            new CommonBuilder<TestModel, unknown, unknown>(sharedState).when(model => model.field1 !== '');
        }).toThrow(Error);
    });

    test('Nested Conditions with when', () => {
        const builder = new CommonBuilder<TestModel, unknown, unknown>(sharedState)
            .forField('field1', model => model.field1)
            .when(model => model.field1 !== '', subBuilder => {
                return subBuilder.forField('field2', model => model.field2)
                    .addRule(({ value }) => !!value)
                    .withMessage('Test error')
                    .when(model => model.field2 > 0);
            });
        const validation = builder.build();
        const model = { field1: 'test', field2: 10, field3: true };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(true);
    });
});