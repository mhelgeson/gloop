import Gloop from "../../src/Gloop/index.js";
import debug from "../../src/plugin/debug/index.js";
import scene from "../../src/plugin/scene/index.js";
import $ from "../../src/util/$dom";

const game = new Gloop();
game.plugin(debug);
game.plugin(scene);

const size = 3;
const symbols = "XO";
const pattern =
  "(###......)|(...###...)|(......###)|(#..#..#..)|(.#..#..#.)|(..#..#..#)|(#...#...#)|(..#.#.#..)";
const makeRegExp = (char) => new RegExp(pattern.replace(/#/g, char));
const x_wins = makeRegExp(symbols[0]);
const o_wins = makeRegExp(symbols[1]);

// should there be a method for next paint?
$(`
  <div id="ttt-wrap">
    <table cellpadding="0" cellspacing="0">
      <tbody id="ttt-grid"></tbody>
    </table>
    <div id="ttt-message"></div>
  </div>
`).appendTo(document.body);

// update the board on paint/render
const render = () => {
  // current board layout
  const board = game.get("board");
  // draw the board
  const cells = [];
  for (let i = 0; i < size; i++) {
    cells.push("<tr>");
    for (let j = 0; j < size; j++) {
      let c = i * size + j;
      cells.push(`<td data-index=${c}>${board[c].trim() || "&nbsp;"}</td>`);
    }
    cells.push("</tr>");
  }
  $("#ttt-grid").html(cells.join(""));
  // indicate current turn
  const scene = game.get("scene");
  const winner = game.get("winner");
  const next = game.get("next");

  if (scene === "title") {
    $("#ttt-message").html(`Play Now! <button id="ttt-play">START</button>`);
  } else if (winner) {
    $("#ttt-message").html(
      `Result: ${winner} <button id="ttt-play">AGAIN</button>`,
    );
  } else {
    $("#ttt-message").html(
      `Next: ${next} <button id="ttt-play">RESET</button>`,
    );
  }
};

game.scene.create("title", () => {
  game.set("board", "TICTACTOE");
  game.on("loop_paint", render);
  // handle button clicks
  $("#ttt-wrap").on("click", (ev) => {
    if (ev.target.nodeName === "BUTTON") {
      game.scene.set("reset");
      game.step();
    }
  });
  game.step();
});

game.scene.create("reset", () => game.scene.set("play"));

game.scene.create("play", () => {
  // initialize the board
  game.set("board", " ".repeat(size * size));
  // the current player's turn
  game.set("turn", 0);
  game.set("next", symbols[0]);
  game.set("winner", null);

  const onclick = (ev) => {
    const i = +ev.target.dataset.index;
    let board = game.get("board");
    let turn = game.get("turn") + 1;
    let winner = game.get("winner");
    if (!winner && typeof i === "number" && !board[i].trim()) {
      board = board.slice(0, i) + game.get("next") + board.slice(i + 1);
      game.set("turn", turn);
      game.set("board", board);
      game.set("next", symbols[turn % symbols.length]);
      if (x_wins.test(board)) {
        game.set("winner", `${symbols[0]} wins!`);
      } else if (o_wins.test(board)) {
        game.set("winner", `${symbols[1]} wins!`);
      } else if (turn >= board.length) {
        game.set("winner", "Tie");
      }
    }
    game.step();
  };
  $("#ttt-grid").on("click", onclick);
  game.step();
  // clean up
  return () => {
    $("#ttt-grid").off("click", onclick);
  };
});

game.scene.set("title");
game.step();
