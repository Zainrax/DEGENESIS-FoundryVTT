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
				section: {
					weapon: { header: 'WEAPONS', items: [], show: false, equiptable: true },
					armor: { header: 'ARMOR', items: [], show: false, equiptable: true },
					ammunition: { header: 'AMMUNITION', items: [], show: false, equiptable: true }
				}
			},
			possessions: {
				header: 'POSSESSIONS',
				section: {
					equipment: { header: 'EQUIPMENT', items: [], show: false, equiptable: false},
					mod: { header: 'MODIFIER', items: [], show: false, equiptable: false },
					artifact: { header: 'ARTIFACT', items: [], show: false, equiptable: false },
					burn: { header: 'BURN', items: [], show: false, equiptable: false }
				}
			}
		};
		actorData.items.forEach((item) => {
			if (inventory.arsenal.section.hasOwnProperty(item.type)) {
				inventory.arsenal.section[item.type].items.push(item);
				inventory.arsenal.section[item.type].equiptable = item.data.hasOwnProperty("equipped")
			} else if (inventory.possessions.section.hasOwnProperty(item.type)) {
				inventory.possessions.section[item.type].items.push(item)
				inventory.possessions.section[item.type].equiptable = item.data.hasOwnProperty("equipped");
			}
		});

		return inventory;
	}
}
