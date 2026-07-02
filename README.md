# sizeus-contract

The **frozen cross-repo contract surface** for the [sizeus](https://github.com/sneat-co/sizeus)
extension, per the Sneat [repository-naming standard](https://github.com/sneat-co/sneat-specs/blob/main/standards/repo-naming.md):
every Sneat extension is two repos — `<id>` (implementation) and `<id>-contract`
(the stable interface other repos import).

This repo holds the shared DTOs, consts, and briefs that both surfaces of the
sizeus extension depend on:

- the extension libraries embedded in the Sneat super-app, and
- the standalone app hosted at `sizechart.app`.

Every shared DTO (size records, catalog models, …) must resolve from the
`@sneat/sizeus-contract` package — no duplicate DTO definitions are allowed in
the `sizeus` implementation repo or in `sneat-apps`.

## Status

Scaffold only: `src/index.ts` exports nothing yet. The size-record and catalog
DTOs land in a follow-up task.

## Frozen means frozen

Changes here are breaking changes for every consumer. Keep the surface minimal,
additive, and versioned; implementation details stay in the `sizeus` repo.
