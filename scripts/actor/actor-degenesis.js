import { DEGENESIS } from '../config.js';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class DegenesisActor extends Actor {
	prepareData() {
		try {
			super.prepareData();
			const { data } = this.data;

			// Characters have to decide between INT+Focus and INS+Primal,
			// as the Skill not chosen here cannot be raised.
			const intellect = data.attributes.intellect;
			const focus = intellect.skills.focus;
			const instinct = data.attributes.instinct;
			const primal = instinct.skills.primal;
			if (focus.value) data.condition.ego.max = (focus.value + intellect.value) * 2;
			else if (primal.value) data.condition.ego.max = (primal.value + instinct.value) * 2;

			// The Faith Skill and the Willpower Skill cannot
			// be combined, the character has to choose one of them;
			const psyche = data.attributes.psyche;
			const willpower = psyche.skills.willpower;
			const faith = psyche.skills.faith;
			if (willpower.value) data.condition.spore.max = (willpower.value + psyche.value) * 2;
			else if (faith.value) data.condition.spore.max = (faith.value + psyche.value) * 2;

			const body = data.attributes.body;
			data.condition.fleshwounds.max = (body.value + body.skills.toughness.value) * 2;
		} catch (e) {
			console.log(e);
		}
	}

	prepare() {
		let preparedData = {};
		preparedData.inventory = this.prepareItems();
		return preparedData;
	}

	prepareItems() {
		let actorData = duplicate(this.data);
		let inventory = {
			arsenal: {
				header: 'ARSENAL',
				weapon: { header: 'WEAPONS', items: [], show: false },
				armor: { header: 'ARMOR', items: [], show: false },
				ammunition: { header: 'AMMUNITION', items: [], show: false }
			},
			possessions: {
				header: 'POSSESSIONS',
				equipment: { header: 'EQUIPMENT', items: [], show: false },
				mod: { header: 'MODIFIER', items: [], show: false },
				artifact: { header: 'ARTIFACT', items: [], show: false },
				burn: { header: 'BURN', items: [], show: false }
			}
		};
		actorData.items.forEach((item) => {
			console.log(item)
			if (inventory.arsenal.hasOwnProperty(item.type)) {
				inventory.arsenal[item.type].items.push(item);
			} else if (inventory.possessions.hasOwnProperty(item.type)) {
				inventory.possessions[item.type].items.push(item);
			}
		});

		return inventory;
	}
}
