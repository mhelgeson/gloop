export default function pluginLocalStore(opts = {}) {
  const { key = "Gloop", initial = {} } = opts;
  // read state from local storage on initialization
  try {
    this.set(JSON.parse(localStorage.getItem(key)));
  } catch (ex) {
    this.set(initial);
  }
  // save every change
  this.on("state_change", () => {
    localStorage.setItem(key, JSON.stringify(this.get()));
  });
}
