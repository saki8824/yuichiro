/**
 * MindLink - Service Worker（自己解除版）
 *
 * このファイルは「もう何もしない」Service Worker です。
 * 端末に住み着いてしまった古い Service Worker を、
 * 自分自身で解除するためだけに存在します。
 *
 * ⚠️ このファイルを削除しないでください。
 *    削除すると、古い Service Worker が端末に残り続けてしまいます。
 *
 * ※ 消すのはキャッシュ（ページの控え）だけです。
 *    会話データ（localStorage / IndexedDB）には一切さわりません。
 */

self.addEventListener('install', () => {
  // 待機せず、すぐにこの新しい版へ入れ替わる
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    try {
      // 1. 保存されているキャッシュをすべて削除
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (_) { /* 失敗しても次へ進む */ }

    try {
      // 2. 自分自身の登録を解除する
      await self.registration.unregister();
    } catch (_) { /* 失敗しても次へ進む */ }

    try {
      // 3. 開いている画面を読み込み直して、最新を表示する
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(c => c.navigate(c.url));
    } catch (_) { /* 失敗しても無視 */ }
  })());
});

// fetch イベントは受け取らない。
// これにより、すべての読み込みが素通しでネットワークから取得される。
