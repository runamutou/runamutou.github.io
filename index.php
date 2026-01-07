<?php
require './Cardinal/config.php';
?>



<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ログイン | CreatorMatch</title>
  <link rel="stylesheet" href="./login.css" />
</head>

<body>
  <main class="login-container">
    <h2>ログイン</h2>

    <form id="login-form" class="login-form">
      <input type="text" id="username" placeholder="ユーザ名・メールアドレス" required>
      <input type="password" id="password" placeholder="パスワード入力" required>
    </form>
    <div class="google-login">
      <button id="email-login-btn">ログイン</button>
    </div>

    <p id="login-message"></p>

    <div class="google-login">
      <button id="google-login-btn">
        <!-- <img src="../img/google.png" alt="Googleアイコン"> -->
        Googleアカウントでログイン
      </button>
    </div>
    <a href="./../NewRegistration/">新規登録はこちらから</a>
  </main>

  <script type="module" src="./login.js"></script>
</body>

</html>