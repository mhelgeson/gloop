import makeGuid from "../makeGuid";

const guid = makeGuid("async-bg");
const SIGTERM = "TERMINATE";

const asyncBackground = (func, deps = []) => {
  // wrap the function for control and error handling
  const wrapped = `(() => {
    ${deps.map((dep) => dep.toString()).join(";")}
    const handler = ${func.toString()};
    onmessage = (ev) => {
      const { id, args } = ev.data;
      try { postMessage({ id, result: handler(...args) }) }
      catch (error){ postMessage({ id, error }) }
    };
  })()`;
  // convert function to anonymous text blob
  const blob = new Blob([wrapped]);
  // construct url from function blob
  const url = URL.createObjectURL(blob, { type: "application/javascript" });
  // create background worker
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  const terminate = () => {
    // overwrite postMessage to throw error on terminated worker
    worker.postMessage = () => {
      throw new Error("worker terminated");
    };
    return worker.terminate();
  };
  // worker promise factory
  return (...args) =>
    new Promise((resolve, reject) => {
      // allow a special arg to shut down worker
      if (args.length === 1 && args[0] === SIGTERM) {
        resolve(terminate());
      }
      // listen and message the worker
      const id = guid();
      const handler = (ev) => {
        if (ev.data.id === id) {
          const { result, error } = ev.data;
          worker.removeEventListener("message", handler);
          result != null ? resolve(result) : reject(error);
        }
      };
      worker.addEventListener("message", handler);
      // terminate on uncaught exceptions
      worker.addEventListener("error", (err) => {
        terminate();
        reject(err);
      });
      worker.postMessage({ id, args });
    });
};

export default asyncBackground;
