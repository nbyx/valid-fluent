import {SyncValidation} from "../builder/validation/sync-validation/sync-validation";
import {AsyncValidation} from "../builder/validation/async-validation/async-validation";

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
) => boolean | Promise<boolean>;

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
	IsAsync extends boolean = false,
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
	isAsync: IsAsync;
};

export type SharedStateFieldType = 'number' | 'string' | 'boolean' | 'Date';


export interface SharedBuilderState<
	ModelType,
	FieldType,
	DependentFieldType,
	DependsOnCalled,
	IsAsync extends boolean,
	CurrentType extends SharedStateFieldType | null,
> {
	failFast: boolean;
	validationRules: ReadonlyArray<
		ValidationRule<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync>
	>;
	currentAlias: string | null;
	currentFieldStartIndex: number;
	currentType: CurrentType,
}

export type ValidationType<ModelType, IsAsync extends boolean> = IsAsync extends true
	? AsyncValidation<ModelType>
	: SyncValidation<ModelType>;

// rome-ignore lint: any needed for function typing
export type IsAsyncFunction<T> = T extends (...args: any[]) => Promise<any> ? true : false;


