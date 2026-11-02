// よけゲー（p5.js）
// 遊び方：マウス（スマホは指）で左右に動いて、落ちてくる玉をよけよう
//letは変数を宣言するためのキーワード。varやconstもあるが、letはブロックスコープを持つ

let player;        // 自分
let enemies = [];  // 落ちてくる玉たち
let score = 0;
let gameOver = false;

// 最初に1回だけ実行（Scratchの「緑の旗が押されたとき」）
function setup() {
  // 画面の大きさを400x600にする
  createCanvas(400, 600);
  // 自分の初期位置（x: 画面の中央、横幅400÷2,y: 画面の下端、縦幅600-50）と大きさを設定
  player = { x: width / 2, y: height - 50, size: 40 };
}

// ゲーム中、ずっと繰り返す（Scratchの「ずっと」）
// draw()はp5.jsの組み込み関数で、毎フレーム（60fps）呼ばれる
function draw() {
  // 球の軌跡（基本描きっぱなし）などを背景を黒で塗りつぶすことによって消す。
  background(30);
  // ゲームオーバー状態ならゲームオーバー画面を表示して処理を終了
  if (gameOver) {
    showGameOver();
    return;
  }

  // 自分をマウスのx座標に動かす（画面からはみ出さないように）
  // constrain()は値を指定した範囲に収める関数
  // player.xは自分のx座標、mouseXはマウスのx座標、player.size / 2は自分の半径、width - player.size / 2は画面の右端から自分の半径を引いた値
  // つまり、player.xはマウスのx座標に合わせて動くが、画面の左端から自分の半径を引いた値より小さくならず、画面の右端から自分の半径を引いた値より大きくならないようにする
  player.x = constrain(mouseX, player.size / 2, width - player.size / 2);
  // 自分を描く
  // fill()は塗りつぶす色を指定する関数。RGBで指定する。ここでは水色にしている。
  fill(80, 200, 255);
  // circle()は円を描く関数。引数は(x座標, y座標, 直径)。
  // setup()で設定したplayerのx座標、y座標、sizeを使って自分を描く
  circle(player.x, player.y, player.size);

  // 30フレームごと（30フレームで割り切れるごとに）に敵を1つ増やす（約0.5秒ごと）
  if (frameCount % 30 === 0) {
    // 敵の初期位置（x: 画面のランダムな位置、y: 画面の上端-20）と大きさ（20~40）と速さ（3~6）を設定してenemies配列に追加
    // speedにはscore / 500を足している。scoreは生き残った時間なので、時間がたつほど速くなるようにしている。
    enemies.push({
      // random()は指定した範囲のランダムな値を返す関数。引数が1つの場合は0からその値までのランダムな値を返す。引数が2つの場合はその範囲のランダムな値を返す。
      // ここでは、x座標は画面の幅（width）からランダムに、y座標は画面の上端-20（-20）に設定している。
      x: random(width),
      y: -20,
      // sizeは20~40のランダムな値、
      size: random(20, 40),
      // speedは3~6のランダムな値にしている。
      speed: random(3, 6) + score / 500  // 時間がたつほど速くなる
    });
      // つまり、enemies配列には、x座標、y座標、size、speedを持つオブジェクトが追加される
      // 具体的な例として、enemies配列の中身は以下のようになる。
      // enemies = [
      //   { x: 100, y: -20, size: 30, speed: 4 },
      //   { x: 200, y: -20, size: 25, speed: 5 },
      //   { x: 300, y: -20, size: 35, speed: 3 }
      // ]
  }

  // draw()の中でfor文を使って、敵をfor文で1つずつ動かして描く処理を行う。60fpsでdraw()が呼ばれるので、60回/秒で敵を動かして描くことになる。

  // for文で配列の最後（enemies.length - 1で、例えば５個の場合、lengthは最大４なので、最後に当たる）から
  // 順に処理する（i >= 0で、敵が0以上存在する時に回す）ことで、配列の要素を削除してもループが正しく動作するようにしている。
  // 例えば、enemies配列の中身が以下のようになっているとする。
  // enemies = [
  //   { x: 100, y: -20, size: 30, speed: 4 },
  //   { x: 200, y: -20, size: 25, speed: 5 },
  //   { x: 300, y: -20, size: 35, speed: 3 }
  // ]
  // このとき、for文のiは2から0まで順に変化する。
  // iが2のとき、enemies[2]を処理する。もしenemies[2]を削除した場合、enemies配列の中身は以下のようになる。
  // enemies = [
  //   { x: 100, y: -20, size: 30, speed: 4 },
  //   { x: 200, y: -20, size: 25, speed: 5 }
  // ]
  // このとき、iは1に変化する。enemies[1]を処理する。もしenemies[1]を削除した場合、enemies配列の中身は以下のようになる。
  // enemies = [
  //   { x: 100, y: -20, size: 30, speed: 4 }
  // ]
  // このとき、iは0に変化する。enemies[0]を処理する。もしenemies[0]を削除した場合、enemies配列の中身は以下のようになる。
  // enemies = []
  // このとき、iは-1に変化する。i >= 0の条件が成立しないため、for文は終了する。
  // 最後から処理することで、例えば、０番目の敵を削除した場合、次に来るのが1番目（本来は0番目であってほしい）で処理する敵が１つずれるが、最後から処理することで、削除しても次の敵を正しく処理できるようになる。
  for (let i = enemies.length - 1; i >= 0; i--) {
    // enemies配列のi番目の敵をeに代入
    let e = enemies[i];
    // 敵をspeedにあるピクセル分だけ下に動かす
    e.y += e.speed;
    // 敵の色を赤にして描く
    fill(255, 90, 90);
    // circle()は円を描く関数。引数は(x座標, y座標, 直径)。
    circle(e.x, e.y, e.size);

    // 当たり判定：中心どうしの距離が半径の合計より小さければ当たり
    // dist()は2点間の距離を求める関数。引数は(x1, y1, x2, y2)。
    // ここでは、敵の中心座標(e.x, e.y)と自分の中心座標(player.x, player.y)の距離を求めている。
    // もし距離（distance）が半径の合計((e.size + player.size) / 2)より小さければ当たり判定が成立する。
    if (dist(e.x, e.y, player.x, player.y) < (e.size + player.size) / 2) {
      // ゲームオーバー状態にする
      gameOver = true;
    }

    // 敵が画面の下に消えたら削除
    if (e.y > height + 50) {
      // splice()は配列の要素を削除する関数。引数は(削除する位置, 削除する個数)。
      // ここでは、enemies配列のi番目の要素を1つ削除している。
      enemies.splice(i, 1);
    }
  }

  // スコア表示（生き残った時間）
  score++;
  // fill()は塗りつぶす色を指定する関数。ここでは白にしている。
  fill(255);
  // textSize()は文字の大きさを指定する関数。ここでは20にしている。
  textSize(20);
  // textAlign()は文字の位置を指定する関数。ここでは左上にしている。
  textAlign(LEFT, TOP);
  // text()は文字を描く関数。引数は(文字列, x座標, y座標)。
  text("スコア: " + score, 10, 10);
}


// ゲームオーバー画面を表示
function showGameOver() {
  fill(255);
  // textAlign()は文字の位置を指定する関数。ここでは中央にしている。
  textAlign(CENTER, CENTER);
  // textSize()は文字の大きさを指定する関数。ここでは40にしている。
  textSize(40);
  // text()は文字を描く関数。引数は(文字列, x座標, y座標)。
  text("GAME OVER", width / 2, height / 2 - 30);
  // textSize()は文字の大きさを指定する関数。ここでは20にしている。
  textSize(20);
  // スコア表示
  text("スコア: " + score, width / 2, height / 2 + 20);
  // クリックで再スタートの案内
  text("クリックでもう一度", width / 2, height / 2 + 60);
}

// クリック（mousePressed）したとき（Scratchの「このスプライトが押されたとき」）
function mousePressed() {
  // ゲームオーバー状態ならリセットして再スタート、ゲームオーバー状態でなければ何もしない
  if (gameOver) {
    // 敵とスコアをリセットしてゲームオーバー状態を解除
    enemies = [];
    score = 0;
    gameOver = false;
  }
}
