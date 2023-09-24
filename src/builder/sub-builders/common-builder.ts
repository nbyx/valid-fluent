import { NestedPropGetter, ValidationRule } from "../../types/validation.types";
import { ValidationBuilder } from "../validation-builder";
import { ForFieldAddedBuilder } from "./for-field-added-builder";
import { InitialBuilder } from "./initial-builder";
import { Validation } from "../validation/validation";

export class CommonBuilder<ModelType, FieldType, DependentFieldType> {
	constructor(
		private readonly failFast: boolean = true,
		private readonly validationRules: ReadonlyArray<
			ValidationRule<ModelType, FieldType, DependentFieldType>
		> = [],
	) {}

	forField<NewFieldType>(
		name: Extract<keyof ModelType, string>,
		propGetter: NestedPropGetter<ModelType, NewFieldType>,
	): ForFieldAddedBuilder<ModelType, NewFieldType, DependentFieldType> {
		new InitialBuilder(this.failFast, this.validationRules).forField(
			name,
			propGetter,
		);

		return new ForFieldAddedBuilder<
			ModelType,
			NewFieldType,
			DependentFieldType
		>();
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
			builder: InitialBuilder<ModelType, unknown, unknown>,
		) => CommonBuilder<ModelType, Field, DependentField>,
	): CommonBuilder<ModelType, FieldType, DependentFieldType> {
		if (builderCallback) {
			const subBuilder = builderCallback(ValidationBuilder.create<ModelType>());
			const subValidationRules = subBuilder.validationRules.map((rule) => ({
				...rule,
				propertyCondition: condition,
			})) as unknown as ValidationRule<
				ModelType,
				FieldType,
				DependentFieldType
			>[];
			const newValidationRules = [
				...this.validationRules,
				...subValidationRules,
			] as ValidationRule<ModelType, FieldType, DependentFieldType>[];

			return new CommonBuilder<ModelType, FieldType, DependentFieldType>(
				this.failFast,
				newValidationRules,
			);
		}

		if (this.validationRules.length === 0)
			throw new Error("Call 'forProperty' before using 'when'");

		const currentRule = this.validationRules[this.validationRules.length - 1];
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
		return new Validation(this.failFast, [
			...(this.validationRules as ValidationRule<
				ModelType,
				unknown,
				unknown
			>[]),
		]);
	}
}
