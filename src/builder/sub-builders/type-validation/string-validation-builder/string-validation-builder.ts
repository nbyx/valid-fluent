import {RuleAddedBuilder} from "../../rule-added-builder/rule-added-builder";
import {NestedPropGetter, SharedBuilderState, ValidationType, Validator} from "../../../../types/validation.types";
import {CommonBuilder} from "../../common-builder/common-builder";
import {ForFieldAddedBuilder} from "../../for-field-added-builder/for-field-added-builder";
import {InitialBuilder} from "../../initial-builder/initial-builder";

export class StringValidationBuilder<ModelType, DependentFieldType, DependsOnCalled extends boolean, IsAsync extends boolean> {

    constructor(private readonly sharedState: SharedBuilderState<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>) {
    }

    forField<NewFieldType>(
        name: Extract<keyof ModelType, string>,
        propGetter: NestedPropGetter<ModelType, NewFieldType>,
    ): ForFieldAddedBuilder<ModelType, NewFieldType, DependentFieldType, DependsOnCalled, IsAsync> {
        return new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync>({...this.sharedState as unknown as SharedBuilderState<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, null>}).forField(name, propGetter);
    }

    when<Field, DependentField>(
        condition: (model: ModelType) => boolean,
        builderCallback?: (
            builder: InitialBuilder<ModelType>,
        ) => CommonBuilder<ModelType, Field, DependentField, DependsOnCalled, IsAsync>,
    ): CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync> {
        return new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync>({...this.sharedState as unknown as SharedBuilderState<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, null>}).when(condition, builderCallback);
    }

    addRule<V extends Validator<ModelType, string, DependentFieldType, DependsOnCalled>>(
        validator: V,
        condition?: (model: ModelType) => boolean,
    ) {
        return new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync>({...this.sharedState as unknown as SharedBuilderState<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, null>}).addRule(validator, condition);
    }

    build(): ValidationType<ModelType, IsAsync> {
        return new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync>({...this.sharedState as unknown as SharedBuilderState<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, null>}).build();
    }

    maxLength(len: number): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    > {
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => value.length <= len);
    }

    minLength(len: number): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >  {
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => value.length >= len);
    }

    isEmail(): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)


        return commonBuilder.addRule(({ value }) => emailPattern.test(value));
    }

    isNumeric(): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const numericPattern = /^[0-9]+$/;
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => numericPattern.test(value));
    }

    matches(pattern: RegExp): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => pattern.test(value));
    }

    hasCapitalLetter(): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const capitalLetterPattern = /[A-Z]/;
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => capitalLetterPattern.test(value));
    }

    hasLowercaseLetter(): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const lowercaseLetterPattern = /[a-z]/;
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => lowercaseLetterPattern.test(value));
    }

    hasNumber(): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const numberPattern = /[0-9]/;
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => numberPattern.test(value));
    }

    hasSpecialCharacter(): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const specialCharacterPattern = /[\W_]/;
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => specialCharacterPattern.test(value));
    }

    isIn(values: string[]): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => values.includes(value));
    }

    isURL(): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    > {
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => {
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        });
    }

    isUUID(): RuleAddedBuilder<
        ModelType,
        string,
        DependentFieldType,
        DependsOnCalled,
        IsAsync,
        'string'
    >   {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        const commonBuilder = new CommonBuilder<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>(this.sharedState)

        return commonBuilder.addRule(({ value }) => uuidPattern.test(value));
    }
}