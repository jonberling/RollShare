
function set_advantage(dice_roll) {

  // check for advantage or disadvantage; criticals
  if (dice_roll.notation.includes("d20")) {
    if (dice_roll.notation.includes("kh1")) { dice_roll.advantage = "advantage"; }
    if (dice_roll.notation.includes("kl1")) { dice_roll.advantage = "disadvantage"; }

    // check for critical success or fail
    roll = Math.max(...dice_roll.rolls);
    if (dice_roll.advantage === "disadvantage") {
      roll = Math.min(...dice_roll.rolls);
    }
    if (roll === 20) { dice_roll.critical = "success"; }
    if (roll ===  1) { dice_roll.critical = "fail"; }
  }

  return dice_roll;
}
