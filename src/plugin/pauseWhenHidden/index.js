export default function pluginPauseWhenHidden(options) {
  // pause the game when window/tab is unfocused...
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      this.pause();
    }
  });
}
