import type {
	NestedPropGetter,
	SharedStateFieldType,
	ValidationRule,
} from "../../../types/validation.types";
import { InitialBuilder } from "../initial-builder/initial-builder";
import { CommonBuilder } from "../common-builder/common-builder";
import {GenericValidationBuilder} from "../type-validation/generic-validation-builder/generic-validation-builder";

export class ForFieldAddedBuilder<
	ModelType,
	FieldType,
	DependentFieldType,
	DependsOnCalled extends boolean = false,
	IsAsync extends boolean = false,
	CurrentType extends SharedStateFieldType | null = null
>  extends GenericValidationBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync, CurrentType>{

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
		IsAsync,
		CurrentType
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
			IsAsync,
			CurrentType
		>(newSharedState);
	}

	/**
	 * Specifies a dependent field for the latest validation rule.
	 * @param dependentFieldGetter - The function to get the dependent field value.
	 * @returns The current ValidationBuilder instance.
	 */
	dependsOn<NewDependentFieldType>(
		dependentFieldGetter: NestedPropGetter<ModelType, NewDependentFieldType>,
	): ForFieldAddedBuilder<ModelType, FieldType, NewDependentFieldType, true, IsAsync, CurrentType> {
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
			IsAsync,
			CurrentType
		>({ ...this.sharedState, validationRules: newValidationRules });
	}

	when<Field, DependentField>(
		condition: (model: ModelType) => boolean,
		builderCallback?: (
			builder: InitialBuilder<ModelType>,
		) => CommonBuilder<ModelType, Field, DependentField, DependsOnCalled, IsAsync, CurrentType>,
	): CommonBuilder<ModelType, FieldType, DependentFieldType, DependsOnCalled, IsAsync, CurrentType> {
		return new CommonBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			CurrentType
		>(this.sharedState).when(condition, builderCallback);
	}
}
