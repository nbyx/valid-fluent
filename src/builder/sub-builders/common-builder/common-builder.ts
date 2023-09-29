import {
	IsAsyncFunction,
	NestedPropGetter,
	SharedBuilderState,
	ValidationRule, ValidationType, Validator,
} from "../../../types/validation.types";
import { ValidationBuilder } from "../../validation-builder";
import { ForFieldAddedBuilder } from "../for-field-added-builder/for-field-added-builder";
import { InitialBuilder } from "../initial-builder/initial-builder";
import {createValidationInstance} from "../../utils/validation-instance.util";
import {RuleAddedBuilder} from "../rule-added-builder/rule-added-builder";

export class CommonBuilder<
	ModelType,
	FieldType,
	DependentFieldType,
	DependsOnCalled extends boolean = false,
	IsAsync extends boolean = false,
> {
	constructor(
		private readonly sharedState: SharedBuilderState<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>,
	) {}

	forField<NewFieldType>(
		name: Extract<keyof ModelType, string>,
		propGetter: NestedPropGetter<ModelType, NewFieldType>,
	): ForFieldAddedBuilder<ModelType, NewFieldType, DependentFieldType, DependsOnCalled, IsAsync> {
		return new InitialBuilder(this.sharedState).forField(name, propGetter);
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
		) => CommonBuilder<ModelType, Field, DependentField, DependsOnCalled, IsAsync>,
	): CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync> {
		if (builderCallback) {
			return this.handleBuilderCallback(builderCallback, condition);
		}

		if (this.sharedState.validationRules.length === 0)
			throw new Error("Call 'forProperty' before using 'when'");

		const currentRule =
			this.sharedState.validationRules[
				this.sharedState.validationRules.length - 1
			];
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
	build(): ValidationType<ModelType, IsAsync> {
		const hasAsyncRule = this.sharedState.validationRules.some(rule => rule.isAsync);

		return createValidationInstance<ModelType, IsAsync>(hasAsyncRule, this.sharedState.failFast, [...this.sharedState.validationRules] as ValidationRule<ModelType, unknown, unknown>[])
	}

	private handleBuilderCallback<Field, DependentField>(
		builderCallback: (
			builder: InitialBuilder<ModelType>,
		) => CommonBuilder<ModelType, Field, DependentField, DependsOnCalled, IsAsync>,
		condition: (model: ModelType) => boolean,
	) {
		const subBuilder = builderCallback(ValidationBuilder.create<ModelType>());

		const subValidationRules = subBuilder.sharedState.validationRules.map(
			(rule) => ({
				...rule,
				propertyCondition: condition,
			}),
		) as unknown as ValidationRule<
			ModelType,
			FieldType,
			DependentFieldType,
			false
		>[];

		const newValidationRules = [
			...this.sharedState.validationRules,
			...subValidationRules,
		] as ValidationRule<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>[];

		return new CommonBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({ ...this.sharedState, validationRules: newValidationRules });
	}


	addRule<V extends Validator<ModelType, FieldType, DependentFieldType, DependsOnCalled>>(
		validator: V,
		condition?: (model: ModelType) => boolean,
	): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsyncFunction<V> extends true ? true : IsAsync
	> {
		const fieldAddedBuilder = new ForFieldAddedBuilder<ModelType, FieldType,DependentFieldType,DependsOnCalled, IsAsync>(
			{...this.sharedState as SharedBuilderState<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync> }
		);

		return fieldAddedBuilder.addRule(validator, condition);
	}
}
