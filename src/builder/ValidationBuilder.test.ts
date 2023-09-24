import { test, expect } from 'vitest';
import { ValidationBuilder } from './validation-builder';
import { InitialBuilder } from './sub-builders/initial-builder';  // Import the InitialBuilder class, adjust the path as needed

test('ValidationBuilder.create returns an InitialBuilder instance', () => {
    const builder = ValidationBuilder.create<number>();
    expect(builder).toBeInstanceOf(InitialBuilder);
});

test('ValidationBuilder.create respects failFast parameter', () => {
    const failFastBuilder = ValidationBuilder.create<number>(true);
    expect((failFastBuilder as any).failFast).toBe(true);

    const nonFailFastBuilder = ValidationBuilder.create<number>(false);
    expect((nonFailFastBuilder as any).failFast).toBe(false);
});