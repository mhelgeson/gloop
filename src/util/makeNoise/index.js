import makeRandom from "../makeRandom";

function makeNoise (options){

  // configuration
  let opts = Object.assign({
    seed: "",
    amplitude: 1,
    frequency: 1,
    lacunarity: 1, // range >1
    octaves: 1,
    gain: 1 // range 0-1
  }, options || {});

  // internal vars
  let grid = Object.create(null);
  let memo = Object.create(null);

  // random number generator
  const random = makeRandom(opts.seed);

  // random unit vector
  const vRand = () => {
    const rad = random(6.283185);
    return { x: Math.sin(rad), y: Math.cos(rad) };
  };

  // dot product grid
  const dot = (x, y, vx, vy) => {
    // retrieve or create a random vector instead of seeded permutation
    let vector = grid[[vx,vy]] ?? (grid[[vx,vy]] = vRand());
    return (x - vx) * vector.x + (y - vy) * vector.y;
  };

  // smoother step
  const smoothstep = (x) => 6*x**5 - 15*x**4 + 10*x**3;

  // interpolate
  const interpolate = (x, a, b) => a + smoothstep(x) * (b-a);

  // perlin noise value for x, y coords
  const perlin = (x, y) => {
    if (memo[[x,y]] == null){
      let xf = Math.floor(x);
      let yf = Math.floor(y);
      // dot product grid corners
      let nw = dot(x, y, xf, yf);
      let ne = dot(x, y, xf + 1, yf);
      let sw = dot(x, y, xf, yf + 1);
      let se = dot(x, y, xf + 1, yf + 1);
      // interpolate
      let xt = interpolate(x-xf, nw, ne);
      let xb = interpolate(x-xf, sw, se);
      // store the final value
      memo[[x,y]] = interpolate(y-yf, xt, xb);
    }
    // return cached value
    return memo[[x,y]];
  };

  // fractal brownian motion - depending on options
  return function noise (x, y){
    let value = 0;
    let { amplitude, frequency, lacunarity, octaves, gain } =  opts;
    for (let i = 0; i < octaves; i++) {
      value += amplitude * perlin(x * frequency, y * frequency);
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return value;
  };
}

export default makeNoise;
