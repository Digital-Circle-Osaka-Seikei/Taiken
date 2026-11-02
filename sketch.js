// よけゲー（p5.js）
// 遊び方：マウス（スマホは指）で左右に動いて、落ちてくる玉をよけよう

let player;        // 自分
let enemies = [];  // 落ちてくる玉たち
let score = 0;
let gameOver = false;

// 最初に1回だけ実行（Scratchの「緑の旗が押されたとき」）
function setup() {
  createCanvas(400, 600);
  player = { x: width / 2, y: height - 50, size: 40 };
}

// ずっと繰り返す（Scratchの「ずっと」）
function draw() {
  background(30);

  if (gameOver) {
    showGameOver();
    return;
  }

  // 自分をマウスのx座標に動かす（画面からはみ出さないように）
  player.x = constrain(mouseX, player.size / 2, width - player.size / 2);
  fill(80, 200, 255);
  circle(player.x, player.y, player.size);

  // 30フレームごとに敵を1つ増やす（約0.5秒ごと）
  if (frameCount % 30 === 0) {
    enemies.push({
      x: random(width),
      y: -20,
      size: random(20, 40),
      speed: random(3, 6) + score / 500  // 時間がたつほど速くなる
    });
  }

  // 敵を1つずつ動かして描く
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.y += e.speed;
    fill(255, 90, 90);
    circle(e.x, e.y, e.size);

    // 当たり判定：中心どうしの距離が半径の合計より小さければ当たり
    if (dist(e.x, e.y, player.x, player.y) < (e.size + player.size) / 2) {
      gameOver = true;
    }

    // 画面の下に消えたら削除
    if (e.y > height + 50) {
      enemies.splice(i, 1);
    }
  }

  // スコア表示（生き残った時間）
  score++;
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text("スコア: " + score, 10, 10);
}

function showGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("GAME OVER", width / 2, height / 2 - 30);
  textSize(20);
  text("スコア: " + score, width / 2, height / 2 + 20);
  text("クリックでもう一度", width / 2, height / 2 + 60);
}

// クリックしたとき（Scratchの「このスプライトが押されたとき」）
function mousePressed() {
  if (gameOver) {
    enemies = [];
    score = 0;
    gameOver = false;
  }
}
