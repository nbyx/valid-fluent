import type {BuilderType} from "../../types/builder.type";
import type {SharedBuilderState, SharedStateFieldType} from "../../types/validation.types";
import {BooleanValidationBuilder} from "../sub-builders/type-validation/boolean-validation-builder/boolean-validation-builder";
import {StringValidationBuilder} from "../sub-builders/type-validation/string-validation-builder/string-validation-builder";
import {DateValidationBuilder} from "../sub-builders/type-validation/date-validation-builder/date-validation-builder";
import {NumberValidationBuilder} from "../sub-builders/type-validation/number-validation-builder/number-validation-builder";
import {CommonBuilder} from "../sub-builders/common-builder/common-builder";


export function getBuilderInstance<ModelType, FieldType, DependentFieldType, DependsOnCalled extends boolean, IsAsync extends boolean, CurrentType extends SharedStateFieldType | null>(
    sharedState: SharedBuilderState<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync, CurrentType>
): BuilderType<CurrentType, ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync> {
    switch (sharedState.currentType) {
        case 'number':
            return new NumberValidationBuilder(
                sharedState as unknown as SharedBuilderState<ModelType, number, DependentFieldType, DependsOnCalled, IsAsync, 'number'>
            ) as unknown as BuilderType<CurrentType, ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync>;
        case 'string':
            return new StringValidationBuilder(
                sharedState as unknown as SharedBuilderState<ModelType, string, DependentFieldType, DependsOnCalled, IsAsync, 'string'>
            ) as unknown as BuilderType<CurrentType, ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync>;
        case 'boolean':
            return new BooleanValidationBuilder(
                sharedState as unknown as SharedBuilderState<ModelType, boolean, DependentFieldType, DependsOnCalled, IsAsync, 'boolean'>
            ) as unknown as BuilderType<CurrentType, ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync>;
        case 'Date':
            return new DateValidationBuilder(
                sharedState as unknown as SharedBuilderState<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, 'Date'>
            ) as unknown as BuilderType<CurrentType, ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync>;
        case null:
            return new CommonBuilder( sharedState as unknown as SharedBuilderState<ModelType, Date, DependentFieldType, DependsOnCalled, IsAsync, null>) as unknown as BuilderType<CurrentType, ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync>;
        default: throw Error('wrong currentType in sharedState');
    }
}