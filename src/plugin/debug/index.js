/**
 * DEBUG
 *
 * adds small overlay with clock, frame rates, game controls, logs events
 */

import $ from "../../util/$dom";
import constants from "../../constants";

// event strings
const { STATE_CHANGE, LOOP_LOGIC, LOOP_PAINT, WILDCARD } = constants;

// state strings
const { DEBUG, TIMEWARP, PAUSED, STOPPED, CLOCK } = constants;

export default function plugin_debug(options) {
  // merge defaults and options
  const opts = { ...plugin_debug.defaults, ...options };

  // set a flag for other extensions to utilize
  this.set(DEBUG, true);

  // omit events that are too noisy
  const OMIT = new Set(opts.omit);

  // print events w/state to the console
  this.on(WILDCARD, ({ type, ...props }) => {
    if (OMIT.has(type) !== true) {
      const style = opts.styles[type.split("_").shift()] || opts.styles.default;
      console.groupCollapsed(`${opts.id} %c${type}`.trim(), style, props);
      console.table(this.state);
      console.groupEnd();
    }
  });

  // small overlay to display timing and controls
  const $div = $(opts.overlay_markup);

  $div.css(opts.overlay_styles);

  $div.appendTo(document.body);

  // ref elements to be updated
  const $clock = $("#debug-clock");
  const $logic = $("#debug-logic");
  const $paint = $("#debug-paint");

  // pause/resume control
  const $pause = $("#debug-pause")
    .on("click", () => {
      this.get(PAUSED) ? this.resume() : this.pause();
    })
    .css("fontFamily", "monospace");

  // start/stop control
  const $stop = $("#debug-stop")
    .on("click", () => {
      this.get(STOPPED) ? this.start() : this.stop();
    })
    .css("fontFamily", "monospace");

  // warp time to slowdown, speedup, reverse
  const $warp = $("#debug-timewarp").on("change", (ev) => {
    this.set(TIMEWARP, parseFloat(ev.target.value));
  });

  // update control values from game state
  this.on(STATE_CHANGE, ({ key, value }) => {
    if (key === PAUSED) {
      $pause.html(value ? "RESUME" : "PAUSE");
    }
    if (key === STOPPED) {
      $stop.html(value ? "START" : "STOP");
    }
    if (key === TIMEWARP) {
      $warp.attr("value", value);
    }
  });

  let logic_time = 1;
  let logic_frames = 200;
  this.on(LOOP_LOGIC, ({ tick }) => {
    logic_time += tick / this.get(TIMEWARP);
    logic_frames += 1;
  });

  let paint_time = 1;
  let paint_frames = 60;

  this.on(LOOP_PAINT, ({ tick }) => {
    paint_time += tick / this.get(TIMEWARP);
    paint_frames += 1;
    if (paint_time > opts.fps_sample) {
      $paint.html(`${Math.round(paint_frames / paint_time)} fps`);
      paint_time = 0;
      paint_frames = 0;
    }
    if (logic_time > opts.fps_sample) {
      $logic.html(`${Math.round(logic_frames / logic_time)} fps`);
      logic_time = 0;
      logic_frames = 0;
    }
    // update the game clock
    const clock = (Math.round(this.get(CLOCK) * 1e3) / 1e3).toFixed(3);
    $clock.html(`${clock} sec`);
  });
}

plugin_debug.defaults = {
  id: "",
  omit: [LOOP_LOGIC, LOOP_PAINT, STATE_CHANGE],
  styles: {
    loop: "background:#FCF",
    clock: "background:#FCC",
    state: "background:#FFC",
    scene: "background:#CFC",
    viewport: "background:#CFF",
    default: "background:#CCF",
  },
  // fps calculation
  fps_sample: 0.25,
  overlay_markup: `
    <div>
      <table>
        <tr>
          <td colspan="2">
            <button id="debug-stop">START</button>
            <button id="debug-pause">PAUSE</button>
          </td>
        </tr>
        <tr>
          <td>speed:</td>
          <td>
            <select id="debug-timewarp">
            <option value="0.1">slower</option>
            <option value="0.5">slow</option>
            <option value="1" selected>normal</option>
            <option value="2">fast</option>
            <option value="-1">reverse</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>logic:</td>
          <td id="debug-logic">0 fps</td>
        </tr>
        <tr>
          <td>paint:</td>
          <td id="debug-paint">0 fps</td>
        </tr>
        <tr>
          <td>clock:</td>
          <td id="debug-clock">0 sec</td>
        </tr>

      </table>
    </div>
  `,
  overlay_styles: {
    position: "absolute",
    top: "4px",
    right: "4px",
    fontFamily: "monospace",
    border: "1px solid rgba(0,0,0,.75)",
    borderRadius: "4px",
    background: "rgba(255,255,255,.75)",
    padding: "4px",
    zIndex: "9999",
  },
};
