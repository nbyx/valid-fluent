import {
	BuilderValidator,
	IsAsyncFunction,
	SharedBuilderState,
	SharedStateFieldType,
	ValidationRule,
	Validator,
} from "../../../../types/validation.types";
import { RuleAddedBuilder } from "../../rule-added-builder/rule-added-builder";
import { isAsyncFunction } from "../../../utils/misc.util";

export class GenericValidationBuilder<
	ModelType,
	FieldType,
	DependentFieldType,
	DependsOnCalled extends boolean,
	IsAsync extends boolean,
	CurrentType extends SharedStateFieldType | null,
> {
	constructor(
		protected readonly sharedState: SharedBuilderState<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			CurrentType
		>,
	) {}
	/**
	 * Adds a validator function for the latest property rule
	 * @param validator - The validator function
	 * @param condition - An optional condition function to determine if the validator should run.
	 * @returns ValidationBuilder A new ValidationBuilder instance with the added validator
	 */
	addRule<
		V extends Validator<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled
		>,
	>(
		validator: V,
		condition?: (model: ModelType) => boolean,
	): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsyncFunction<V> extends true ? true : IsAsync,
		CurrentType
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
			IsAsyncFunction<V> extends true ? true : IsAsync,
			CurrentType
		>({
			...this.sharedState,
			validationRules: newValidationRules,
		} as unknown as SharedBuilderState<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsyncFunction<V> extends true ? true : IsAsync,
			CurrentType
		>);
	}

	isNumber(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync,
		"number"
	> {
		(
			this.sharedState as SharedBuilderState<
				ModelType,
				FieldType,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				"number"
			>
		).currentType = "number";

		return this.addRule(
			({ value }) => typeof value === "number",
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"number"
		>;
	}

	isString(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync,
		"string"
	> {
		(
			this.sharedState as SharedBuilderState<
				ModelType,
				FieldType,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				"string"
			>
		).currentType = "string";

		return this.addRule(
			({ value }) => typeof value === "string",
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"string"
		>;
	}

	isBoolean(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync,
		"boolean"
	> {
		(
			this.sharedState as SharedBuilderState<
				ModelType,
				FieldType,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				"boolean"
			>
		).currentType = "boolean";

		return this.addRule(
			({ value }) => typeof value === "boolean",
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"boolean"
		>;
	}

	isDate(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync,
		"Date"
	> {
		(
			this.sharedState as SharedBuilderState<
				ModelType,
				FieldType,
				DependentFieldType,
				DependsOnCalled,
				IsAsync,
				"Date"
			>
		).currentType = "Date";

		return this.addRule(
			({ value }) =>
				value instanceof Date ||
				Object.prototype.toString.call(value) === "[object Date]",
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync,
			"Date"
		>;
	}

	isTruthy(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(({ value }) => Boolean(value)) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isFalsy(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(({ value }) => !value) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isEqualTo(
		comparisonValue: FieldType,
	): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) => value === comparisonValue,
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isNotEqualTo(
		comparisonValue: FieldType,
	): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) => value !== comparisonValue,
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isGreaterThan(
		comparisonValue: FieldType,
	): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) => value > comparisonValue,
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isLessThan(
		comparisonValue: FieldType,
	): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) => value < comparisonValue,
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isNull(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(({ value }) => value === null) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isUndefined(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) => typeof value === "undefined",
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isDefined(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) => value !== null && typeof value !== "undefined",
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isArray(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(({ value }) =>
			Array.isArray(value),
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isEmptyArray(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) => Array.isArray(value) && value.length === 0,
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isNonEmptyArray(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) => Array.isArray(value) && value.length > 0,
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isObject(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) =>
				value && typeof value === "object" && !Array.isArray(value),
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}

	isEmptyObject(): RuleAddedBuilder<
		ModelType,
		FieldType,
		DependentFieldType,
		DependsOnCalled,
		IsAsync
	> {
		return this.addRule(
			({ value }) =>
				value &&
				typeof value === "object" &&
				!Array.isArray(value) &&
				Object.keys(value).length === 0,
		) as RuleAddedBuilder<
			ModelType,
			FieldType,
			DependentFieldType,
			DependsOnCalled,
			IsAsync
		>;
	}
}
