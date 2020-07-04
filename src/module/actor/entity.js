import { OseDice } from "../dice.js";

export class OseActor extends Actor {
  /**
   * Extends data from base Actor class
   */

  prepareData() {
    super.prepareData();
    const data = this.data.data;

    // Compute modifiers from actor scores
    this.computeModifiers();

    // Determine Initiative
    if (game.settings.get("ose", "individualInit")) {
      data.initiative.value = data.initiative.mod;
      if (this.data.type == "character") {
        data.initiative.value += data.scores.dex.mod;
      }
    } else {
      data.initiative.value = 0;
    }
  }
  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers
    /* -------------------------------------------- */

  /* -------------------------------------------- */
  /*  Rolls                                       */
  /* -------------------------------------------- */
  rollSave(save, options = {}) {
    const label = game.i18n.localize(`OSE.saves.${save}.long`);
    const rollParts = ["1d20"];

    const data = {
      ...this.data,
      ...{
        rollData: {
          type: "Save",
          stat: save,
        },
      },
    };

    // Roll and return
    return OseDice.Roll({
      event: options.event,
      parts: rollParts,
      data: data,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${label} ${game.i18n.localize("OSE.SavingThrow")}`,
      title: `${label} ${game.i18n.localize("OSE.SavingThrow")}`,
    });
  }

  rollCheck(score, options = {}) {
    const label = game.i18n.localize(`OSE.scores.${score}.long`);
    const rollParts = ["1d20"];

    const data = {
      ...this.data,
      ...{
        rollData: {
          type: "Check",
          stat: score,
        },
      },
    };

    // Roll and return
    return OseDice.Roll({
      event: options.event,
      parts: rollParts,
      data: data,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${label} ${game.i18n.localize("OSE.AbilityCheck")}`,
      title: `${label} ${game.i18n.localize("OSE.AbilityCheck")}`,
    });
  }

  rollExploration(expl, options = {}) {
    const label = game.i18n.localize(`OSE.exploration.${expl}.long`);
    const rollParts = ["1d6"];

    const data = {
      ...this.data,
      ...{
        rollData: {
          type: "Exploration",
          stat: expl,
        },
      },
    };

    // Roll and return
    return OseDice.Roll({
      event: options.event,
      parts: rollParts,
      data: data,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${label} ${game.i18n.localize("OSE.ExplorationCheck")}`,
      title: `${label} ${game.i18n.localize("OSE.ExplorationCheck")}`,
    });
  }

  rollAttack(attack, options = {}) {
    const label = game.i18n.localize(`OSE.${attack}`);
    const rollParts = ["1d20"];
    const data = this.data.data;

    if (attack == "Missile") {
      rollParts.push(
        "+",
        data.scores.dex.mod.toString(),
        "+",
        data.thac0.mod.missile.toString()
      );
    } else if (attack == "Melee") {
      rollParts.push(
        "+",
        data.scores.str.mod.toString(),
        "+",
        data.thac0.mod.melee.toString()
      );
    }
    if (game.settings.get("ose", "ascendingAC")) {
      rollParts.push("+", this.data.data.thac0.bba.toString());
    }

    const rollData = {
      ...this.data,
      ...{
        rollData: {
          type: "Attack",
          stat: attack,
          scores: data.scores,
        },
      },
    };
    // Roll and return
    return OseDice.Roll({
      event: options.event,
      parts: rollParts,
      data: rollData,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${label} ${game.i18n.localize("OSE.Attack")}`,
      title: `${label} ${game.i18n.localize("OSE.Attack")}`,
    });
  }

  static _valueToMod(val) {
    switch (val) {
      case 3:
        return -3;
      case 4:
      case 5:
        return -2;
      case 6:
      case 7:
      case 8:
        return -1;
      case 9:
      case 10:
      case 11:
      case 12:
        return 0;
      case 13:
      case 14:
      case 15:
        return 1;
      case 16:
      case 17:
        return 2;
      case 18:
        return 3;
      default:
        return 0;
    }
  }

  static _cappedMod(val) {
    let mod = OseActor._valueToMod(val);
    if (mod > 1) {
      mod -= 1;
    } else if (mod < -1) {
      mod += 1;
    }
    return mod;
  }

  computeModifiers() {
    if (this.data.type != "character") {
      return;
    }
    const data = this.data.data;
    data.scores.str.mod = OseActor._valueToMod(this.data.data.scores.str.value);
    data.scores.int.mod = OseActor._valueToMod(this.data.data.scores.int.value);
    data.scores.dex.mod = OseActor._valueToMod(this.data.data.scores.dex.value);
    data.scores.cha.mod = OseActor._valueToMod(this.data.data.scores.cha.value);
    data.scores.wis.mod = OseActor._valueToMod(this.data.data.scores.wis.value);
    data.scores.con.mod = OseActor._valueToMod(this.data.data.scores.con.value);

    data.scores.dex.init = OseActor._cappedMod(this.data.data.scores.dex.value);
    data.scores.cha.npc = OseActor._cappedMod(this.data.data.scores.cha.value);
  }
}