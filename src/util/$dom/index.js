const MARKUP = /^\s*<.+>\s*$/s;

function createHTML(html) {
  // placeholder container
  let div = document.createElement("div");
  // lazy way to create all elements
  div.innerHTML = html;
  // extract everything created
  return [...div.children].map((node) => div.removeChild(node));
}

// small jQuery-style dom framework
function $dom(selector, scope) {
  // auto instantiate
  if (!(this instanceof $dom)) {
    return new $dom(selector, scope);
  }
  switch (typeof selector) {
    // array/nodelist
    case Array.isArray(selector) && "object":
    case selector instanceof NodeList && "object":
      return this.push(...selector);
    // straight node elem
    case "object":
      return this.push(selector);
    // string selector or markup
    case "string":
      if (MARKUP.test(selector)) {
        return this.push(...createHTML(selector));
      } else {
        return this.find(selector, scope);
      }
  }
}

// instance methods
$dom.prototype = {
  push: function (...args) {
    [].push.apply(this, args);
    return this;
  },
  find: function (selector, scope) {
    scope = scope || this[0] || document || documentElement;
    return this.push(...scope.querySelectorAll(selector));
  },
  forEach: function (iterator) {
    [].forEach.call(this, iterator);
    return this; // chain
  },
  on: function (type, listener) {
    return this.forEach((elem) => elem.addEventListener(type, listener));
  },
  off: function (type, listener) {
    return this.forEach((elem) => elem.removeEventListener(type, listener));
  },
  attr: function (...args) {
    const [name, value] = args;
    if (this.length > 0 && args.length === 1) {
      return this[0][name]; // getter
    } else if (args.length === 2) {
      this.forEach((elem) => (elem[name] = value)); // setter
    }
    return this; // chain
  },
  html: function (...args) {
    return this.attr(...["innerHTML", ...args]);
  },
  css: function (name, value) {
    if (typeof name === "object") {
      Object.keys(name).forEach((key) => this.css(key, name[key]));
      return this;
    }
    return this.forEach((elem) => (elem.style[name] = value));
  },
  show: function () {
    return this.css("display", "block");
  },
  hide: function () {
    return this.css("display", "none");
  },
  hasClass: function (...args) {
    return this.forEach((elem) => elem.classList.contains(...args));
  },
  addClass: function (...args) {
    return this.forEach((elem) => elem.classList.add(...args));
  },
  removeClass: function (...args) {
    return this.forEach((elem) => elem.classList.remove(...args));
  },
  toggleClass: function (...args) {
    return this.forEach((elem) => elem.classList.toggle(...args));
  },
  appendTo: function (parent) {
    return this.forEach((node) => parent.appendChild(node));
  },
  append: function (child) {
    this[0].appendChild(child);
    return this;
  },
  remove: function () {
    return this.forEach((node) => node.parentNode.removeChild(node));
  },
};

export default $dom;
