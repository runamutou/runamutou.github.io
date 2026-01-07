<style>
    #loading {
        position: fixed;
        z-index: 9999;
        background: #fff;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loader {
        border: 8px solid #e0e0e0;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>

<!-- ローディング画面 -->
<div id="loading">
    <div class="loader"></div>
</div>
<!-- サイト本体（ここにコンテンツが入る） -->
<div id="main-content" style="display:none;">
    <!-- 本文など -->
</div>



<script>
    // ロード開始時刻を取得
    const loadingStart = Date.now();

    window.addEventListener('load', function() {
        const elapsed = Date.now() - loadingStart;
        const minTime = 3000; // 3秒（3000ミリ秒）

        if (elapsed < minTime) {
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            }, minTime - elapsed);
        } else {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }
    });
</script>

<?php
$title = htmlspecialchars($_REQUEST['title'], ENT_QUOTES);
$request_about = htmlspecialchars($_REQUEST['request_about'], ENT_QUOTES);
$image_title = htmlspecialchars($_REQUEST['picturename'], ENT_QUOTES);
$money = htmlspecialchars($_REQUEST['money'], ENT_QUOTES);

$timelimit = htmlspecialchars($_REQUEST['timelimit'], ENT_QUOTES);

$now = new DateTime();
$time = $now->format(DateTime::ATOM);

$requester_id = "FTi4ytw3H0eZkroRYM2zzou5OkF2";

// $now が DateTime オブジェクトであると仮定
// (例: $now = new DateTime();)

// 3ヶ月後を $now に設定
$now->modify('+3 months');

// 3ヶ月後の日時をATOM形式で取得
$deadline = $now->format(DateTime::ATOM);

echo $time;


$uploaded_file = $_FILES['picture'] ?? null;
echo $time;
echo $deadline;

$str = array_merge(range('a', 'z'), range('0', '9'), range('A', 'Z'));

// ★★★ 修正点 ★★★
$length = 16; // 任意の長さを指定（例: 16文字）
$r_str = "";  // 空文字列で初期化する
// ★★★ ここまで ★★★

for ($i = 0; $i < $length; $i++) {
    $r_str .= $str[rand(0, count($str) - 1)];
}
echo $r_str; // (デバッグ用)

$json_file = [
    "meta" => [
        'req_id' => $r_str,
        'created_at' => $time,
        'updated_at' => $time,
        'status' => "open"
    ],
    "request" => [
        'title' => $title,
        'overview' => $request_about,
        'img' => $image_title,
        'skills' => "今はまだない",
        'reward' => $money,
        'timelimit' => $time,
        'deadline' => $deadline
    ],
    "relation" => [
        'requester_id' => $requester_id,
        'worker_id' => null
    ]
];

// --- JSON文字列化 ---
$json_data = json_encode($json_file, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

// --- 保存先フォルダ設定 ---
$save_dir = '/home/users/2/main.jp-create-hub/web/.private/.request_data/';
$save_picture_dir = '/home/users/2/main.jp-create-hub/web/.private/.assets/.request_image/';



if (!file_exists($save_dir)) {
    mkdir($save_dir, 0755, true); // フォルダがなければ作成
}


// --- ファイル名生成 ---
$file_name = "req_" . $r_str . ".json";
// --- フルパス ---
$file_path = $save_dir . $file_name;

// --- 保存処理 ---
if (file_put_contents($file_path, $json_data)) {
    echo "✅ JSONファイルを保存しました: " . htmlspecialchars($file_path);
    // ★ご要望の処理: ファイルパーミッションを 0700 (所有者のみRWX) に設定
    if (chmod($file_path, 0700)) {
        echo "\n✅ パーミッションを 0700 に設定しました。";
        $uploaded_file = $_FILES['picture'] ?? null;
        if ($uploaded_file && $uploaded_file['error'] == UPLOAD_ERR_OK) {

            // 保存先のファイルパスを決定（例: profile_image_UID.jpg）
            // $picture_pass はJSから受け取ったファイル名
            $save_file_path = $save_picture_dir . $image_title;

            // 一時ファイル($uploaded_file['tmp_name'])を保存先に移動
            if (move_uploaded_file($uploaded_file['tmp_name'], $save_file_path)) {
                echo "✅ 画像ファイルを保存しました: " . htmlspecialchars($save_file_path);
                // 画像のパーミッションも設定するとより安全です
                chmod($save_file_path, 0700);
            } else {
                echo "⚠️ 画像ファイルの保存に失敗しました。";
            }
        }
    } else {
        echo "\n⚠️ パーミッションの変更に失敗しました。";
    }
} else {
    echo "⚠️ JSONファイルの保存に失敗しました。パーミッションを確認してください。";
}


header('http://create-hub.main.jp/bulletinboard/index.html')

?>