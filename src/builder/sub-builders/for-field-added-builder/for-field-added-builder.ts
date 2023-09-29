import {
	BuilderValidator, IsAsyncFunction,
	NestedPropGetter,
	SharedBuilderState,
	ValidationRule,
	Validator,
} from "../../../types/validation.types";
import { RuleAddedBuilder } from "../rule-added-builder/rule-added-builder";
import { InitialBuilder } from "../initial-builder/initial-builder";
import { CommonBuilder } from "../common-builder/common-builder";
import {isAsyncFunction} from "../../utils/misc.util";

export class ForFieldAddedBuilder<
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

	/**
	 * Adds a validator function for the latest property rule
	 * @param validator - The validator function
	 * @param condition - An optional condition function to determine if the validator should run.
	 * @returns ValidationBuilder A new ValidationBuilder instance with the added validator
	 */
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
		if (this.sharedState.validationRules.length === 0)
			throw new Error("Call 'forField' before using 'addRule'");

		const isAsyncValidator = isAsyncFunction(validator);
		const newValidator: BuilderValidator<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled
		> = { validator, condition };

		const currentRule = this.sharedState.validationRules[
			this.sharedState.validationRules.length - 1
		] as ValidationRule<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled
		>;
		const newValidators = [...currentRule.validators, newValidator];
		const newRule = {
			...currentRule,
			validators: newValidators,
			propertyName: this.sharedState.currentAlias || currentRule.propertyName,
			isAsync: isAsyncValidator || currentRule.isAsync,
		};

		const newValidationRules: ValidationRule<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsyncFunction<V> extends true ? true : IsAsync
		>[] = [
			...this.sharedState.validationRules.slice(0, -1),
			newRule,
		] as unknown as ValidationRule<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsyncFunction<V> extends true ? true : IsAsync
		>[];

		return new RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsyncFunction<V> extends true ? true : IsAsync
		>({ ...this.sharedState, validationRules: newValidationRules });
	}

	/**
	 * Overrides the property name for the last added validation rule
	 * @param name - The name that should be in the validation result as propertyName
	 */
	aliasAs(
		name: string,
	): ForFieldAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		if (this.sharedState.validationRules.length === 0)
			throw new Error("Call 'forField' before using 'aliasAs'");

		const startIndex = this.sharedState.currentFieldStartIndex || 0;
		const endIndex = this.sharedState.validationRules.length;

		const updatedRules = this.sharedState.validationRules
			.slice(startIndex, endIndex)
			.map((rule) => ({
				...rule,
				propertyName: name,
			}));

		const newValidationRules = [
			...this.sharedState.validationRules.slice(0, startIndex),
			...updatedRules,
		] as ValidationRule<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>[];

		const newSharedState = {
			...this.sharedState,
			validationRules: newValidationRules,
			currentAlias: name,
		};

		return new ForFieldAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>(newSharedState);
	}

	/**
	 * Specifies a dependent field for the latest validation rule.
	 * @param dependentFieldGetter - The function to get the dependent field value.
	 * @returns The current ValidationBuilder instance.
	 */
	dependsOn<NewDependentFieldType>(
		dependentFieldGetter: NestedPropGetter<ModelType, NewDependentFieldType>,
	): ForFieldAddedBuilder<ModelType, FieldType, NewDependentFieldType, true, IsAsync> {
		if (this.sharedState.validationRules.length === 0)
			throw new Error("Call 'forField' before using 'dependsOn'");

		const currentRule =
			this.sharedState.validationRules[
				this.sharedState.validationRules.length - 1
			];
		const updatedRule = { ...currentRule, dependentFieldGetter };
		const newValidationRules = [
			...this.sharedState.validationRules.slice(
				0,
				this.sharedState.validationRules.length - 1,
			),
			updatedRule,
		] as unknown as ValidationRule<
			ModelType,
			FieldType,
			NewDependentFieldType,
			true,
			IsAsync
		>[];

		return new ForFieldAddedBuilder<
			ModelType,
			FieldType,
			NewDependentFieldType,
			true,
			IsAsync
		>({ ...this.sharedState, validationRules: newValidationRules });
	}

	when<Field, DependentField>(
		condition: (model: ModelType) => boolean,
		builderCallback?: (
			builder: InitialBuilder<ModelType>,
		) => CommonBuilder<ModelType, Field, DependentField, DependsOnCalled, IsAsync>,
	): CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync> {
		return new CommonBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>(this.sharedState).when(condition, builderCallback);
	}
}
