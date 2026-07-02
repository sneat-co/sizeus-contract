// @sneat/sizeus-contract — frozen cross-repo contract surface for the sizeus extension.
//
// Shared DTOs (size records, history/current-value shapes, kit-sheet export
// rows, …) are exported from here so that both the Sneat super-app extension
// libs and the standalone sizechart.app resolve every shared model from this
// single package. No consumer may re-declare these.

export * from './lib';
