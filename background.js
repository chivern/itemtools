// ======================================
// 填写你的 GitHub 信息
// ======================================
const GITHUB_USERNAME = "chivern";
const REPO_NAME = "itemminitools";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/tree/main/`;
const VERSION_URL = GITHUB_RAW + "version.json";
const SCRIPT_URL = GITHUB_RAW + "content_script.js";

let localVersion = null;

// 启动检查 
checkUpdate();
// ======================================
// 检查更新
// ======================================
async function checkUpdate() {
  try {
    const versionRes = await fetch(VERSION_URL);
    const { version } = await versionRes.json();

    if (version === localVersion) return;
    localVersion = version;

    const codeRes = await fetch(SCRIPT_URL);
    const newCode = await codeRes.text();

    await injectToAllTabs(newCode);
    console.log("✅ 小工具已自动更新至新版本：", version);
  } catch (err) {
    console.log("更新检查失败：", err);
  }
}

// ======================================
// 注入到淘宝/天猫所有页面
// ======================================
async function injectToAllTabs(code) {
  const tabs = await chrome.tabs.query({
    url: [
      "https://detail.tmall.com/*",
      "https://item.taobao.com/*",
      "https://*.tmall.com/*"
    ]
  });

  for (const tab of tabs) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (remoteCode) => {
          const oldScript = document.getElementById("remote-itemd-script");
          if (oldScript) oldScript.remove();

          const script = document.createElement("script");
          script.id = "remote-itemd-script";
          script.textContent = remoteCode;
          document.document.appendChild(script);
        },
        args: [code]
      });
    } catch (e) {}
  }
}
