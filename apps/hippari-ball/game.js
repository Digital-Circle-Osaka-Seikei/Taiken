// ひっぱりボールのゲームの動きを書くファイルです。
// 今回の目的は「ゲームの場所（枠）を画面に表示する」ことだけです。
// ボールを動かす処理は、次の機能で追加します。

// index.html の canvas（絵を描く場所）を取得します
const canvas = document.getElementById("game");
// 絵を描くための道具（2D描画）を受け取ります
const ctx = canvas.getContext("2d");

// ゲームの場所の「縦横の比率」です（横:縦 = 16:10）
// 比率を決めておくと、画面が広くても狭くても形が崩れません
const ASPECT = 10 / 16;

// 画面の大きさに合わせて canvas の大きさを決め、絵を描き直す関数です
function drawField() {
  // canvas の表示される横幅を求めます。画面の幅から左右の余白（16px×2）を引き、最大800pxまでにします
  const width = Math.min(window.innerWidth - 32, 800);
  // 高さは横幅に比率をかけて求めます
  const height = Math.round(width * ASPECT);

  // canvas の中身の大きさを、表示の大きさに合わせます
  // （これをしないと絵がぼやけたり、引き伸ばされたりします）
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  // 背景を薄い緑で塗りつぶします（ゲームの場所の地面のつもり）
  ctx.fillStyle = "#d9f2d9";
  ctx.fillRect(0, 0, width, height);

  // 外側の枠線を描きます。壁の位置の目印にもなります
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 6;
  // 線の半分が外にはみ出すので、3pxずつ内側に寄せて描きます
  ctx.strokeRect(3, 3, width - 6, height - 6);

  // 画面の真ん中に、今どこを描いているかの文字を書きます
  ctx.fillStyle = "#333333";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ゲームの場所", width / 2, height / 2);
}

// 最初に一度描きます
drawField();

// 画面の大きさが変わったとき（スマホを回したときなど）に、描き直します
window.addEventListener("resize", drawField);
