/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { DegenesisItemSheet } from "./scripts/item/item-sheet.js";
import { DegenesisItem } from "./scripts/item/item-degenesis.js";
import { DegenesisActorSheet } from "./scripts/actor/actor-sheet.js";
import { DegenesisActor } from "./scripts/actor/actor-degenesis.js";

// import tippy from './node_modules/tippy.js';
// import './node_modules/tippy.js/dist/tippy.css'; // optional for styling

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log(`%cDEGENESIS` + `%c | Initializing`, "color: #ed1d27", "color: unset");

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	CONFIG.Combat.initiative = {
	  formula: "1d20",
    decimals: 2
  };

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("dnd5e", DegenesisActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dnd5e", DegenesisItemSheet, {makeDefault: true});

  // Pre-load templates
  loadTemplates([
    "systems/degenesis/templates/actor/actor-main.html",
    "systems/degenesis/templates/actor/actor-attributes-skills.html",
    "systems/degenesis/templates/actor/actor-advantages.html",
    "systems/degenesis/templates/actor/actor-inventory.html"
  ]);

    // Assign the actor class to the CONFIG
  CONFIG.Actor.entityClass = DegenesisActor;
  CONFIG.Item.entityClass = DegenesisItem;

  Handlebars.registerHelper("stat", (value, max, total) => {
    const diffMax = Math.max(0, max - value);
    const diffTotal = max <= 0 ? total - value : total - max
    console.log(value)
    console.log(max)
    console.log(total)
    console.log(diffTotal)
    let valueStats = Array(value).fill().map((_, i) => `<a class="stat-selected" data-stat="${i+1}"><i class="fas fa-square"></i></a>`).join('\n')
    let maxStats = Array(diffMax).fill().map((_, i) => `<a class="stat-max" data-stat="${i+1}"><i class="fas fa-square"></i></a>`).join('\n')
    let totalStats = Array(diffTotal).fill().map((_, i) => `<a class="stat-total" data-stat="${i+1}"><i class="far fa-square"></i></a>`).join('\n')

    return "<div class='stat-block'>\n" + valueStats + maxStats + totalStats  + "\n</div>"
  })
});
