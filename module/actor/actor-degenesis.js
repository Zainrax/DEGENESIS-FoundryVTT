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
			if (focus.value) data.status.ego.max = (focus.value + intellect.value) * 2;
			else if (primal.value) data.status.ego.max = (primal.value + instinct.value) * 2;

			// The Faith Skill and the Willpower Skill cannot
			// be combined, the character has to choose one of them;
			const psyche = data.attributes.psyche;
			const willpower = psyche.skills.willpower;
			const faith = psyche.skills.faith;
			if (willpower.value) data.status.spore.max = (willpower.value + psyche.value) * 2;
			else if (faith.value) data.status.spore.max = (faith.value + psyche.value) * 2;

			const body = data.attributes.body;
			data.status.fleshwounds.max = (body.value + body.skills.toughness.value) * 2;
		} catch (e) {
			console.log(e);
		}
	}

	prepare() {
		let preparedData = {};
		preparedData.attributeSkillGroups = this.sortAttributesSkills();
		preparedData.inventory = this.prepareItems();
		return preparedData;
	}

	sortAttributesSkills() {
		let attributeSkillGroups = {};

		for (let attribute in this.data.data.attributes) {
			attributeSkillGroups[attribute] = {
				label: DEGENESIS.attributes[attribute],
				value: this.data.data.attributes[attribute].value,
				skills: {}
			};
		}
		for (let skill in this.data.data.skills) {
			this.data.data.skills[skill].label = DEGENESIS.skills[skill];
			attributeSkillGroups[this.data.data.skills[skill].attribute].skills[skill] = this.data.data.skills[skill];
		}
		return attributeSkillGroups;
	}

	prepareItems() {
		let actorData = duplicate(this.data);
		let inventory = {
			weapons: { header: 'WEAPONS', items: [] },
			armor: { header: 'ARMOR', items: [] },
			equipment: { header: 'EQUIPMENT', items: [] }
		};

		for (let i of actorData.items) {
			if (i.type == 'weapon') {
				inventory.weapons.items.push(i);
			}
			if (i.type == 'armor') {
				inventory.armor.items.push(i);
			}
			if (i.type == 'equipment') {
				inventory.equipment.items.push(i);
			}
		}
		return inventory;
	}
}
