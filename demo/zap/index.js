import Gloop from "../../src/Gloop";
import debug from "../../src/plugin/debug";
import scene from "../../src/plugin/scene";
import viewport from "../../src/plugin/viewport";
import pauseWhenHidden from "../../src/plugin/pauseWhenHidden";

// primary game instance, with extensions
const game = new Gloop();
game.plugin(debug);
game.plugin(scene);
game.plugin(viewport);
game.plugin(pauseWhenHidden);

game.scene.create("mainmenu", () => {
  console.log("zap/mainmenu");
});

game.scene.create("level1", () => {
  console.log("zap/level1");
});

game.scene.create("failed", () => {
  console.log("zap/failed");
});

game.scene.create("success", () => {
  console.log("zap/success");
});

// run it
game.scene.set("mainmenu");
game.start();
