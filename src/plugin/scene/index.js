/**
 * SCENE
 *
 * keep track of active scene and loading and unloading functions
 */
import constants from "../../constants";

// event strings
const { STATE_CHANGE, SCENE_LEAVE, SCENE_ENTER } = constants;

// state strings
const { SCENE } = constants;

export default function plugin_scene(options) {
  const scenes = new Map();

  // default listeners
  this.on(STATE_CHANGE, ({ key, value, previous }) => {
    if (key === SCENE) {
      if (previous) {
        this.emit(SCENE_LEAVE, { name: previous });
      }
      if (value) {
        this.emit(SCENE_ENTER, { name: value });
      }
    }
  });

  this.on(SCENE_LEAVE, ({ name }) => {
    // clean up current scene
    const scene = scenes.get(name) || {};
    scene.teardown?.call(this);
  });

  this.on(SCENE_ENTER, ({ name }) => {
    // apply the new scene
    const scene = scenes.get(name) || {};
    scene.teardown = scene.setup?.call(this);
  });

  return {
    name: "scene",
    create: (name, setup) => {
      scenes.set(name, { setup });
    },
    set: (name) => {
      this.set(SCENE, name);
    },
  };
}
