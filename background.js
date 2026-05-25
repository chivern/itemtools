// ==============================
// 全自动执行：插件启动 → 检查更新 → 自动运行脚本
// 无点击！无操作！直接运行！
// ==============================

console.log("✅ 插件已启动，开始检查更新...");

const VERSION_URL = "https://raw.githubusercontent.com/chivern/itemtools/main/version.json?t=" + Date.now();
const SCRIPT_URL = "https://raw.githubusercontent.com/chivern/itemtools/main/content_script.js?t=" + Date.now();

let localVersion = null;

// 插件启动 自动执行
checkUpdate();

// 检查更新 + 自动注入脚本
async function checkUpdate() {
  console.log("开始检查更新...");

  try {
    // 1. 获取版本
    let res = await fetch(VERSION_URL);
    let text = await res.text();
    let data = JSON.parse(text.trim());
    let version = data.version;

    console.log("✅ 最新版本：", version);

    // 2. 获取最新脚本内容
    let scriptRes = await fetch(SCRIPT_URL);
    let code = await scriptRes.text();

    // 3. 自动注入所有页面
    await injectToAllTabs(code);
    localVersion = version;

    console.log("🎉 脚本更新成功！");

  } catch (err) {
    console.error("❌ 更新失败：", err);
  }
}

// 自动注入到 百度、淘宝、天猫 页面
async function injectToAllTabs(code) {
  let tabs = await chrome.tabs.query({
    url: [
      "https://detail.tmall.com/*",
      "https://item.taobao.com/*",
      "https://*.tmall.com/*"
    ]
  });

  for (let tab of tabs) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (remoteCode) => {
          // 自动执行最新脚本
          const script = document.createElement('script');
          script.textContent = remoteCode;
          document.documentElement.appendChild(script);
        },
        args: [code]
      });
    } catch (e) {}
  }
}
