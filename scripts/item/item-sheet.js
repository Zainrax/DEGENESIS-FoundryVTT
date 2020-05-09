/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class DegenesisItemSheet extends ItemSheet {
	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [ 'degenesis', 'sheet', 'item' ],
			template: 'systems/degenesis/templates/item/item-sheet.html',
			width: 520,
			height: 480,
			tabs: [ { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' } ]
		});
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		const tabs = new TabsV2({ navSelector: '.tabs', contentSelector: '.sheet-body', initial: 'description' });

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;
	}

	/* -------------------------------------------- */
}
