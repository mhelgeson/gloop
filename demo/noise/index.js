import Gloop from "../../src/Gloop/index.js";
import debug from "../../src/plugin/debug/index.js";
import scene from "../../src/plugin/scene/index.js";
import localStore from "../../src/plugin/localStore";

import $ from "../../src/util/$dom";
import makeNoise from "../../src/util/makeNoise/index.js";
import makeRandom from "../../src/util/makeRandom/index.js";
import asyncBackground from "../../src/util/asyncBackground/index.js";
import hsl2rgb from "../../src/util/color/hsl2rgb";

const game = new Gloop();
game.plugin(debug, {
  omit: ["loop_logic"],
  overlay_styles: { display: "none" }
});
game.plugin(scene);
game.plugin(localStore, {
  initial: {
    width: 500,
    height: 500,
    seed: "",
    octaves: 1,
    amplitude: .5,
    frequency: 1,
    gain: .5,
    lacunarity: 1,
    mode: "grayscale"
  }
});

game.scene.create("main", () => {
  // initialize config parameters
  $(`
    <div id="noise-wrap">
      <table cellpadding="0" cellspacing="0">
        <tbody>
          <tr>
            <td>seed</td>
            <td><input type="text" id="input-seed" /></td>
          </tr>
          <tr>
            <td>width</td>
            <td><input type="text" id="input-width" /></td>
          </tr>
          <tr>
            <td>height</td>
            <td><input type="text" id="input-height" /></td>
          </tr>
          <tr>
            <td>octaves</td>
            <td><input type="text" id="input-octaves" /></td>
          </tr>
          <tr>
            <td>amplitude</td>
            <td><input type="text" id="input-amplitude" /></td>
          </tr>
          <tr>
            <td>frequency</td>
            <td><input type="text" id="input-frequency" /></td>
          </tr>
          <tr>
            <td>gain</td>
            <td><input type="text" id="input-gain" /></td>
          </tr>
          <tr>
            <td>lacunarity</td>
            <td><input type="text" id="input-lacunarity" /></td>
          </tr>
          <tr>
            <td>color mode</td>
            <td>
              <select id="input-mode">
                <option>grayscale</option>
                <option>marble</option>
                <option>warm-hues</option>
                <option>cool-hues</option>
                <option>clouds</option>
                <option>purple-haze</option>
                <option>blue-green</option>
                <option>rainbow</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>
              <input type="button" id="input-update" value="RENDER" />
              <span id="noise-time"></span>
            </td>
          </tr>
        </tbody>
      </table>
      <canvas id="noise1" width="${game.get("width")}" height="${game.get("height")}"></canvas>
    </div>
  `).appendTo(document.body);

  $("#noise-wrap input[type=text]").on("change", ev => {
    const key = ev.target.id.split("-").pop();
    const value = ev.target.value;
    game.set(key, value);
  });

  $("#input-mode").on("change", ev => {
    const key = ev.target.id.split("-").pop();
    const value = ev.target.value;
    game.set(key, value);
  });

  const fields = [
    "width",
    "height",
    "seed",
    "octaves",
    "amplitude",
    "frequency",
    "gain",
    "lacunarity",
    "mode"
  ];

  // initialize the inputs
  fields.forEach(key => {
    $(`#input-${key}`)[0].value = game.get(key);
  });

  // update the inputs
  game.on("state_change", ({ key, value }) => {
    $(`#input-${key}`)[0].value = value;
  });

  // handle submit
  const $button = $("#input-update").on("click", () => updateCanvas());

  // set up canvas
  const canvas = $("#noise1")[0];
  const ctx = canvas.getContext("2d");

  const updateCanvas = async () => {
    // update button
    $button[0].disabled = true;
    $button[0].value = "LOADING";
    $("#noise-time").html("...");
    const time = Date.now();
    // render image async
    const imgdata = await renderNoise(game.get());
    // adjust container and paint
    canvas.width = game.get("width");
    canvas.height = game.get("height");
    ctx.putImageData(imgdata, 0, 0);
    // restore button
    $button[0].disabled = false;
    $button[0].value = "RENDER";
    $("#noise-time").html(`${(Date.now()-time)/1e3} sec`)
  };

  // render noise image data in a bg worker thread
  const renderNoise = asyncBackground(opts => {
    // configure noise function
    const noise = makeNoise(opts);
    // set canvas dimensions
    const { width: w, height: h } = opts;
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext("2d");
    // render the canvas image data
    const imageData = ctx.createImageData(w, h);
    const len = imageData.data.length;
    for (let i = 0; i < len; i += 4) {
      // compute coords
      const x = (i % (w * 4)) / 4;
      const y = Math.floor(i / (w * 4));
      // determine color output
      const n = noise(x / w, y / h);
      let r = 255, g = 255, b = 255, hue = 0, sat = 0, lum = 0;
      switch (opts.mode){
        case "marble":
          hue = 0;
          sat = 0;
          lum = Math.abs(n) * 500;
          [r, g, b] = hsl2rgb(hue, sat, lum);
          break;
        case "blue-green":
          hue = n > 0 ? 240 : 240;
          sat = n > 0 ? 75 : 100;
          lum = 100 - Math.abs(n) * 50;
          [r, g, b] = hsl2rgb(hue, sat, lum);
          break;
        case "clouds":
          hue = 240;
          sat = 100;
          lum = 50 + ((n+1)/2) * 50;
          [r, g, b] = hsl2rgb(hue, sat, lum);
          break;
        case "warm-hues":
          hue = 60 * n;
          sat = 100;
          lum = 50 + 50 * n;
          [r, g, b] = hsl2rgb(hue, sat, lum);
          break;
        case "cool-hues":
          hue = 240 + 60 * n;
          sat = 100;
          lum = 25 + 50 * n;
          [r, g, b] = hsl2rgb(hue, sat, lum);
          break;
        case "purple-haze":
          r = 128 - 128 * ((n+1)/2);
          g = 0;
          b = 255 - 255 * ((n+1)/2);
          break;
        case "rainbow":
            hue = 360 * n;
            sat = 100;
            lum = 50;
            [r, g, b] = hsl2rgb(hue, sat, lum);
            break;
        case "grayscale": default:
          r = g = b = 255 * ((n+1)/2);
          break;
      }
      // update pixel color
      imageData.data[i + 0] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
      imageData.data[i + 3] = 255;
    }
    return imageData;
  // include these dependencies
  }, [makeNoise, makeRandom, hsl2rgb]);

  updateCanvas();
});

game.scene.set("main");
