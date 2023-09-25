export type ValidationMessage = string;
export type ValidatorArgs<ModelType, ValueType, DependentFieldType> = {
	model: ModelType;
	value: ValueType;
	dependentValue?: DependentFieldType;
};

export type Validator<ModelType, ValueType, DependentFieldType> = (
	args: ValidatorArgs<ModelType, ValueType, DependentFieldType>,
) => boolean;

export type ValidationResult<Shape> = {
	[key in keyof Shape]: { propertyName: string; message: ValidationMessage };
};

export type ValidationSuccess = {
	isValid: true;
	result: {}
}

export type ValidationError<Shape> = {
	isValid: false;
	result: ValidationResult<Shape>;
}

export type ValidationOutcome<Shape> = ValidationSuccess | ValidationError<Shape>;

export type NestedPropGetter<ModelType, PropType> = (
	model: ModelType,
) => PropType;

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
	errorMessage: string | ((model: ModelType) => string);
	propertyName: string;
};
