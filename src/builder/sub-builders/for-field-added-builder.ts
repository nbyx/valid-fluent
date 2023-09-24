import {BuilderValidator, NestedPropGetter, ValidationRule, Validator} from "../../types/validation.types";
import {RuleAddedBuilder} from "./rule-added-builder";
import {InitialBuilder} from "./initial-builder";
import {CommonBuilder} from "./common-builder";

export class ForFieldAddedBuilder<ModelType, FieldType, DependentFieldType> {
    constructor(
        private readonly failFast: boolean = true,
        private readonly validationRules: ReadonlyArray<ValidationRule<ModelType, FieldType, DependentFieldType>> = [],
    ) {}

    /**
     * Adds a validator function for the latest property rule
     * @param validator - The validator function
     * @param condition - An optional condition function to determine if the validator should run.
     * @returns ValidationBuilder A new ValidationBuilder instance with the added validator
     */
    addRule(
        validator: Validator<ModelType, FieldType, DependentFieldType>,
        condition?: (model: ModelType) => boolean,
    ): RuleAddedBuilder<ModelType, FieldType, DependentFieldType> {
        if (this.validationRules.length === 0) throw new Error("Call 'forField' before using 'addRule'");
        const newValidator: BuilderValidator<ModelType, FieldType, DependentFieldType> = { validator, condition };

        const currentRule = this.validationRules[this.validationRules.length - 1] as ValidationRule<
            ModelType,
            FieldType,
            DependentFieldType
        >;
        const newValidators = [...currentRule.validators, newValidator];
        const newRule = { ...currentRule, validators: newValidators };

        const newValidationRules: ValidationRule<ModelType, FieldType, DependentFieldType>[] = [
            ...this.validationRules.slice(0, -1),
            newRule,
        ] as unknown as ValidationRule<ModelType, FieldType, DependentFieldType>[];

        return new RuleAddedBuilder<ModelType, FieldType, DependentFieldType>(this.failFast, newValidationRules);
    }

    /**
     * Overrides the property name for the last added validation rule
     * @param name - The name that should be in the validation result as propertyName
     */
    aliasAs(name: string): ForFieldAddedBuilder<ModelType, FieldType, DependentFieldType> {
        const lastRuleIndex = this.validationRules.length - 1;
        if (lastRuleIndex >= 0) {
            const lastRule = { ...this.validationRules[lastRuleIndex], propertyName: name };
            const newValidationRules = { ...this.validationRules.slice(0, lastRuleIndex), lastRule };

            return new ForFieldAddedBuilder<ModelType, FieldType, DependentFieldType>(
                this.failFast,
                newValidationRules,
            );
        }

        return new ForFieldAddedBuilder<ModelType, FieldType, DependentFieldType>(
            this.failFast,
            this.validationRules,
        );
    }

    /**
     * Specifies a dependent field for the latest validation rule.
     * @param dependentFieldGetter - The function to get the dependent field value.
     * @returns The current ValidationBuilder instance.
     */
    dependsOn<NewDependentFieldType>(
        dependentFieldGetter: NestedPropGetter<ModelType, NewDependentFieldType>,
    ): ForFieldAddedBuilder<ModelType, FieldType, NewDependentFieldType> {
        if (this.validationRules.length === 0) throw new Error("Call 'forField' before using 'dependsOn'");

        const currentRule = this.validationRules[this.validationRules.length - 1];
        const updatedRule = { ...currentRule, dependentFieldGetter };
        const newValidationRules = [
            ...this.validationRules.slice(0, this.validationRules.length - 1),
            updatedRule,
        ] as unknown as ValidationRule<ModelType, FieldType, NewDependentFieldType>[];

        return new ForFieldAddedBuilder<ModelType, FieldType, NewDependentFieldType>(this.failFast, newValidationRules);
    }

    when<Field, DependentField>(
        condition: (model: ModelType) => boolean,
        builderCallback?: (
            builder: InitialBuilder<ModelType, unknown, unknown>,
        ) => CommonBuilder<ModelType, Field, DependentField>,
    ): ForFieldAddedBuilder<ModelType, FieldType, DependentFieldType> {
        new CommonBuilder<ModelType, FieldType, DependentFieldType>(this.failFast, this.validationRules).when(condition, builderCallback);

        return this;
    }

}