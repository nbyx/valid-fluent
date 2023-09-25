export type ValidationMessage = string;
export type ValidatorArgs<
	ModelType,
	ValueType,
	DependentFieldType,
	DependsOnCalled = false,
> = {
	model: ModelType;
	value: ValueType;
	dependentValue: DependsOnCalled extends true ? DependentFieldType : undefined;
};

export type Validator<
	ModelType,
	ValueType,
	DependentFieldType,
	DependsOnCalled = false,
> = (
	args: ValidatorArgs<
		ModelType,
		ValueType,
		DependentFieldType,
		DependsOnCalled
	>,
) => boolean;

export type ValidationResult<Shape> = {
	[key in keyof Shape]: { propertyName: string; message: ValidationMessage };
};

export type ValidationSuccess = {
	isValid: true;
	result: {};
};

export type ValidationError<Shape> = {
	isValid: false;
	result: ValidationResult<Shape>;
};

export type ValidationOutcome<Shape> =
	| ValidationSuccess
	| ValidationError<Shape>;

export type NestedPropGetter<ModelType, PropType> = (
	model: ModelType,
) => PropType;

export type BuilderValidator<
	ModelType,
	FieldValueType,
	DependentValueType,
	DependsOnCalled,
> = {
	validator: Validator<
		ModelType,
		FieldValueType,
		DependentValueType,
		DependsOnCalled
	>;
	condition?: ((model: ModelType) => boolean) | undefined;
};

export type ModelValueType<ModelType> = ModelType[keyof ModelType];

export type ValidationRule<
	ModelType,
	FieldValue,
	DependentValueType,
	DependsOnCalled = false,
> = {
	name: keyof ModelType;
	propGetter: NestedPropGetter<ModelType, FieldValue>;
	dependentFieldGetter?: NestedPropGetter<ModelType, DependentValueType>;
	validators: BuilderValidator<
		ModelType,
		FieldValue,
		DependentValueType,
		DependsOnCalled
	>[];
	propertyCondition?: (model: ModelType) => boolean;
	errorMessage: string | ((model: ModelType) => string);
	propertyName: string;
};

export interface SharedBuilderState<
	ModelType,
	FieldType,
	DependentFieldType,
	DependsOnCalled,
> {
	failFast: boolean;
	validationRules: ReadonlyArray<
		ValidationRule<ModelType, FieldType, DependentFieldType, DependsOnCalled>
	>;
	currentAlias: string | null;
	currentFieldStartIndex: number;
}
