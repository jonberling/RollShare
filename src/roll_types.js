// Roll Result

const AdvantageTag = {
  none: "",
  advantage: "advantage",
  disadvantage: "disadvantage",
}

const CriticalTag = {
  none: "",
  natural1: "Natural 1",
  natural20: "Natural 20",
}

class RollResult {
  constructor() {
    // populate with sane default values
    this.total = 0;       // total value of the roll
    this.notation = "";   // roll notation, e.g what would be passed to a `/roll` command
    this.die_faces = [];  // face values of any dice rolled
    this.bonus = 0;       // any flat modifiers to a roll, e.g. +2
    this.type = "";       // to hit, damage, check, save, etc
    this.detail = "";     // weapon name, spell name, skill name, etc
    this.advantage = AdvantageTag.none;   // advantage or disadvantage
    this.critical_tag = CriticalTag.none; // natural 20 or 1
  }
}
