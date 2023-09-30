import {
	NestedPropGetter,
	SharedBuilderState,
	SharedStateFieldType,
	ValidationRule,
} from "../../../types/validation.types";
import { ForFieldAddedBuilder } from "../for-field-added-builder/for-field-added-builder";

export class InitialBuilder<
	ModelType,
	FieldType = unknown,
	DependentFieldType = unknown,
	DependsOnCalled extends boolean = false,
	IsAsync extends boolean = false,
	CurrentType extends SharedStateFieldType | null = null,
> {
	constructor(
		private readonly sharedState: SharedBuilderState<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			CurrentType
		>,
	) {}
	private readonly NO_ERROR_MESSAGE = "No error message set for this rule";

	/**
	 * Specifies the property to validate
	 * @param name - The name of the property
	 * @param propGetter - The function to get the property value.
	 * @returns A new ValidationBuilder instance with the added property rule
	 */
	forField<NewFieldType>(
		name: Extract<keyof ModelType, string>,
		propGetter: NestedPropGetter<ModelType, NewFieldType>,
	): ForFieldAddedBuilder<
		ModelType,
		NewFieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		this.sharedState.currentFieldStartIndex =
			this.sharedState.validationRules.length;

		const newRule: ValidationRule<
			ModelType,
			NewFieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		> = {
			name,
			propGetter,
			validators: [],
			errorMessage: this.NO_ERROR_MESSAGE,
			propertyName: name,
			isAsync: false as IsAsync,
		};
		const newValidationRules = [
			...this.sharedState.validationRules,
			newRule,
		] as unknown as ValidationRule<
			ModelType,
			NewFieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>[];

		return new ForFieldAddedBuilder<
			ModelType,
			NewFieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...this.sharedState,
			currentType: null,
			validationRules: newValidationRules,
		});
	}
}
