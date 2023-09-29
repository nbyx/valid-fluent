import {
    ValidationOutcome,
    ValidationResult,
    ValidationRule,
    Validator, ValidatorArgs
} from "../../../types/validation.types";
import {isNonEmptyObject} from "../../utils/misc.util";
import {createValidationOutcome} from "../../utils/validation.util";

export class BaseValidation<ModelType> {
    protected constructor(
        protected readonly failFast: boolean,
    ) {}

    protected handleValidationFailure(
        rule: ValidationRule<ModelType, unknown, unknown>,
        state: ModelType,
        result: ValidationResult<ModelType>,
    ): boolean {
        const message = typeof rule.errorMessage === 'function' ? rule.errorMessage(state) : rule.errorMessage;
        result[rule.name] = {
            propertyName: rule.propertyName,
            message,
        };
        return false;
    }

    protected mergeOutcomes(
        outcomes: PromiseSettledResult<ValidationOutcome<ModelType>>[]
    ): ValidationOutcome<ModelType> {
        let allValid = true;
        const results: ValidationResult<ModelType>[] = [];
        outcomes.forEach((outcome) => {
            if (outcome.status === "fulfilled") {
                const { result, isValid } = outcome.value;
                if (isNonEmptyObject(result)) results.push(result);
                allValid = allValid && isValid;
            }
        });
        const mergedResult = Object.assign({}, ...results);
        return {
            result: mergedResult,
            isValid: allValid,
        };
    }

    protected runValidatorsForRuleSync(
        rule: ValidationRule<ModelType, unknown, unknown>,
        state: ModelType,
        validatorRunner: (
            validator: Validator<ModelType, unknown, unknown>,
            args: ValidatorArgs<ModelType, unknown, unknown>,
        ) => boolean,
    ): ValidationOutcome<ModelType> {
        if (rule.propertyCondition && !rule.propertyCondition(state)) {
            return createValidationOutcome({ isValid: true });
        }

        let isValid = true;
        const result = {} as ValidationResult<ModelType>;
        const value = rule.propGetter(state);
        const dependentValue = rule.dependentFieldGetter ? rule.dependentFieldGetter(state) : undefined;

        const validatorArgs = { model: state, value, dependentValue } as ValidatorArgs<ModelType, unknown, unknown>;

        for (const { validator, condition } of rule.validators) {
            if (condition && !condition(state)) continue;

            const isResultValid = validatorRunner(validator, validatorArgs);

            if (!isResultValid) {
                isValid = this.handleValidationFailure(rule, state, result);
                if (this.failFast) return createValidationOutcome({ result, isValid: false });
            }
        }

        return createValidationOutcome({ result, isValid });
    }

    protected async runValidatorsForRuleAsync(
        rule: ValidationRule<ModelType, unknown, unknown>,
        state: ModelType,
        validatorRunner: (
            validator: Validator<ModelType, unknown, unknown>,
            args: ValidatorArgs<ModelType, unknown, unknown>,
        ) => boolean | Promise<boolean>,
        signal?: AbortSignal,
    ): Promise<ValidationOutcome<ModelType>> {
        let isValid = true;
        const result = {} as ValidationResult<ModelType>;
        const value = rule.propGetter(state);
        const dependentValue = rule.dependentFieldGetter ? rule.dependentFieldGetter(state) : undefined;

        const validatorArgs = { model: state, value, dependentValue } as ValidatorArgs<ModelType, unknown, unknown>;

        const asyncValidations: Promise<void>[] = [];

        for (const { validator, condition } of rule.validators) {
            if (signal?.aborted) {
                return createValidationOutcome({ isValid: true }); // or however you'd like to handle abortion
            }

            if (condition && !condition(state)) continue;

            const isResultValid = validatorRunner(validator, validatorArgs);

            if (isResultValid instanceof Promise) {
                const asyncValidation = isResultValid.then((valid) => {
                    if (!valid) isValid = this.handleValidationFailure(rule, state, result);
                });
                asyncValidations.push(asyncValidation);
            } else {
                if (!isResultValid) {
                    isValid = this.handleValidationFailure(rule, state, result);
                    if (this.failFast) return createValidationOutcome({ result, isValid: false });
                }
            }
        }

        await Promise.all(asyncValidations);  // Await all async validations to complete

        return createValidationOutcome({ result, isValid });
    }
}