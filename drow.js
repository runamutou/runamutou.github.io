document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const room = params.get("room")?.trim();

  console.log("type:", type);
  console.log("room:", room);

  if (type !== "illust") {
    alert("不正なアクセスです");
    return;
  }

  const roomInitMap = {
    "1": initRoom1,
    "2": initRoom2,
    "3": initRoom3,
    "4": initRoom4,
  };

  if (!roomInitMap[room]) {
    alert("存在しない部屋です");
    return;
  }

  roomInitMap[room]();

  function initRoom1() {
    console.log("🎨 イラストバトル 1号室 初期化");
  }

  function initRoom2() {
    console.log("🎨 イラストバトル 2号室 初期化");
  }

  function initRoom3() {
    console.log("🎨 イラストバトル 3号室 初期化");
  }
  
  function initRoom4() {
    console.log("🎨 イラストバトル 4号室 初期化");
  }
});
const canvas = document.querySelector('#drawing-area');
const ctx = canvas.getContext('2d');
const clearBtn = document.querySelector('#clear-button');
const undoBtn = document.querySelector('#undo-button');
const lineWidthInput = document.querySelector('#line-width');
const colorButtons = document.querySelectorAll('.color-btn');


let x;
let y;
let mousePressed = false;

// 描画設定
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "black";
ctx.lineWidth = 3;

// ==== Undo 用スタック ====
let history = [];

// -------------------------------------------
// 描画開始
// -------------------------------------------
function startDrawing(e) {
  mousePressed = true;

  // Undo 用に現在のキャンバスを保存
  saveHistory();

  x = e.offsetX;
  y = e.offsetY;
}

// -------------------------------------------
// 描画処理
// -------------------------------------------
function draw(e) {
  if (!mousePressed) return;

  const x2 = e.offsetX;
  const y2 = e.offsetY;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  x = x2;
  y = y2;
}

// -------------------------------------------
// イベント
// -------------------------------------------
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', () => mousePressed = false);

// -------------------------------------------
// Clear（全消去）
// -------------------------------------------
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// -------------------------------------------
// Undo（巻き戻し）
// -------------------------------------------
undoBtn.addEventListener('click', () => {
  if (history.length === 0) return;
  const img = history.pop();
  ctx.putImageData(img, 0, 0);
});

// Undo 用にキャンバス保存
function saveHistory() {
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

// -------------------------------------------
// 線の太さ変更
// -------------------------------------------
lineWidthInput.addEventListener("input", (e) => {
  ctx.lineWidth = e.target.value;
});

// -------------------------------------------
// カラー変更
// -------------------------------------------
const colorBox = document.querySelector('#colorBox');

function setColor(col) {
    ctx.strokeStyle = col; // 描画色を変更
    colorBox.value = rgbToHex(col); // ピッカーに反映
    addColorHistory(col); // 履歴に追加
    highlightSelectedColor(col); // 枠線をつける
}

// ==========================
// 1. パレットの色クリック処理
// ==========================
colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const col = btn.dataset.color;
        setColor(col);
    });
});

// ==========================
// 2. カラーピッカー選択処理
// ==========================
colorBox.addEventListener("input", () => {
    setColor(colorBox.value);
});

// ==========================
// A. 選択中の色に枠線を付ける
// ==========================
function highlightSelectedColor(color) {
    colorButtons.forEach(btn => {
        if (rgbToHex(btn.dataset.color) === rgbToHex(color)) {
            btn.style.outline = "3px solid #333";
        } else {
            btn.style.outline = "none";
        }
    });
}

// ==========================
// B. 色履歴に追加
// ==========================
function addColorHistory(color) {
    const hex = rgbToHex(color);

    // 同じ色が履歴にあれば削除 → 最新に追加
    const exists = [...historyArea.children].find(c => c.dataset.color === hex);
    if (exists) exists.remove();

    // 履歴は最大6個まで
    while (historyArea.children.length >= 6) {
        historyArea.removeChild(historyArea.lastChild);
    }

    const box = document.createElement("div");
    box.className = "history-color";
    box.dataset.color = hex;
    box.style.background = hex;

    // 履歴クリックで色を再選択
    box.addEventListener("click", () => setColor(hex));

    // 先頭に追加
    historyArea.prepend(box);
}

// ==========================
// 色名 → HEX 変換
// ==========================
function rgbToHex(color) {
    if (color.startsWith("#")) return color;

    const temp = document.createElement("div");
    temp.style.color = color;
    document.body.appendChild(temp);

    const rgb = getComputedStyle(temp).color;
    document.body.removeChild(temp);

    const nums = rgb.match(/\d+/g).map(Number);
    return "#" + nums.map(v =>
        v.toString(16).padStart(2, "0")
    ).join("");
}

// -------------------------------------------
// 画像に変換（PNG保存）
// -------------------------------------------
const exportBtn = document.querySelector('#decide-button');

exportBtn.addEventListener('click', () => {
  const dataURL = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "illust.png"; // ファイル名
  link.click();
});
