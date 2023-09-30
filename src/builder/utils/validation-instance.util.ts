import {ValidationRule, ValidationType} from "../../types/validation.types";
import {AsyncValidation} from "../validation/async-validation/async-validation";
import {SyncValidation} from "../validation/sync-validation/sync-validation";

export function createValidationInstance<ModelType, IsAsync extends boolean>(
    isAsync: boolean,
    failFast: boolean,
    validationRules: ValidationRule<ModelType, unknown, unknown, false, false>[]
): ValidationType<ModelType, IsAsync> {
    if (isAsync) {
        return new AsyncValidation(failFast, validationRules) as ValidationType<ModelType, IsAsync>;
    }
    return new SyncValidation(failFast, validationRules) as ValidationType<ModelType, IsAsync>;
}





