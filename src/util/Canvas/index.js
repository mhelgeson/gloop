function Canvas(width, height) {
  this.canvas = document.createElement("canvas");
  this.ctx = this.canvas.getContext("2d");
  // initialize the position state
  this.pos = { x: 0, y: 0, w: 0, h: 0 };
  // initial dimensions
  this.size(width, height);
}

Canvas.prototype = {
  // apply dimensions
  size: function (width, height) {
    // set scale factor based on device
    let dpr = 1; //window.devicePixelRatio ?? 1;
    // this.ctx.scale(dpr, dpr);
    // adjust canvas resolution
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    // track pos unscaled
    this.pos.w = width;
    this.pos.h = height;
    return this;
  },
  draw: function (callback) {
    this.ctx.save();
    callback.call(this, this.ctx);
    this.ctx.restore();
    return this;
  },
  clear: function (x, y, w, h) {
    this.ctx.clearRect(x || 0, y || 0, w || this.pos.w, h || this.pos.h);
    return this;
  },
  circ: function (r, x, y) {
    this.ctx.arc(x || this.pos.x, y || this.pos.y, r, 0, 2 * Math.PI, false);
    return this;
  },
  rect: function (x, y, w, h) {
    this.ctx.rect(
      x || this.pos.x,
      y || this.pos.y,
      w || this.pos.w,
      h || this.pos.h,
    );
    return this;
  },
  move: function (x, y) {
    this.ctx.moveTo((this.pos.x = x), (this.pos.y = y));
    return this;
  },
  line: function (x, y) {
    this.ctx.lineTo((this.pos.x = x), (this.pos.y = y));
    return this;
  },
  alpha: function (alpha) {
    this.ctx.globalAlpha = alpha || 1;
    return this;
  },
  set: function (opts) {
    extend.call(this.ctx, opts || {});
    return this;
  },
  path: function (str) {
    this.ctx.closePath();
    this.ctx.beginPath();
    if (typeof str == "string") {
      str.split(" ").forEach(function (cmd) {
        if ((cmd = /^(M|L)(\d+),(\d+)$/.exec(cmd))) {
          if (cmd[1] == "M") {
            this.move(cmd[2], cmd[3]);
          }
          if (cmd[1] == "L") {
            this.line(cmd[2], cmd[3]);
          }
        }
      }, this);
    }
    return this;
  },
  fill: function (clr) {
    if (clr) {
      this.ctx.fillStyle = clr;
    }
    if (this.textString) {
      this.ctx.fillText(this.textString, this.pos.x, this.pos.y);
    }
    this.ctx.fill();
    return this;
  },
  stroke: function (clr, w) {
    if (clr) {
      this.ctx.strokeStyle = clr;
    }
    if (w) {
      this.ctx.lineWidth = w;
    }
    this.ctx.lineCap = "round";
    if (this.textString) {
      this.ctx.strokeText(this.textString, this.pos.x, this.pos.y);
    }
    this.ctx.stroke();
    return this;
  },
  text: function (str, styles = {}) {
    this.textString = str;
    this.ctx.font = styles?.font;
    this.ctx.textAlign = styles?.textAlign;
    this.ctx.textBaseline = styles?.textBaseline;
    return this;
  },
  url: function () {
    return this.elem.toDataURL();
  },
};

export default Canvas;
