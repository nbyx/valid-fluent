import { CommonBuilder } from "../../common-builder/common-builder";
import type { SharedBuilderState } from "../../../../types/validation.types";
import {
	NestedPropGetter,
	ValidationType,
	Validator,
} from "../../../../types/validation.types";
import { ForFieldAddedBuilder } from "../../for-field-added-builder/for-field-added-builder";
import { InitialBuilder } from "../../initial-builder/initial-builder";

export class BooleanValidationBuilder<
	ModelType,
	DependentFieldType,
	DependsOnCalled extends boolean,
	IsAsync extends boolean,
> {
	constructor(
		private readonly sharedState: SharedBuilderState<
			ModelType,
			boolean,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"boolean"
		>,
	) {}

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
		return new CommonBuilder<
			ModelType,
			boolean,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...(this.sharedState as unknown as SharedBuilderState<
				ModelType,
				boolean,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				null
			>),
		}).forField(name, propGetter);
	}

	when<Field, DependentField>(
		condition: (model: ModelType) => boolean,
		builderCallback?: (
			builder: InitialBuilder<ModelType>,
		) => CommonBuilder<
			ModelType,
			Field,
			DependentField,
			DependsOnCalled,
			IsAsync
		>,
	): CommonBuilder<
		ModelType,
		boolean,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return new CommonBuilder<
			ModelType,
			boolean,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...(this.sharedState as unknown as SharedBuilderState<
				ModelType,
				boolean,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				null
			>),
		}).when(condition, builderCallback);
	}

	addRule<
		V extends Validator<
			ModelType,
			boolean,
			DependentFieldType,
			DependsOnCalled
		>,
	>(validator: V, condition?: (model: ModelType) => boolean) {
		return new CommonBuilder<
			ModelType,
			boolean,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...(this.sharedState as unknown as SharedBuilderState<
				ModelType,
				boolean,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				null
			>),
		}).addRule(validator, condition);
	}

	build(): ValidationType<ModelType, IsAsync> {
		return new CommonBuilder<
			ModelType,
			boolean,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...(this.sharedState as unknown as SharedBuilderState<
				ModelType,
				boolean,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				null
			>),
		}).build();
	}

	isTrue() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			boolean,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"boolean"
		>(this.sharedState);
		return commonBuilder.addRule(({ value }) => value);
	}

	isFalse() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			boolean,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"boolean"
		>(this.sharedState);
		return commonBuilder.addRule(({ value }) => !value);
	}
}
