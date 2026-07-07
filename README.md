# ext-sizeus

The **frozen cross-repo contract surface** for the [sizeus](https://github.com/sneat-co/sizeus)
extension, per the Sneat [repository-naming standard](https://github.com/sneat-co/sneat-specs/blob/main/standards/repo-naming.md):
every Sneat extension is two repos — `<id>` (implementation) and `ext-<id>`
(the public extension-definition repo other repos import).

This repo holds the shared DTOs, consts, and briefs that both surfaces of the
sizeus extension depend on:

- the extension libraries embedded in the Sneat super-app, and
- the standalone app hosted at `sizechart.app`.

Every shared DTO (size records, catalog models, …) must resolve from the
`@sneat/extension-sizeus-contract` package — no duplicate DTO definitions are allowed in
the `sizeus` implementation repo or in `sneat-apps`.

## Status

The size-record DTO (`ISizeRecord`), history/current-value shapes
(`ISizeHistory`, `ICurrentSize`), the kit-sheet export row (`IKitSheetRow`),
and the `currentSizeRecord` helper are exported from `frontend/src/index.ts`. See
`frontend/src/lib/` for the individual modules and their `*.spec.ts` round-trip and
unit tests.

The versioned MVP size-type catalog (`ISizeTypeCatalog`, `MVP_SIZE_TYPE_CATALOG`
in `frontend/src/lib/catalog/`) covers footwear, body measurements, tops, bottoms,
accessories, and the football/basketball/cycling/swimming sport kits. Adding a
new size type is pure data — see the "extension is pure data" tests in
`frontend/src/lib/catalog/mvp-catalog.spec.ts`. Indicative (never authoritative)
size-system conversion tables with per-pair reliability flags, plus the
`conversionHint` lookup helper, live in `frontend/src/lib/conversion/`.

## Frozen means frozen

Changes here are breaking changes for every consumer. Keep the surface minimal,
additive, and versioned; implementation details stay in the `sizeus` repo.
