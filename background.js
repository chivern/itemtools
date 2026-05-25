// 插件启动 → 自动更新 → 自动保存本地
console.log("✅ 插件已启动，开始检查更新...");

const VERSION_URL = "https://raw.githubusercontent.com/chivern/itemtools/main/version.json?t=" + Date.now();
const SCRIPT_URL = "https://raw.githubusercontent.com/chivern/itemtools/main/content_script.js?t=" + Date.now();

checkUpdate();

async function checkUpdate() {
  console.log("开始检查更新...");

  try {
    // 1. 获取版本
    let res = await fetch(VERSION_URL);
    let text = await res.text();
    let data = JSON.parse(text.trim());
    let version = data.version;

    console.log("✅ 最新版本：", version);

    // 2. 下载最新脚本
    let scriptRes = await fetch(SCRIPT_URL);
    let code = await scriptRes.text();

    // 3. 保存到本地存储（永久保存！）
    await chrome.storage.local.set({
      remoteScript: code,
      remoteVersion: version
    });

    console.log("🎉 脚本已保存到本地！更新成功！");

  } catch (err) {
    console.error("❌ 更新失败：", err);
  }
}
