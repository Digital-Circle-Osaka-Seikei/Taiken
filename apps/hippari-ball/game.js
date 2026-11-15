// ひっぱりボール：機能1「画面の土台」
// ゲームの場所（canvas）を取り出して、そこに絵を描きます。

// index.html の <canvas id="game"> を取り出します
const canvas = document.getElementById('game');

// 絵を描くための道具（2D描画の命令を使うための入口）を受け取ります
const ctx = canvas.getContext('2d');

// 画面の大きさ（index.html の canvas と同じ値）
const WIDTH = 480;
const HEIGHT = 800;

// 画面に絵を描く関数。今はゲームの場所の枠と、文字だけを描きます
function draw() {
  // いったん全部消して、真っ黒な背景にします
  ctx.fillStyle = '#2b2d42';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ゲームの場所の外枠を、少し内側に線で描きます（場所がわかるように）
  ctx.strokeStyle = '#8d99ae';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, WIDTH - 4, HEIGHT - 4);

  // 画面の真ん中に、今の状態を示す文字を描きます
  ctx.fillStyle = '#f0f0f0';
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ひっぱりボール', WIDTH / 2, HEIGHT / 2 - 20);

  ctx.font = '18px sans-serif';
  ctx.fillText('ゲームの場所（機能1：画面の土台）', WIDTH / 2, HEIGHT / 2 + 20);
}

// 最初の1回を描きます。今は動かないので、描くのはこの1回だけです
draw();
