import {NestedPropGetter, SharedBuilderState, ValidationRule} from "../../../types/validation.types";
import { ValidationBuilder } from "../../validation-builder";
import { ForFieldAddedBuilder } from "../for-field-added-builder/for-field-added-builder";
import { InitialBuilder } from "../initial-builder/initial-builder";
import { Validation } from "../../validation/validation";

export class CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled = false> {
	constructor(
		private readonly sharedState: SharedBuilderState<ModelType, FieldType, DependentFieldType, DependsOnCalled>
	) {
	}

	forField<NewFieldType>(
		name: Extract<keyof ModelType, string>,
		propGetter: NestedPropGetter<ModelType, NewFieldType>,
	): ForFieldAddedBuilder<ModelType, NewFieldType, DependentFieldType> {
		return new InitialBuilder(this.sharedState).forField(
			name,
			propGetter,
		);
	}

	/**
	 *  Adds a condition for the latest validator function or use the builder callback to set condition for multiple rules
	 * @param condition - The condition function
	 * @param builderCallback - Callback to access the builder to set condition for multiple properties
	 * @returns ValidationBuilder The current ValidationBuilder instance
	 */
	when<Field, DependentField>(
		condition: (model: ModelType) => boolean,
		builderCallback?: (
			builder: InitialBuilder<ModelType>,
		) => CommonBuilder<ModelType, Field, DependentField>,
	): CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled> {
		if (builderCallback) {
			return this.handleBuilderCallback(builderCallback, condition);
		}

		if (this.sharedState.validationRules.length === 0)
			throw new Error("Call 'forProperty' before using 'when'");

		const currentRule = this.sharedState.validationRules[this.sharedState.validationRules.length - 1];
		if (!currentRule)
			throw new Error("A precondition is not met: 'currentRule' is not set.");

		const currentValidator =
			currentRule.validators[currentRule.validators.length - 1];
		if (!currentValidator)
			throw new Error(
				"A precondition is not met: 'currentValidator' is not set.",
			);

		currentValidator.condition = condition;

		return this;
	}

	/**
	 * Builds and returns a Validation instance to validate the model
	 * @returns A new Validation instance
	 */
	build(): Validation<ModelType> {
		return new Validation(this.sharedState.failFast, [
			...(this.sharedState.validationRules as ValidationRule<
				ModelType,
				unknown,
				unknown,
				false
			>[]),
		]);
	}

	private handleBuilderCallback<Field, DependentField>(builderCallback: (builder: InitialBuilder<ModelType, unknown, unknown>) => CommonBuilder<ModelType, Field, DependentField>, condition: (model: ModelType) => boolean) {
		const subBuilder = builderCallback(ValidationBuilder.create<ModelType>());

		const subValidationRules = subBuilder.sharedState.validationRules.map((rule) => ({
			...rule,
			propertyCondition: condition,
		})) as unknown as ValidationRule<
			ModelType,
			FieldType,
			DependentFieldType,
			false
		>[];

		const newValidationRules = [
			...this.sharedState.validationRules,
			...subValidationRules,
		] as ValidationRule<ModelType, FieldType, DependentFieldType, DependsOnCalled>[];

		return new CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled>(
			{...this.sharedState,
			validationRules: newValidationRules,}
		);
	}
}
