import {
	NestedPropGetter,
	SharedBuilderState,
	ValidationRule,
} from "../../../types/validation.types";
import { ForFieldAddedBuilder } from "../for-field-added-builder/for-field-added-builder";

export class InitialBuilder<
	ModelType,
	FieldType = unknown,
	DependentFieldType = unknown,
	DependsOnCalled = false,
> {
	constructor(
		private readonly sharedState: SharedBuilderState<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled
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
	): ForFieldAddedBuilder<ModelType, NewFieldType, DependentFieldType, false> {
		this.sharedState.currentFieldStartIndex =
			this.sharedState.validationRules.length;

		const newRule: ValidationRule<
			ModelType,
			NewFieldType,
			DependentFieldType,
			false
		> = {
			name,
			propGetter,
			validators: [],
			errorMessage: this.NO_ERROR_MESSAGE,
			propertyName: name,
		};
		const newValidationRules = [
			...this.sharedState.validationRules,
			newRule,
		] as unknown as ValidationRule<
			ModelType,
			NewFieldType,
			DependentFieldType,
			false
		>[];

		return new ForFieldAddedBuilder<
			ModelType,
			NewFieldType,
			DependentFieldType,
			false
		>({ ...this.sharedState, validationRules: newValidationRules });
	}
}
