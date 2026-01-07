<?php
$dsn = 'mysql:host=mysql327.phy.lolipop.lan;dbname=LAA1686236-create20x;charset=utf8mb4';
$user = 'LAA1686236';
$pass = 'tiXkv2Ffnk4BPxX';

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    exit('接続失敗：' . $e->getMessage());
}

// SQL
$sql = "SELECT req_id, requestor_id, title, genre 
        FROM request_data 
        ORDER BY req_id DESC 
        LIMIT 1";

$stmt = $pdo->query($sql);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <title>依頼投稿</title>
    <link rel="stylesheet" href="./css/checkCont.css">
</head>

<body>

    <article>
        <div class="side">
            <!-- 上のプロフィール -->
            <div class="sideProfile" onclick="location.href='mypage.html'">
                <img src="image/createhub.png" class="image">
                <p class="userName">かわいいイラスト描いてくれる方</p>
            </div>
            <div class="sideProfile" onclick="location.href='mypage.html'">
                <img src="image/tokimekiMAYOYON.jpeg" class="image">
                <p class="userName">MMD作成求</p>
            </div>
            <div class="sideProfile" onclick="location.href='mypage.html'">
                <img src="image/dwfKHP.gif" class="image">
                <p class="userName">動画作成してほしい
                </p>
            </div>
            <div class="sideProfile" onclick="location.href='mypage.html'">
                <img src="image/icon/小鳥のアイコン.png" class="image">
                <p class="userName">SNS運用をしてほしい</p>
            </div>


        </div>

<?php if ($row): ?>
<div class="content">

    <!-- row1（タイトル・依頼者） -->
    <div class="row1">
        <img src="image/createhub.png" class="Contimage">
        <div class="eclips">
            <p class="request"><?= htmlspecialchars($row['title']) ?></p>
            <p class="name" style="color: aqua;">
                <?= htmlspecialchars($row['requestor_id']) ?>
            </p>
        </div>
    </div>

    <!-- row2（依頼概要） -->
    <label>依頼概要</label>
    <div class="row2">
        <p><?= htmlspecialchars($row['genre']) ?></p>
    </div>

    <!-- row3（納品、報酬、ランクなど → 必要ならDBから追加可能） -->
    <div class="row3">
        <p>納品期日：<?= htmlspecialchars($row['deadline'] ?? '未設定') ?></p>
        <p>報酬金：<?= htmlspecialchars($row['price'] ?? '未設定') ?></p>
        <p>必要ランク：<?= htmlspecialchars($row['rank'] ?? '未設定') ?></p>
    </div>

</div>
<?php else: ?>
    <p>データが見つかりませんでした。</p>
<?php endif; ?>


        <div class="row7">
            <button class="send" type="button" onclick="openFile()">納品</button>
            <input type="file" id="fileInput" style="display:none;" multiple>
            <div id="fileList" class="file-list"></div>

            <script>
                function openFile() {
                    document.getElementById("fileInput").click();
                }

                const fileInput = document.getElementById("fileInput");
                const fileList = document.getElementById("fileList");

                // 選択したファイルを保持しておく
                let selectedFiles = [];

                fileInput.addEventListener("change", () => {
                    let newFiles = Array.from(fileInput.files);

                    // 追加した結果が5つを超える場合
                    if (selectedFiles.length + newFiles.length > 5) {
                        alert("アップロードできるファイルは最大5つまでです！");
                        fileInput.value = "";
                        return;
                    }

                    // 新しいファイルをselectedFilesに追加
                    selectedFiles = selectedFiles.concat(newFiles);

                    // 表示更新
                    renderFileList();

                    // 選択状態リセット（同じファイルを再選択できるように）
                    fileInput.value = "";
                });


                function renderFileList() {
                    fileList.innerHTML = "";

                    selectedFiles.forEach((file, index) => {
                        const item = document.createElement("div");
                        item.className = "file-item";

                        let thumbHtml = "";

                        // 画像の場合はサムネ、その他はアイコン風
                        if (file.type.startsWith("image/")) {
                            const imgUrl = URL.createObjectURL(file);
                            thumbHtml = `<img src="${imgUrl}" class="thumb">`;
                        } else {
                            thumbHtml = `<div class="thumb">📄</div>`;
                        }

                        item.innerHTML = `
            ${thumbHtml}
            <p style="font-size: 12px; word-break: break-all;">${file.name}</p>
            <span class="delete-btn" onclick="deleteFile(${index})">削除</span>
        `;

                        fileList.appendChild(item);
                    });
                }

                function deleteFile(index) {
                    selectedFiles.splice(index, 1);
                    renderFileList();
                }

            </script>

        </div>
    </article>


    <script src="./js/checkCont.js"></script>
    <script src="./../header/header.js"></script>
</body>

</html>