import { DEGENESIS } from '../config.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class DegenesisActorSheet extends ActorSheet {
	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: [ 'degenesis', 'sheet', 'actor' ],
			template: 'systems/degenesis/templates/actor/actor-sheet.html',
			width: 800,
			height: 600,
			tabs: [ { navSelector: '.sheet-tabs', contentSelector: '.tab-content', initial: 'main' } ]
		});
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {
		const data = super.getData();
		this.loadConfigData(data);
		data.conceptIcon = this.actor.data.data.details.concept.value
			? `systems/degenesis/icons/concept/${this.actor.data.data.details.concept.value}.svg`
			: 'systems/degenesis/icons/blank.png';
		data.cultIcon = this.actor.data.data.details.cult.value
			? `systems/degenesis/icons/cult/${this.actor.data.data.details.cult.value}.svg`
			: 'systems/degenesis/icons/blank.png';
		data.cultureIcon = this.actor.data.data.details.culture.value
			? `systems/degenesis/icons/culture/${this.actor.data.data.details.culture.value}.svg`
			: 'systems/degenesis/icons/blank.png';

		data.data.condition.ego.pct = (1 - data.data.condition.ego.value / data.data.condition.ego.max) * 100;
		data.data.condition.fleshwounds.pct =
			(1 - data.data.condition.fleshwounds.value / data.data.condition.fleshwounds.max) * 100;
		data.data.condition.spore.pct = (1 - data.data.condition.spore.value / data.data.condition.spore.max) * 100;
		data.data.condition.trauma.pct = (1 - data.data.condition.trauma.value / data.data.condition.trauma.max) * 100;
		mergeObject(data, this.actor.prepare());
		return data;
	}

	/* -------------------------------------------- */

	loadConfigData(sheetData) {
		sheetData.concepts = DEGENESIS.concepts;
		sheetData.cults = DEGENESIS.cults;
		sheetData.cultures = DEGENESIS.cultures;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;

		html.find('.item-controls').click(ev => {
			const section = $(ev.currentTarget).data('showId')
			if (this.actor.inventory.hasOwnProperty(section)){

			}
		})

		$('input[type=text]').focusin(function() {
			$(this).select();
		});
		// Update Inventory Item
		html.find('.item-edit').click((ev) => {
			const itemId = $(ev.currentTarget).parents('.item').data('itemId');
			const item = this.actor.getOwnedItem(itemId);
			item.sheet.render(true);
		});

		// Delete Inventory Item
		html.find('.item-delete').click((ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const itemId = li.data('itemId')
			li.slideUp(200, () => {
				this.render(false)
				this.actor.deleteOwnedItem(itemId)
			});
			;
		});

		html.find('.item-create').click((ev) => {
			const itemData = $(ev.currentTarget).parents('.item').data('itemId');
			
		});

		html.find('.item-equip').click((ev) => {
			const itemId = $(ev.currentTarget).parents('.item').data('itemId');
			let {data} = this.actor.getOwnedItem(itemId)
			console.log(data)
			let update = {_id: data._id, data:{ equipped: { value: !data.data.equipped.value}}}
			this.actor.updateOwnedItem(update)
		});
	}

	/* -------------------------------------------- */
}
