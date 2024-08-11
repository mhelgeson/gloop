import child_process from "child_process";

const demo = process.argv[2];

const output = [
  '<!doctype html><html><head><meta charset="utf-8">',
  '<link rel="icon" href="data:image/x-icon;base64,AA">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />',
];

const css = child_process.execSync(`postcss ./demo/${demo}/style.css`);
if (css) {
  output.push("<style>", css, "</style>");
}

output.push("</head><body>");

const js = child_process.execSync(`rollup -c -i ./demo/${demo}/index.js`);
if (js) {
  output.push("<script>", js, "</script>");
}

output.push("</body></html>");

process.stdout.write(output.join(""));
