import { describe, expect, it } from 'vitest';
import { ALL_CONVERSION_TABLES, conversionTableFor } from './all';
import { FOOTWEAR_ADULT_CONVERSION, FOOTWEAR_KIDS_CONVERSION } from './footwear';

describe('ALL_CONVERSION_TABLES', () => {
	it('ships the footwear tables in presentation order', () => {
		expect(ALL_CONVERSION_TABLES).toEqual([
			FOOTWEAR_ADULT_CONVERSION,
			FOOTWEAR_KIDS_CONVERSION,
		]);
	});

	it('has a unique, non-empty sizeTypeID per table', () => {
		const ids = ALL_CONVERSION_TABLES.map((t) => t.sizeTypeID);
		expect(ids.every((id) => id.length > 0)).toBe(true);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every table carries systems, pairs and rows', () => {
		for (const t of ALL_CONVERSION_TABLES) {
			expect(t.systems.length).toBeGreaterThan(0);
			expect(t.pairs.length).toBeGreaterThan(0);
			expect(t.rows.length).toBeGreaterThan(0);
		}
	});
});

describe('conversionTableFor', () => {
	it('resolves a known size type', () => {
		expect(conversionTableFor('footwear-adult')).toBe(FOOTWEAR_ADULT_CONVERSION);
	});

	it('returns undefined for a type with no table', () => {
		expect(conversionTableFor('tops')).toBeUndefined();
	});
});
