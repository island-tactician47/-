// 研究開発は廃止した（2026-11-22）。解放は技術ツリー（data/tree.js のノード）に一本化。
// 旧セーブの研究は、Engine.normalize が「完了した研究＝対応するノードを開く、進行中＝払った分を返金」に移す（対応表は engine.js の legacyResearch）。
window.GAME_DATA = window.GAME_DATA || {};
GAME_DATA.research = {};
