/**
 * SPRITES
 *
 * keep track of added sprites and automatically invoke logic/paint methods
 */
import constants from "../../constants";

// event strings
const { LOOP_LOGIC, LOOP_PAINT } = constants;

// symbol for keeping track of sprite grid cell
const CELL_ID = Symbol("sprites/cell_id");

export default function plugin_sprites (options) {
  const opts = { ...plugin_sprites.defaults, ...options };

  // keep track of all sprites
  const sprites = new Set();

  // keep track of sprites within a grid
  const size = opts.grid;
  const cells = new Map();

  // add a sprite to positional grid
  const cellInsert = (key, sprite) => {
    // initialize a new grid cell
    if (!cells.has(key)){
      cells.set(key, new Set());
    }
    // add to grid cell
    cells.get(key).add(sprite);
    // set sprite property
    sprite[CELL_ID] = key;
  }

  // remove a sprite from positional grid
  const cellRemove = (key, sprite) => {
    if (cells.has(key)){
      // remove from grid cell
      const cell = cells.get(key);
      cell.delete(sprite);
      // remove empty cells from grid
      if (cell.size === 0){
        cells.delete(key);
      }
    }
  };

  // convert pos coords to a grid cell id
  let b36 = n => Math.floor(n/size).toString(36);
  const cellId = ({ x=0, y=0 }={}) => `${b36(x)}.${b36(y)}`;

  // apply sprite logic and update grid cells
  if (opts.onLogic){
    this.on(LOOP_LOGIC, ev => {
      sprites.forEach(sprite => {
        if (sprite.onLogic){
          sprite.onLogic(ev);
          this.sprites.update(sprite);
        }
      });
    });
  }

  // apply sprint paint
  if (opts.onPaint){
    this.on(LOOP_PAINT, ev => {
      sprites.forEach((sprite) => {
        if (sprite.onPaint){
          sprite.onPaint(ev);
        }
      });
    });
  }

  // return "this.sprites" interface
  return {
    name: "sprites",
    // count of current sprites
    size: 0,
    cells,
    // add one sprite
    add: (sprite) => {
      sprites.add(sprite);
      this.sprites.size = sprites.size;
      this.sprites.update(sprite);
    },
    // put sprite in correct pos grid cell
    update: (sprite) => {
      const oldkey = sprite[CELL_ID];
      const newkey = cellId(sprite.pos);
      // key has changed
      if (oldkey !== newkey){
        // remove from current grid cell
        cellRemove(oldkey, sprite);
        // insert into the new grid cell
        cellInsert(newkey, sprite);
      }
    },
    // remove one sprite
    remove: (sprite) => {
      sprites.remove(sprite);
      this.sprites.size = sprites.size;
      // remove from grid cell
      cellRemove(sprite[CELL_ID], sprite);
      // remove sprite property
      delete sprite[CELL_ID];
    },
    // remove all sprites
    empty: () => {
      sprites.clear();
      this.sprites.size = sprites.size;
      cells.clear();
    },
    // iterate all sprites
    forEach: (callback) => sprites.forEach(callback),
    // get all the nearby sprites
    neighbors: (sprite, n=1) => {
      let neighbors = [];
      // find home and adjacent grid cells
      for (let x = -n; x <= n; x++) {
        for (let y = -n; y <= n; y++) {
          let key = cellId({
            x: sprite.pos.x + size * x,
            y: sprite.pos.y + size * y
          });
          if (cells.has(key)){
            neighbors.push(...cells.get(key));
          }
        }
      }
      return neighbors;
    }
  }
}

plugin_sprites.defaults = {
  grid: 50,
  onLogic: true,
  onPaint: true
};
