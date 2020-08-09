/**
 * Utility Methods
 */

// map of known TTRPG abbreviations to full words
const _abbreviation_map = new Map();
_abbreviation_map.set("str", "Strength");
_abbreviation_map.set("dex", "Dexterity");
_abbreviation_map.set("con", "Consitution");
_abbreviation_map.set("int", "Intelligence");
_abbreviation_map.set("wis", "Wisdom");
_abbreviation_map.set("cha", "Charisma");
_abbreviation_map.set("adv", "advantage");
_abbreviation_map.set("dis", "disadvantage");

/**
 * Get the full word from a known TTRPG abbreviation
 * @param {string} abbreviation an abbreviation
 * @returns {string} a full word if known; otherwise the abbreviation
 */
function abbreviationToWord(abbreviation) {
  if (_abbreviation_map.has(abbreviation)) {
    return _abbreviation_map.get(abbreviation);
  }
  return abbreviation;
}
