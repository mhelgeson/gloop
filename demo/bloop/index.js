import Gloop from "../../src/Gloop";
// plugins
import debug from "../../src/plugin/debug";
import scene from "../../src/plugin/scene";
import sprites from "../../src/plugin/sprites";
import viewport from "../../src/plugin/viewport";
import pauseWhenHidden from "../../src/plugin/pauseWhenHidden";
// utilities
import Canvas from "../../src/util/Canvas";
import makeNoise from "../../src/util/makeNoise";
import makeRandom from "../../src/util/makeRandom";
import vAdd from "../../src/util/vector/add";
import vCreate from "../../src/util/vector/create";
import vDivide from "../../src/util/vector/divide";
import vDot from "../../src/util/vector/dot";
import vLength from "../../src/util/vector/length";
import vMultiply from "../../src/util/vector/multiply";
import vNormalize from "../../src/util/vector/normalize";
import vSubtract from "../../src/util/vector/subtract";

// primary game instance, with extensions
const game = new Gloop()
game.plugin(debug);
game.plugin(scene);
game.plugin(viewport);
game.plugin(sprites, { grid: 20, onPaint: false });
game.plugin(pauseWhenHidden);

// const random = makeRandom("bloop");
const random = makeRandom();
const noise = makeNoise();

const size = 20;

// build the game
game.scene.create("bloopers", () => {

  const {w, h} = game.get("viewport");
  const canvas = new Canvas(w, h);
  document.body.appendChild(canvas.canvas);

  game.on("viewport_resize", ({ w, h }) => canvas.size(w, h));

  for (let i = 0; i < 3000; i++) {
    let entity = new Ball({
      d: size,
      x: Math.round(random(w)),
      y: Math.round(random(h)),
      vx: Math.round(random(-10, 10)),
      vy: Math.round(random(-10, 10))
    });
    game.sprites.add(entity);
  }
  // for (let i = 0; i < 600; i++) {
  //   let entity = new Ball({
  //     d: size * 2,
  //     x: random(w),
  //     y: random(h),
  //     vx: random(-100, 100),
  //     vy: random(-100, 100)
  //   });
  //   // console.log(entity);
  //   game.sprites.add(entity);
  // }

  game.on("loop_logic", ({ tick }) => {
    if (game.get("paused")){
      return;
    }

    // detect collisions
    const pairs_map = {};
    game.sprites.forEach(sprite => {
      // detect collisions
      game.sprites.neighbors(sprite).forEach(other => {
        let a = sprite.id < other.id ? sprite : other;
        let b = sprite.id < other.id ? other : sprite;
        let key = `${a.id}:${b.id}`;
        if (a !== b && !pairs_map[key]) {
          let distance = vLength(vSubtract(a.pos, b.pos));
          if (distance <= a.r + b.r) {
            pairs_map[key] = [a, b];
          }
        }
      });
    });

    // collide pairs
    const pairs_list = Object.values(pairs_map);
    if (pairs_list.length > 0) {
      // console.log("collisions", pairs_list);
      pairs_list.forEach(([a, b]) => {
        // vector direction between centers
        const npos = vNormalize(vSubtract(a.pos, b.pos));
        const rvel = vSubtract(a.vel, b.vel);
        const speed = vDot(npos, rvel);
        // exit if already moving apart
        if (tick > 0 ? speed > 0 : speed < 0) {
          return;
        }
        // Calculate impulse vector
        const impulse = vMultiply(npos, 2 * speed / ( 1/a.mass + 1/b.mass ));
        // apply (repelling) impulse
        a.vel = vSubtract(a.vel, vDivide(impulse, a.mass));
        b.vel = vAdd(b.vel, vDivide(impulse, b.mass));
      });
    }
  });

  canvas.ctx.save();
  game.on("loop_paint", () => {
    if (game.get("paused")){
      return;
    }
    canvas.clear();

    game.sprites.forEach(ball => {
      ball.render(canvas);
    });
  });
});

const gravity = vCreate(0, 0); // 200

class Ball {
  static guid = 0;

  constructor(params, parent_node){
    const {
      mass, // mass
      d = 30, // diameter
      x, // x position
      y, // y position
      vx, // x velocity
      vy, // y velocity
    } = params;
    this.id = Ball.guid++;
    // radius
    let r = this.r = d/2;
    // diameter
    this.d = d;
    // mass
    this.mass = mass ?? (Math.PI * r * r);
    // position
    this.pos = vCreate(x, y);
    // velocity
    this.vel = vCreate(vx, vy);
    // acceleration
    this.acc = vCreate(0, 0);
  }

  // add force to the acceleration

  // Force = mass * acc
  applyForce(acc, time){
    // accommodate mass
    let force = vMultiply(acc, this.mass);
    // acceleration delta
    let delta = vMultiply(force, time);
    // update acceleration
    this.acc = vAdd(this.acc, delta);
  }

  // apply change in velocity
  updateVel(time){
    // velocity = acceleration * time
    let delta = vMultiply(this.acc, time);
    this.vel = vAdd(this.vel, delta);
  }

  // apply change in position
  updatePos(time){
    // position = velocity * time
    let delta = vMultiply(this.vel, time);
    this.pos = vAdd(this.pos, delta);
  }

  onLogic({ tick }){
    if (game.get("paused")){
      return;
    }
    this.updateVel(tick);
    this.updatePos(tick);
    // world boundaries
    this.collideWalls();
    // clear acceleration
    this.acc = vCreate();
    // impulse/thrust
    // attraction/gravity
    // attraction/magnetism
    // tension
    // normal/contact
    // friction
    // resistance/drag
    // elastic/spring
    this.applyForce(gravity, tick);
  }

  // reflection boundaries
  collideWalls(){
    const {w, h} = game.get("viewport");
    const timeForward = game.get("timewarp") > 0;
    let { pos, vel, r } = this;
    // clamp within container bounds
    pos = vCreate(
      Math.max(r, Math.min(w-r, pos.x)),
      Math.max(r, Math.min(h-r, pos.y))
    );
    if (timeForward === true){
      if ((pos.x >= w-r && vel.x > 0) || (pos.x <= r && vel.x < 0)) {
        vel = vMultiply(vel, { x: -1, y: 1 });
      }
      if ((pos.y >= h-r && vel.y > 0) || (pos.y <= r && vel.y < 0)) {
        vel = vMultiply(vel, { x: 1, y: -1 });
      }
    }
    if (timeForward === false){
      if ((pos.x >= w-r && vel.x < 0) || (pos.x <= r && vel.x > 0)) {
        vel = vMultiply(vel, { x: -1, y: 1 });
      }
      if ((pos.y >= h-r && vel.y < 0) || (pos.y <= r && vel.y > 0)) {
        vel = vMultiply(vel, { x: 1, y: -1 });
      }
    }
    this.vel = vel;
    this.pos = pos;
  }
  color(x, y){
    const {w, h} = game.get("viewport");
    // resolve position to a grid percentage
    x = Math.round(x/size) / Math.round(w/size);
    y = Math.round(y/size) / Math.round(h/size);
    let n = Math.round(noise(x, y) * 240);
    return `hsla(${n},100%,50%,.5)`;
  }

  render(canvas){
    const { r, pos: { x, y} } = this;
    canvas.ctx.beginPath();
    canvas
      .circ(r-1, x, y)
      .fill(this.color(x, y))
      .stroke("#888", 2);
    canvas.ctx.closePath();
  }
}

// run it
game.scene.set("bloopers");
game.start();
