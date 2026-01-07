// --- Firebase SDK読み込み ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";


// --- Firebase設定 ---
const firebaseConfig = {
    apiKey: "AIzaSyCtUlyFYlCeTG1Tn71g8Ef15BbwNtFL1KM",
    authDomain: "createhubmaking2025.firebaseapp.com",
    projectId: "createhubmaking2025",
    storageBucket: "createhubmaking2025.appspot.com", // ← .appspot.com が正解
    messagingSenderId: "234787712073",
    appId: "1:234787712073:web:fd6de6014a397b3497a398",
    measurementId: "G-VS3Y19SYXF",
    databaseURL: "https://createhubmaking2025-default-rtdb.firebaseio.com"
};

// --- Firebase初期化 ---
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const fsunit = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const googlelogin = document.getElementById("google-login-btn")
const emaillogin = document.getElementById("email-login-btn")
const emailtext = document.getElementById("username");
const password = document.getElementById("password");

// Googleサインインのためのコード
const googleClientId = '155231433509-edv3p3qm7oq9hohk7oand8lc6uo52jen.apps.googleusercontent.com'; // ここに取得したクライアントIDを追加
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    client_id: googleClientId,
});

googlelogin.onclick = () => google();
emaillogin.onclick = () => login();


// ... (Firebase import など) ...

// (重要) ログイン成功時にPHP(API)を呼び出す共通関数
// (重要) ログイン成功時にPHP(API)を呼び出す共通関数
// (名前を checkUserExistsInDB に変更することを推奨)
async function syncUserToDB(user) {
    try {
        // 1. FormData オブジェクトを作成
        const formData = new FormData();
        // 2. 'uid' というキーで user.uid を追加
        formData.append('uid', user.uid);
        console.log("FormData作りました (uid=" + user.uid + ")");
        // 3. fetch でPHP (API) を呼び出す
        // (JSON.stringify や Content-Type ヘッダーは不要)
        const response = await fetch('./../Cardinal/register_user.php', { // register_user.php を呼ぶ
            method: 'POST',
            body: formData // FormData をそのまま送信
        });

        console.log("送信できました");

        const result = await response.json();
        console.log("レスポンス出来ました", result);

        if (!result.success) {
            // PHP側でエラーが起きた場合 (DB接続エラーなど)
            throw new Error(result.message);
        }

        // 3. PHP(DB確認)成功
        // result.exists (true または false) を呼び出し元に返す
        return result.exists;

    } catch (error) {
        // --- 通信失敗 または PHP側エラー ---
        console.error('DB確認エラー:', error);
        alert('データベースへの接続に失敗しました: \n' + error.message);
        return false; // エラー時は「存在しない」扱いに(要検討)
    }
}

// --- Googleログイン (修正後) ---
async function google() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Googleログイン成功:", user.displayName);

        // // ★ 1. PHP(API)を呼び出してDB同期
        // const dbSyncSuccess = await syncUserToDB(user);
        // warp(dbSyncSuccess, user)

    } catch (error) {
        console.error("Googleログインエラー:", error);
    }
}


// --- Emailログイン (修正後) ---
async function login() {
    const e_text = emailtext.value;
    const p_text = password.value;
    try {
        await signInWithEmailAndPassword(auth, e_text, p_text);
        console.log("メール認証完了")
    } catch (error) {
        console.error("ログインエラー:", error.code, error.message);
        alert("ログインに失敗しました\n新規ユーザの場合は新規登録にお進みください")
        // (ここで日本語エラー表示)
    }
}


function warp(dbSyncSuccess, user) {
    if (dbSyncSuccess) {
        // 2. DB同期成功後、sessionStorageに保存
        sessionStorage.setItem("myname", user.displayName);
        sessionStorage.setItem("uid", user.uid);
        sessionStorage.setItem("pass", 0);
        sessionStorage.setItem("loginMethod", user.providerData[0]?.providerId);
        console.log("既存ユーザです、メインページに遷移します")
        window.location.href = "./../bulletinboard/"
    } else {
        if (confirm("未登録のユーザです。ユーザ登録画面に移行しますか？")) {
            window.location.href = "./../NewRegistration/"
        } else {
            alert("ログインに失敗しました")
        }
    }
}


// --- 認証状態の監視 ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("ログイン中:", user.email || user.displayName);
        // サーバーと同期する
        const dbSyncSuccess = await syncUserToDB(user);

        if (dbSyncSuccess) {
            console.log("既存ユーザを確認、メインページに遷移します")
            warp(dbSyncSuccess, user)
        } else {
            console.log("新規ユーザー（リロード）。登録待機中。");
        }
    } else {
        console.log("ログアウト中");
        if (confirm("新規ユーザですか？\n「はい」を押したら初回ログイン画面に遷移します")) {
            window.location.href = "./../NewRegistration/"
        }
    }
});