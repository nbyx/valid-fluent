import { isNonEmptyObject } from './misc.util'; // Adjust the import to your project structure
import { describe, expect, test } from 'vitest';

describe('Misc Util', () => {
    test('isNonEmptyObject returns false for an empty object', () => {
        const obj = {};
        const result = isNonEmptyObject(obj);
        expect(result).toBe(false);
    });

    test('isNonEmptyObject returns true for a non-empty object', () => {
        const obj = { key: 'value' };
        const result = isNonEmptyObject(obj);
        expect(result).toBe(true);
    });
});