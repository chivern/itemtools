// ======================================
// 填写你的 GitHub 信息
// ======================================
const GITHUB_USERNAME = "chivern";
const REPO_NAME = "itemtools";
const GITHUB_RAW = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/`;

const VERSION_URL = GITHUB_RAW + "version.json";
const SCRIPT_URL = GITHUB_RAW + "content_script.js";

let localVersion = null;

checkUpdate();

async function checkUpdate() {
  console.log("开始检测远程更新");
  try {
    const verRes = await fetch(VERSION_URL, {timeout:5000});
    if(!verRes.ok) throw new Error("版本文件请求失败");
    const {version} = await verRes.json();
    console.log("远程版本：",version,"本地版本：",localVersion);

    if(version === localVersion){
      console.log("暂无新版本");
      return;
    }
    localVersion = version;

    const codeRes = await fetch(SCRIPT_URL, {timeout:5000});
    if(!codeRes.ok) throw new Error("脚本文件请求失败");
    const newCode = await codeRes.text();
    await injectToAllTabs(newCode);
    console.log("✅ 已更新到新版本",version);
  } catch (err) {
    console.error("更新检测失败：",err.message);
  }
}

async function injectToAllTabs(code) {
  const tabs = await chrome.tabs.query({
    url: ["https://detail.tmall.com/*","https://item.taobao.com/*","https://*.tmall.com/*"]
  });
  for(const tab of tabs){
    try{
      await chrome.scripting.executeScript({
        target:{tabId:tab.id},
        func:(remoteCode)=>{
          let old = document.getElementById("remote-itemd-script");
          old&&old.remove();
          let script = document.createElement("script");
          script.id = "remote-itemd-script";
          script.textContent = remoteCode;
          document.documentElement.appendChild(script);
        },
        args:[code]
      })
    }catch(e){}
  }
}
