const time = () => Date.now(); // performance.now();

const loop = (callback, ms) => {
  let then = time();
  // loop by timeout or animation frame
  const next = ms ? (fn) => setTimeout(fn, ms) : requestAnimationFrame;
  // recursive
  const frame = () => {
    const now = time();
    // convert time change to seconds
    const sec = (now - then) / 1000;
    // continue while not exactly false
    if (callback(sec) !== false) {
      // schedule next tick
      next(frame);
      // move time forward
      then = now;
    }
  };
  // start looping
  frame();
};

export default loop;
