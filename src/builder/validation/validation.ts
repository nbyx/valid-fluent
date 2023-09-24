import {ValidationOutcome, ValidationResult, ValidationRule} from "../../types/validation.types";
import {createValidationOutcome} from "../utils/validation.util";

export class Validation<ModelType> {
    constructor(
        private readonly failFast: boolean,
        private readonly validationRules: ValidationRule<ModelType, unknown, unknown>[],
    ) {}

    /**
     *  Validates the state object
     * @param state - The state to be validated
     * @returns The ValidationOutcome based on the ModelType.
     */
    validate(state: ModelType): ValidationOutcome<ModelType> {
        const results: ValidationResult<ModelType>[] = [];
        let allValid = true;

        for (const rule of this.validationRules) {
            const { isValid, result } = this.runValidatorsForRule(rule, state);

            results.push(result);
            if (!isValid) allValid = false;
        }

        const result = Object.assign({}, ...results) ?? {};

        return {
            result,
            isValid: allValid,
        };
    }

    private runValidatorsForRule(
        rule: ValidationRule<ModelType, unknown, unknown>,
        state: ModelType,
    ): ValidationOutcome<ModelType> {
        if (rule.propertyCondition && !rule.propertyCondition(state)) return createValidationOutcome({}, true);

        let isValid = true;
        const result: ValidationResult<ModelType> = {};

        for (const { validator, condition } of rule.validators) {
            const value = rule.propGetter(state);
            const dependentValue = rule.dependentFieldGetter ? rule.dependentFieldGetter(state) : undefined;

            if (condition && !condition(state)) continue;

            const validationOutcome = validator({
                model: state,
                value,
                dependentValue,
                errorMessage: rule.errorMessage,
            });

            if (validationOutcome.isValid) continue;

            isValid = false;
            result[rule.name] = { propertyName: rule.propertyName, message: validationOutcome.results };

            if (this.failFast) {
                return createValidationOutcome(result, false);
            }
        }

        return createValidationOutcome(result, isValid);
    }
}