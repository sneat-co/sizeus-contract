import { describe, it, expect } from 'vitest';
import { ISizeRecord } from './size-record';

describe('ISizeRecord round-trip', () => {
	it('preserves every field, including optional ones, through JSON serialize/parse', () => {
		const record: ISizeRecord = {
			contactID: 'contact-1',
			sizeTypeID: 'shoe',
			value: '9.5',
			system: 'US',
			effectiveDate: '2026-07-02',
			createdAt: '2026-07-02T10:15:30.000Z',
			note: 'wide fit',
			preferredBrandNote: 'runs small in Nike',
		};

		const roundTripped: ISizeRecord = JSON.parse(JSON.stringify(record));

		expect(roundTripped).toEqual(record);
	});

	it('preserves the shape with optional fields absent (not merely undefined)', () => {
		const record: ISizeRecord = {
			contactID: 'contact-2',
			sizeTypeID: 'shirt',
			value: 'M',
			system: 'alpha',
			effectiveDate: '2026-01-15',
			createdAt: '2026-01-15T00:00:00.000Z',
		};

		const json = JSON.stringify(record);
		const roundTripped: ISizeRecord = JSON.parse(json);

		expect(roundTripped).toEqual(record);
		expect('note' in roundTripped).toBe(false);
		expect('preferredBrandNote' in roundTripped).toBe(false);
	});

	it('accepts an open (non-literal) declared system string', () => {
		const record: ISizeRecord = {
			contactID: 'contact-3',
			sizeTypeID: 'glove',
			value: '7',
			system: 'regional-custom-system',
			effectiveDate: '2026-03-01',
			createdAt: '2026-03-01T00:00:00.000Z',
		};

		const roundTripped: ISizeRecord = JSON.parse(JSON.stringify(record));

		expect(roundTripped.system).toBe('regional-custom-system');
	});
});
