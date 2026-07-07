import { describe, it, expect } from 'vitest';
import { MVP_SIZE_TYPE_CATALOG } from './mvp-catalog';
import { ISizeTypeCatalog, ISizeTypeEntry } from './size-type';
import { ISizeRecord } from '../size-record';
import { currentSizeRecord } from '../current-size-record';

function entryByID(catalog: ISizeTypeCatalog, id: string): ISizeTypeEntry | undefined {
	return catalog.sizeTypes.find((entry) => entry.id === id);
}

describe('MVP_SIZE_TYPE_CATALOG coverage (AC mvp-catalog-coverage)', () => {
	it('is versioned', () => {
		expect(MVP_SIZE_TYPE_CATALOG.version).toBe(1);
	});

	it('includes footwear', () => {
		expect(MVP_SIZE_TYPE_CATALOG.sizeTypes.some((entry) => entry.category === 'footwear')).toBe(
			true,
		);
	});

	it.each(['height', 'weight', 'chest', 'waist', 'hips', 'inseam'])(
		'includes body measurement %s',
		(id) => {
			const entry = entryByID(MVP_SIZE_TYPE_CATALOG, id);
			expect(entry).toBeDefined();
			expect(entry?.category).toBe('body-measurement');
		},
	);

	it('includes tops', () => {
		expect(MVP_SIZE_TYPE_CATALOG.sizeTypes.some((entry) => entry.category === 'tops')).toBe(true);
	});

	it('includes bottoms', () => {
		expect(MVP_SIZE_TYPE_CATALOG.sizeTypes.some((entry) => entry.category === 'bottoms')).toBe(
			true,
		);
	});

	it.each(['hat', 'gloves', 'ring', 'helmet'])('includes accessory %s', (id) => {
		const entry = entryByID(MVP_SIZE_TYPE_CATALOG, id);
		expect(entry).toBeDefined();
		expect(entry?.category).toBe('accessories');
	});

	it.each([
		['football', ['football-jersey', 'football-shorts', 'football-socks', 'football-boots', 'football-goalkeeper-gloves', 'football-shin-guards']],
		['basketball', ['basketball-jersey', 'basketball-shorts', 'basketball-shoes']],
		['cycling', ['cycling-helmet', 'cycling-gloves', 'cycling-jersey']],
		['swimming', ['swimming-goggles', 'swimming-fins']],
	] as const)('includes the %s sport kit with its brief-listed member types', (kitID, memberIDs) => {
		const kit = MVP_SIZE_TYPE_CATALOG.sportKits.find((candidate) => candidate.id === kitID);
		expect(kit).toBeDefined();
		expect([...(kit?.sizeTypeIDs ?? [])].sort()).toEqual([...memberIDs].sort());
	});

	it('every sport-kit member id resolves to a catalog size-type entry', () => {
		for (const kit of MVP_SIZE_TYPE_CATALOG.sportKits) {
			for (const sizeTypeID of kit.sizeTypeIDs) {
				expect(entryByID(MVP_SIZE_TYPE_CATALOG, sizeTypeID)).toBeDefined();
			}
		}
	});

	it('every catalog entry id is unique', () => {
		const ids = MVP_SIZE_TYPE_CATALOG.sizeTypes.map((entry) => entry.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('catalog extension is pure data (AC catalog-extends-without-migration)', () => {
	it('accepts a new "ski boots" entry on a copy of the catalog with no schema change', () => {
		// A COPY of the shipped catalog — the shipped MVP_SIZE_TYPE_CATALOG
		// itself is left untouched.
		const extendedCatalog: ISizeTypeCatalog = {
			...MVP_SIZE_TYPE_CATALOG,
			sizeTypes: [
				...MVP_SIZE_TYPE_CATALOG.sizeTypes,
				{
					id: 'ski-boots',
					category: 'footwear',
					title: 'Ski boots',
					valueKind: 'numeric',
					applicableSystems: ['Mondopoint'],
				},
			],
		};

		// Type-checks against the very same `ISizeTypeCatalog` interface used
		// by the shipped catalog — no new/changed type was needed.
		expect(entryByID(extendedCatalog, 'ski-boots')).toEqual({
			id: 'ski-boots',
			category: 'footwear',
			title: 'Ski boots',
			valueKind: 'numeric',
			applicableSystems: ['Mondopoint'],
		});
		// The shipped catalog constant was not mutated by building the copy.
		expect(entryByID(MVP_SIZE_TYPE_CATALOG, 'ski-boots')).toBeUndefined();
	});

	it('a size record referencing the new type id works unchanged with currentSizeRecord', () => {
		// `ISizeRecord.sizeTypeID` (Task 2) is a plain string — recording a
		// value for the brand-new "ski-boots" id requires no change to
		// `ISizeRecord`, `ISizeHistory`, or `currentSizeRecord`.
		const skiBootRecord: ISizeRecord = {
			contactID: 'contact-1',
			sizeTypeID: 'ski-boots',
			value: '27',
			system: 'Mondopoint',
			effectiveDate: '2026-07-02',
			createdAt: '2026-07-02T00:00:00.000Z',
		};

		const result = currentSizeRecord([skiBootRecord], '2026-07-02');

		expect(result).toBe(skiBootRecord);
	});
});
