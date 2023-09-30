import {ValidationBuilder} from "../../../validation-builder";
import {describe, expect, test} from "vitest";

type UserModel = {
    active: boolean;
};

describe('BooleanValidationBuilder', () => {

    // isTrue Method
    test('should validate true value', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('active', model => model.active)
            .isBoolean()
            .withMessage('is not a boolean')
            .isTrue()
            .withMessage('Active must be true');

        const validation = builder.build();
        const model = { active: true };
        const outcome = validation.validate(model);

        expect(outcome).not.toHaveProperty('active');
    });

    test('should invalidate false value with isTrue', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('active', model => model.active)
            .isBoolean()
            .withMessage('is not a boolean')
            .isTrue()
            .withMessage('Active must be true');

        const validation = builder.build();
        const model = { active: false };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid) {
            expect(outcome.result).toHaveProperty('active');
            expect(outcome.result.active.message).toContain('Active must be true');
        }
    });

    test('should validate false value', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('active', model => model.active)
            .isBoolean()
            .withMessage('is not a boolean')
            .isFalse()
            .withMessage('Active must be false');

        const validation = builder.build();
        const model = { active: false };
        const outcome = validation.validate(model);
        expect(outcome.isValid).toBe(true);
        expect(outcome.result).not.toHaveProperty('active');
    });

    test('should invalidate true value with isFalse', () => {
        const builder = ValidationBuilder.create<UserModel>()
            .forField('active', model => model.active)
            .isBoolean()
            .withMessage('is not a boolean')
            .isFalse()
            .withMessage('Active must be false');

        const validation = builder.build();
        const model = { active: true };
        const outcome = validation.validate(model);

        expect(outcome.isValid).toBe(false);
        if (!outcome.isValid) {
            expect(outcome.result).toHaveProperty('active');
            expect(outcome.result.active.message).toContain('Active must be false');
        }
    });

});