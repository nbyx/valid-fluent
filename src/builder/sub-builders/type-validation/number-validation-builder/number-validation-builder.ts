import { CommonBuilder } from "../../common-builder/common-builder";
import {
	NestedPropGetter,
	SharedBuilderState,
	ValidationType,
	Validator,
	ValidatorArgs,
} from "../../../../types/validation.types";
import { ForFieldAddedBuilder } from "../../for-field-added-builder/for-field-added-builder";
import { InitialBuilder } from "../../initial-builder/initial-builder";

export class NumberValidationBuilder<
	ModelType,
	DependentFieldType,
	DependsOnCalled extends boolean,
	IsAsync extends boolean,
> {
	constructor(
		private readonly sharedState: SharedBuilderState<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
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
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...(this.sharedState as unknown as SharedBuilderState<
				ModelType,
				number,
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
		number,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...(this.sharedState as unknown as SharedBuilderState<
				ModelType,
				number,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				null
			>),
		}).when(condition, builderCallback);
	}

	addRule<
		V extends Validator<ModelType, number, DependentFieldType, DependsOnCalled>,
	>(validator: V, condition?: (model: ModelType) => boolean) {
		return new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...(this.sharedState as unknown as SharedBuilderState<
				ModelType,
				number,
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
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>({
			...(this.sharedState as unknown as SharedBuilderState<
				ModelType,
				number,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				null
			>),
		}).build();
	}

	range(min: number, max: number) {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(
			(
				args: ValidatorArgs<
					ModelType,
					number,
					DependentFieldType,
					DependsOnCalled
				>,
			) => args.value >= min && args.value <= max,
		);
	}

	isPositive() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value > 0);
	}

	isNegative() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value < 0);
	}

	isInteger() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => Number.isInteger(value));
	}

	isDecimal() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => !Number.isInteger(value));
	}

	greaterThan(n: number) {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value > n);
	}

	lessThan(n: number) {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value < n);
	}

	between(min: number, max: number) {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value >= min && value <= max);
	}

	isZero() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value === 0);
	}

	notZero() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value !== 0);
	}

	isEven() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value % 2 === 0);
	}

	isOdd() {
		const commonBuilder = new CommonBuilder<
			ModelType,
			number,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>(this.sharedState);

		return commonBuilder.addRule(({ value }) => value % 2 !== 0);
	}
}
