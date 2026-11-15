// ひっぱりボール：機能2「マウスでひっぱって離すと、反対向きに同じ速さで飛ぶ」
// ボールを1個置き、マウスでひっぱって離すと、ひっぱった向きの反対へ飛んでいきます。
// 画面は「1回だけ描く」から「毎回描き直す」形に変えました（動くものを描くため）。

// index.html の <canvas id="game"> を取り出します
const canvas = document.getElementById('game');

// 絵を描くための道具（2D描画の命令を使うための入口）を受け取ります
const ctx = canvas.getContext('2d');

// 画面の大きさ（index.html の canvas と同じ値）
const WIDTH = 480;
const HEIGHT = 800;

// ----- 数字の決まり（あとで変えて遊びやすいように、ここにまとめています） -----
// ボールの半径（px）。大きくすると、マウスで押しやすくなります
const BALL_RADIUS = 16;
// 飛ぶ速さ：1コマ（画面を1回描き直すあいだ）に進む距離（px）。
// 「ひっぱった長さに関係なく同じ速さ」にするため、長さではなくこの数字を使います
const LAUNCH_SPEED = 12;
// これより短くひっぱったら飛ばさないための長さ（px）。
// 短すぎる手の震えで飛んでしまうのを防ぎます
const MIN_PULL = 10;

// ----- 覚えておくもの（ページを閉じると消えます。保存はしません） -----
// ボールの位置（x, y）、飛ぶ速さ（vx, vy）、飛んでいるかどうか（flying）
// 最初もリセットするときも、画面の真ん中に置きます
const ball = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  vx: 0,
  vy: 0,
  flying: false,
};

// ひっぱり中かどうかと、今のマウスの位置（ひっぱり線の先に使います）
// active が true のあいだだけ、線を引きます
const drag = {
  active: false,
  x: 0,
  y: 0,
};

// マウスの位置（ページの座標）を、ゲームの場所の中の座標（0〜480, 0〜800）に直します。
// canvas は CSS で大きさが変わることがあるので、そのままの値だとずれてしまいます。
// そのため「画面上の大きさ」と「中身の大きさ」の比で直しています
function toCanvasPos(event) {
  // canvas が今の画面で、どこに・どれだけの大きさで置かれているかを取ります
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (WIDTH / rect.width),
    y: (event.clientY - rect.top) * (HEIGHT / rect.height),
  };
}

// ----- きっかけ：マウスの操作 -----

// マウスを押したとき。ボールの上で押されたら「ひっぱり開始」にします
// 飛んでいる最中は、押しても何も起きないようにします（次のひっぱりは機能5で作ります）
canvas.addEventListener('mousedown', (event) => {
  if (ball.flying) return;

  const p = toCanvasPos(event);
  // ボールの中心からマウスの位置までの距離を、2乗のまま比べます（平方根の計算を省くため）
  const dx = p.x - ball.x;
  const dy = p.y - ball.y;
  if (dx * dx + dy * dy <= BALL_RADIUS * BALL_RADIUS) {
    drag.active = true;
    drag.x = p.x;
    drag.y = p.y;
  }
});

// マウスを動かしたとき。ひっぱり中だけ、線の先を今のマウス位置に合わせます
// canvas の外まで動いても線が追えるように、canvas ではなく window で受け取ります
window.addEventListener('mousemove', (event) => {
  if (!drag.active) return;
  const p = toCanvasPos(event);
  drag.x = p.x;
  drag.y = p.y;
});

// マウスを離したとき。ここで「飛ばす」かどうかを決めます
// canvas の外で離されても飛ぶように、window で受け取ります
window.addEventListener('mouseup', (event) => {
  if (!drag.active) return;
  drag.active = false;

  const p = toCanvasPos(event);
  // 向きは「ボールの中心 − 離した位置」です。
  // 引っ張った方向の反対へ飛ぶので、ボールから離した位置へ向かう逆向きになります
  const dx = ball.x - p.x;
  const dy = ball.y - p.y;
  // 長さ（ひっぱった距離）を求めます。向きだけを使うので、長さで割って「長さ1の向き」にします
  const len = Math.hypot(dx, dy);
  if (len < MIN_PULL) return; // 短すぎるときは飛ばしません

  // 向き（dx/len, dy/len）に、決めた速さ LAUNCH_SPEED をかけます。
  // こうすると、ひっぱった長さに関係なく、速さはいつも同じになります
  ball.vx = (dx / len) * LAUNCH_SPEED;
  ball.vy = (dy / len) * LAUNCH_SPEED;
  ball.flying = true;
});

// ----- 毎回の変化：1コマごとに、ボールを進めます -----
function update() {
  // 飛んでいないときは、何もしません
  if (!ball.flying) return;

  // 速さの分だけ、ボールの位置を進めます
  ball.x += ball.vx;
  ball.y += ball.vy;

  // ボールが画面の外に「完全に」出たら、止めて真ん中に戻します。
  // 半径の分も数えて、丸ごと消えてから戻すようにしています。
  // （壁で跳ね返すのは機能3で作ります。今は、外に出たら戻すだけです）
  const outside =
    ball.x + BALL_RADIUS < 0 ||
    ball.x - BALL_RADIUS > WIDTH ||
    ball.y + BALL_RADIUS < 0 ||
    ball.y - BALL_RADIUS > HEIGHT;
  if (outside) {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.vx = 0;
    ball.vy = 0;
    ball.flying = false;
  }
}

// ----- 見せ方：画面に絵を描きます -----
function draw() {
  // いったん全部消して、背景の色で塗りつぶします（前のコマの絵を消すため）
  ctx.fillStyle = '#2b2d42';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ゲームの場所の外枠を、少し内側に線で描きます（場所がわかるように）
  ctx.strokeStyle = '#8d99ae';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, WIDTH - 4, HEIGHT - 4);

  // ひっぱり中は、ボールの中心から今のマウス位置へ線を引きます。
  // 線の向きと反対へボールが飛ぶので、「どっちへ飛ぶか」が見えるようにしています
  if (drag.active) {
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ball.x, ball.y);
    ctx.lineTo(drag.x, drag.y);
    ctx.stroke();
  }

  // ボールを丸で描きます（arc は中心と半径で円を描く命令です）
  ctx.fillStyle = '#ef233c';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // 画面の上のほうに、タイトルを描きます（ボールと重ならないように上に置きました）
  ctx.fillStyle = '#f0f0f0';
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ひっぱりボール', WIDTH / 2, 50);
}

// ----- くり返し：1コマごとに「進める → 描く」を繰り返します -----
// requestAnimationFrame は、ブラウザが画面を描き直せるタイミングで、次のコマを呼んでくれます
// （だいたい1秒に60回）。これで、ボールが少しずつ動いて見えます
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// 最初の1コマを始めます
loop();
