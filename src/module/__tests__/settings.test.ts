/**
 * @file Contains tests for settings
 */
// eslint-disable-next-line prettier/prettier, import/no-cycle
import { QuenchMethods } from "../../e2e";
import OSE from "../config";

export const key = "ose.settings";
export const options = {
  displayName: "OSE: Settings",
};

export default ({ describe, it, expect }: QuenchMethods) => {
  describe("Settings", () => {

    describe("applyDamageOption", () => {


      it("Settings menu is populated", async () => {
            expect(game.settings.settings.get(game.system.id+ ".applyDamageOption")?.choices).contains({selected:"OSE.Setting.damageSelected"});
            expect(game.settings.settings.get(game.system.id+ ".applyDamageOption")?.choices).contains({targeted:"OSE.Setting.damageTarget"});
            expect(game.settings.settings.get(game.system.id+ ".applyDamageOption")?.choices).contains({originalTarget:"OSE.Setting.damageOriginalTarget"});
      });
    });
  });
};
