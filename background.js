const VERSION_URL = "https://raw.githubusercontent.com/chivern/itemtools/main/version.json";
const SCRIPT_URL = "https://raw.githubusercontent.com/chivern/itemtools/main/content_script.js";

let localVersion = null;

checkUpdate();

async function checkUpdate() {
  console.log("检查更新（直接 GitHub raw）");
  try {
    // background 里 fetch 不会跨域
    const verRes = await fetch(VERSION_URL);
    const { version } = await verRes.json();
    console.log("最新远程版本：", version);

    if (version === localVersion) {
      console.log("已是最新");
      return;
    }

    const codeRes = await fetch(SCRIPT_URL);
    const newCode = await codeRes.text();

    await injectToAllTabs(newCode);
    localVersion = version;
    console.log("更新成功");
  } catch (err) {
    console.error("更新失败：", err);
  }
}

async function injectToAllTabs(code) {
  const tabs = await chrome.tabs.query({
    url: ["https://detail.tmall.com/*", "https://item.taobao.com/*"]
  });
  for (const tab of tabs) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (code) => {
        const old = document.getElementById("remote-itemd-script");
        if (old) old.remove();
        const script = document.createElement("script");
        script.id = "remote-itemd-script";
        script.textContent = code;
        document.documentElement.appendChild(script);
      },
      args: [code]
    });
  }
}
