// Roll Result

export const RollType = {
  regular: "regular",
  advantage: "advantage",
  disadvantage: "disadvantage",
}

export const CriticalTag = {
  none: "",
  natural1: "Natural 1",
  natural20: "Natural 20",
}

export class RollResult {
  constructor() {
    this.total = 0;
    this.roll_cmd = "";
    this.die_faces = [];
    this.bonus = 0;
    this.name = ""
    this.type = RollType.regular;
    this.CriticalTag = CriticalTag.none
  }
}
