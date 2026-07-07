import { describe, it, expect } from 'vitest';
import { ISizeHistory, ICurrentSize } from './size-history';
import { ISizeRecord } from './size-record';

describe('ISizeHistory round-trip', () => {
	it('preserves the chronological records list through JSON serialize/parse', () => {
		const records: ISizeRecord[] = [
			{
				contactID: 'contact-1',
				sizeTypeID: 'shoe',
				value: '9',
				system: 'US',
				effectiveDate: '2026-01-01',
				createdAt: '2026-01-01T00:00:00.000Z',
			},
			{
				contactID: 'contact-1',
				sizeTypeID: 'shoe',
				value: '9.5',
				system: 'US',
				effectiveDate: '2026-06-01',
				createdAt: '2026-06-01T00:00:00.000Z',
				note: 'growth spurt',
			},
		];
		const history: ISizeHistory = {
			contactID: 'contact-1',
			sizeTypeID: 'shoe',
			records,
		};

		const roundTripped: ISizeHistory = JSON.parse(JSON.stringify(history));

		expect(roundTripped).toEqual(history);
	});
});

describe('ICurrentSize round-trip', () => {
	it('preserves every field through JSON serialize/parse', () => {
		const current: ICurrentSize = {
			contactID: 'contact-1',
			sizeTypeID: 'shoe',
			value: '9.5',
			system: 'US',
			effectiveDate: '2026-06-01',
		};

		const roundTripped: ICurrentSize = JSON.parse(JSON.stringify(current));

		expect(roundTripped).toEqual(current);
	});
});
