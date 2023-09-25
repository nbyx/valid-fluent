import { test, expect } from "vitest";
import { ValidationBuilder } from "./validation-builder";
import { InitialBuilder } from "./sub-builders/initial-builder/initial-builder"; // Import the InitialBuilder class, adjust the path as needed

test("ValidationBuilder.create returns an InitialBuilder instance", () => {
	const builder = ValidationBuilder.create<number>();
	expect(builder).toBeInstanceOf(InitialBuilder);
});

test("ValidationBuilder.create respects failFast parameter", () => {
	const failFastBuilder = ValidationBuilder.create<number>(true);
	// rome-ignore lint: only for test
	expect((failFastBuilder as any).sharedState.failFast).toBe(true);

	const nonFailFastBuilder = ValidationBuilder.create<number>(false);
	// rome-ignore lint: only for test
	expect((nonFailFastBuilder as any).sharedState.failFast).toBe(false);
});
