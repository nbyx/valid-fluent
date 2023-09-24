export type FieldValidationResult =
    | {
    isValid: true;
}
    | {
    isValid: false;
    results: string;
};

export type ValidationMessage = string;
export type ValidatorArgs<ModelType, ValueType, DependentFieldType> = {
    model: ModelType;
    value: ValueType;
    dependentValue?: DependentFieldType;
    errorMessage: string;
};

export type Validator<ModelType, ValueType, DependentFieldType> = (
    args: ValidatorArgs<ModelType, ValueType, DependentFieldType>,
) => FieldValidationResult;

export type ValidationResult<Shape> = {
    [key in keyof Shape]?: { propertyName: string; message: ValidationMessage };
};

export type ValidationOutcome<Shape> = {
    result: ValidationResult<Shape>;
    isValid: boolean;
};

export type NestedPropGetter<ModelType, PropType> = (model: ModelType) => PropType;

export type BuilderValidator<ModelType, FieldValueType, DependentValueType> = {
    validator: Validator<ModelType, FieldValueType, DependentValueType>;
    condition?: ((model: ModelType) => boolean) | undefined;
};

export type ModelValueType<ModelType> = ModelType[keyof ModelType];

export type ValidationRule<ModelType, FieldValue, DependentValueType> = {
    name: keyof ModelType;
    propGetter: NestedPropGetter<ModelType, FieldValue>;
    dependentFieldGetter?: NestedPropGetter<ModelType, DependentValueType>;
    validators: BuilderValidator<ModelType, FieldValue, DependentValueType>[];
    propertyCondition?: (model: ModelType) => boolean;
    errorMessage: string;
    propertyName: string;
};
