import { describe, it, expect } from 'vitest';
import { IKitSheetRow } from './kit-sheet-row';

describe('IKitSheetRow round-trip', () => {
	it('preserves contact fields and every cell, keyed by sizeTypeID, through JSON serialize/parse', () => {
		const row: IKitSheetRow = {
			contactID: 'contact-1',
			contactTitle: 'Alex Trakhimenok',
			cells: {
				shoe: { value: '9.5', system: 'US' },
				shirt: { value: 'M', system: 'alpha' },
			},
		};

		const roundTripped: IKitSheetRow = JSON.parse(JSON.stringify(row));

		expect(roundTripped).toEqual(row);
	});

	it('preserves a row with no cells (contact has no size records yet)', () => {
		const row: IKitSheetRow = {
			contactID: 'contact-2',
			contactTitle: 'No Sizes Yet',
			cells: {},
		};

		const roundTripped: IKitSheetRow = JSON.parse(JSON.stringify(row));

		expect(roundTripped).toEqual(row);
		expect(Object.keys(roundTripped.cells)).toHaveLength(0);
	});
});
