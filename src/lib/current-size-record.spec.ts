import { describe, it, expect } from 'vitest';
import { currentSizeRecord } from './current-size-record';
import { ISizeRecord } from './size-record';

function record(partial: Partial<ISizeRecord>): ISizeRecord {
	return {
		contactID: 'contact-1',
		sizeTypeID: 'shoe',
		value: '9',
		system: 'US',
		effectiveDate: '2026-01-01',
		createdAt: '2026-01-01T00:00:00.000Z',
		...partial,
	};
}

describe('currentSizeRecord', () => {
	it('returns undefined for an empty list', () => {
		expect(currentSizeRecord([], '2026-07-02')).toBeUndefined();
	});

	it('picks the record with the latest non-future effective date among distinct past dates', () => {
		const older = record({ effectiveDate: '2026-01-01', createdAt: '2026-01-01T00:00:00.000Z', value: '8' });
		const newer = record({ effectiveDate: '2026-06-01', createdAt: '2026-06-01T00:00:00.000Z', value: '9' });
		const newest = record({ effectiveDate: '2026-05-01', createdAt: '2026-05-01T00:00:00.000Z', value: '8.5' });

		const result = currentSizeRecord([older, newer, newest], '2026-07-02');

		expect(result).toBe(newer);
	});

	it('ignores a future-dated record — it stays dormant until its effective date arrives', () => {
		const past = record({ effectiveDate: '2026-06-01', createdAt: '2026-06-01T00:00:00.000Z', value: '9' });
		const future = record({ effectiveDate: '2026-12-25', createdAt: '2026-07-01T00:00:00.000Z', value: '10' });

		const result = currentSizeRecord([past, future], '2026-07-02');

		expect(result).toBe(past);
	});

	it('treats a record effective exactly today as non-future', () => {
		const today = record({ effectiveDate: '2026-07-02', createdAt: '2026-07-02T00:00:00.000Z', value: '9' });

		const result = currentSizeRecord([today], '2026-07-02');

		expect(result).toBe(today);
	});

	it('breaks a same-effective-date tie by the most-recently-created record', () => {
		const createdFirst = record({
			effectiveDate: '2026-06-01',
			createdAt: '2026-06-01T08:00:00.000Z',
			value: '9',
		});
		const createdSecond = record({
			effectiveDate: '2026-06-01',
			createdAt: '2026-06-01T09:30:00.000Z',
			value: '9.5',
		});

		const result = currentSizeRecord([createdFirst, createdSecond], '2026-07-02');

		expect(result).toBe(createdSecond);
	});

	it('returns undefined when every record is future-dated', () => {
		const future = record({ effectiveDate: '2026-12-25', createdAt: '2026-07-01T00:00:00.000Z' });

		expect(currentSizeRecord([future], '2026-07-02')).toBeUndefined();
	});

	it('does not mutate the input array', () => {
		const a = record({ effectiveDate: '2026-01-01', createdAt: '2026-01-01T00:00:00.000Z' });
		const b = record({ effectiveDate: '2026-02-01', createdAt: '2026-02-01T00:00:00.000Z' });
		const records = [a, b];
		const copy = [...records];

		currentSizeRecord(records, '2026-07-02');

		expect(records).toEqual(copy);
	});
});
