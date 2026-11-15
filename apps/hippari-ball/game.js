// ひっぱりボール：画面の土台
// 今は「ゲームの場所の枠」と「目印の丸」を描くだけです。動きはまだありません。

// index.html の canvas（ゲームの場所）を id="game" で探して取り出す
const canvas = document.getElementById("game");

// canvas に絵を描くための道具（2D描画の道具）を受け取る
const ctx = canvas.getContext("2d");

// 画面を描く関数。今は1回だけ呼んで、絵を1枚描く
function draw() {
  // 画面全体を一度きれいに消す（前に描いた絵が残らないように）
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ゲームの場所の枠（外側の線）を描く
  // 線の太さは4。canvas の端ぎりぎりだと線が半分欠けるので、2px内側に描く
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  // 目印の丸を真ん中に描く（後の機能で、この丸がボールになる）
  // arc(中心のx, 中心のy, 半径, 開始角, 終わり角) で円を作る。Math.PI*2 は1周分
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, Math.PI * 2);
  ctx.fillStyle = "#e74c3c"; // 赤い丸
  ctx.fill();
}

// 最初に1回だけ描く
// 色や位置を変えると、ここで見た目が変わる
draw();
