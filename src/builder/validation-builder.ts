import { InitialBuilder } from "./sub-builders/initial-builder/initial-builder";

export class ValidationBuilder {
	/**
	 * Creates a new ValidationBuilder instance
	 * @param failFast - Determines if the validation should stop at the first error
	 * @returnsA new ValidationBuilder instance
	 */
	static create<ModelType>(failFast = true): InitialBuilder<ModelType> {
		return new InitialBuilder<ModelType>({
			validationRules: [],
			currentFieldStartIndex: 0,
			currentAlias: null,
			failFast,
			currentType: null,
		});
	}
}
