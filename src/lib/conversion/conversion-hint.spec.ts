import { describe, it, expect } from 'vitest';
import { conversionHint } from './conversion-hint';

describe('conversionHint', () => {
	it.each([
		['footwear-adult', 'EU', '42', 'UK', '8'],
		['footwear-adult', 'EU', '42', 'US', '9'],
		['footwear-adult', 'UK', '8', 'US', '9'],
		['footwear-kids', 'EU', '28', 'UK', '10'],
	])('returns the reliable hint for %s %s %s -> %s', (sizeTypeID, system, value, targetSystem, expected) => {
		expect(conversionHint(sizeTypeID, system, value, targetSystem)).toBe(expected);
	});

	it('returns null for a pair explicitly flagged unreliable, even though row data exists', () => {
		// Kids US sizing is flagged unreliable in footwear.ts even though the
		// row carries a US value — the flag must suppress the hint.
		expect(conversionHint('footwear-kids', 'EU', '28', 'US')).toBeNull();
		expect(conversionHint('footwear-kids', 'UK', '10', 'US')).toBeNull();
	});

	it('returns null for an unknown size type', () => {
		expect(conversionHint('ski-boots', 'EU', '42', 'UK')).toBeNull();
	});

	it('returns null for a system pair with no reliability entry in the table at all', () => {
		expect(conversionHint('footwear-adult', 'EU', '42', 'JP')).toBeNull();
	});

	it('returns null for a value not present in the table (out of range / free-typed)', () => {
		expect(conversionHint('footwear-adult', 'EU', '99', 'UK')).toBeNull();
	});

	it('returns null when the source and target system are the same', () => {
		expect(conversionHint('footwear-adult', 'EU', '42', 'EU')).toBeNull();
	});

	it('does not mutate the input value', () => {
		const value = '42';
		const copy = value.slice();

		conversionHint('footwear-adult', 'EU', value, 'UK');

		expect(value).toBe(copy);
	});
});
