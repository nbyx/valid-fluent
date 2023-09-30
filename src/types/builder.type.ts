import type {NumberValidationBuilder} from "../builder/sub-builders/type-validation/number-validation-builder/number-validation-builder";
import type {StringValidationBuilder} from "../builder/sub-builders/type-validation/string-validation-builder/string-validation-builder";
import type {BooleanValidationBuilder} from "../builder/sub-builders/type-validation/boolean-validation-builder/boolean-validation-builder";
import type {DateValidationBuilder} from "../builder/sub-builders/type-validation/date-validation-builder/date-validation-builder";
import type {CommonBuilder} from "../builder/sub-builders/common-builder/common-builder";
import type {SharedStateFieldType} from "./validation.types";

export type BuilderType<T extends (SharedStateFieldType | null), ModelType, FieldType, DependentFieldType, DependsOnCalled extends boolean, IsAsync extends boolean> =
    T extends 'number' ? NumberValidationBuilder<ModelType, DependentFieldType, DependsOnCalled, IsAsync> :
        T extends 'string' ? StringValidationBuilder<ModelType, DependentFieldType, DependsOnCalled, IsAsync> :
            T extends 'boolean' ? BooleanValidationBuilder<ModelType, DependentFieldType, DependsOnCalled, IsAsync> :
                T extends 'Date' ? DateValidationBuilder<ModelType, DependentFieldType, DependsOnCalled, IsAsync> :
                    CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync>;
