// 🔥 加了时间戳，永远读最新，不读缓存！
const VERSION_URL = "https://raw.githubusercontent.com/chivern/itemtools/main/version.json?t=" + Date.now();
const SCRIPT_URL = "https://raw.githubusercontent.com/chivern/itemtools/main/content_script.js?t=" + Date.now();

let localVersion = null;
checkUpdate();

async function checkUpdate() {
  console.log("开始检查更新...");
  try {
    let res = await fetch(VERSION_URL);
    let text = await res.text();
    let data = JSON.parse(text.trim()); // 现在绝对能解析成功
    let version = data.version;

    console.log("✅ 最新版本：", version);

    if (localVersion === version) {
      console.log("✅ 已经是最新版");
      return;
    }

    let scriptRes = await fetch(SCRIPT_URL);
    let code = await scriptRes.text();

    await injectToAllTabs(code);
    localVersion = version;
    console.log("🎉 脚本更新成功！");

  } catch (err) {
    console.error("❌ 错误信息：", err);
  }
}

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
          let old = document.getElementById("remote-itemd-script");
          if (old) old.remove();
          let script = document.createElement("script");
          script.id = "remote-itemd-script";
          script.textContent = remoteCode;
          document.documentElement.appendChild(script);
        },
        args: [code]
      });
    } catch (e) {}
  }
}
