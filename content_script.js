// ==UserScript==
// @name         淘宝天猫列表页修复（极简可用版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  只修复列表页，极简无多余功能
// @match        https://detail.tmall.com/*
// @match        https://item.taobao.com/*
// @match        https://*.tmall.com/search.htm?*
// @match        https://*.tmall.com/index.htm?*
// @match        https://*.tmall.com/category.htm?*
// @match        https://*.tmall.com/shop/view_shop.htm?*
// @grant        none
// @run-at       document-end
// ==/UserScript==
// ==/6666222228==
// ==/6666/22228==
// 自动读取本地存储里的最新脚本（自动更新的）
chrome.storage.local.get(["remoteScript"], (res) => {
  if (res.remoteScript) {
    try {
      // 执行最新脚本
      eval(res.remoteScript);
    } catch (e) {}
  } else {
    console.log("使用本地默认脚本");
    (function() {
    const url = location.href;

    // ==============================================
    // 【1】列表页自动修复（真正能生效版本）
    // ==============================================
    const isListPage = /search\.htm|index\.htm|category\.htm|view_shop\.htm/.test(url);
    if (isListPage) {
        console.log("✅ 列表页修复启动");

        // 注入强制显示CSS
        function addFixStyle() {
            let style = document.getElementById('fix-tmall-style');
            if (style) return;

            style = document.createElement('style');
            style.id = 'fix-tmall-style';
            style.textContent = `
                .skin-box-bd,
                .tshop-pbsm-tmall-srch-list,
                .J_TItems,
                .J_ItemList {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    height: auto !important;
                }
                #headerCon {
                    height: auto !important;
                    background: transparent !important;
                    background-image: none !important;
                }
                img[data-ks-lazyload] {
                    display: inline-block !important;
                }
            `;
            document.head.appendChild(style);

            // 强制加载懒加载图片
            document.querySelectorAll('[data-ks-lazyload]').forEach(img => {
                if (img.dataset.ksLazyload) {
                    img.src = img.dataset.ksLazyload;
                }
            });
        }

        // 立刻执行 + 延时多次执行（应对动态渲染）
        addFixStyle();
        setTimeout(addFixStyle, 600);
        setTimeout(addFixStyle, 1500);
        setTimeout(addFixStyle, 3000);

        // 监听页面DOM变化，一直强制修复
        const observer = new MutationObserver(() => {
            addFixStyle();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        console.log('✅ 列表页永久修复已生效');
        return;
    }




    const isDetailPage = /detail\.tmall\.com|item\.taobao\.com/.test(url);
    if (isDetailPage) {
        console.log("✅ 当前是详情页，加载功能按钮");

        // ==========================================
        // 下面粘贴你【原来所有的按钮 + 功能代码】
        // ==========================================
        window.onload = function() {
            // 创建一个外部容器来包含toggleButton和内部的按钮container
            var outerContainer = document.createElement('div');
            
            // 设置外部容器的样式
            Object.assign(outerContainer.style, {
                position: 'fixed',
                top: '120px',
                left: '6px',
                width: '50px',
                zIndex: '9999999',
            });

            // 创建一个div容器用于放置按钮
            var container = document.createElement('div');
            
            // 改：外围改成浅灰底色、加边框、强阴影，不和网页白色融在一起
            Object.assign(container.style, {
                width: '100%',
                background: '#f5f5f7',    // 浅灰底色，区别网页纯白
                padding: '2px 2px',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',  // 更深阴影
                border: '1px solid #ddd',  // 灰色细边框
                height: 'auto',
                overflow: 'hidden',
                maxHeight: '700px',
                transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
            });

            createButton(container, '提取<br>店名', '#FF6B6B', extractshopname);
            createButton(container, '店铺<br>链接', '#FF8CBA', extractShopLinkFromPage);
            createButton(container, '首图<br>链接', '#FFD93D', extractitemd1link);
            createButton(container, '主图<br>图片', '#68D8D6', itemZimg);
            createButton(container, '套餐<br>图片', '#A971FF', e1xtractImgSrcByXPathsku);
            createButton(container, '提取<br>详情', '#FF8CBA', extractImgSrcByXPath, '//*[@id="content"]');
            createButton(container, '提取<br>视频', '#84ECCF', extractVideoSrcFromPage);
            createButton(container, '商品<br>编码', '#FF6B6B', extractIditemdid);
            createButton(container, '商品<br>链接', '#FFD93D', itemlink);
            createButton(container, 'ALL<br>Links', '#68D8D6', titleandlink);
            createButton(container, '选框<br>放大', '#A971FF', extractcheack);
            createButton(container, '显示<br>商品', '#84ECCF', displayitem1);
            createButton(container, '读取<br>sku', '#FFD93D', getskutxtxinxi);

            var toggleButton = document.createElement('button');
            toggleButton.innerHTML = '折叠';
            Object.assign(toggleButton.style, {
                width: '100%',
                height: '36px',
                background: '#3e8df3',
                border: 'none',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '18px',
                marginBottom: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                color: '#333',
                transition: 'all 0.2s ease'
            });

            toggleButton.addEventListener('click', function() {
                if (container.style.maxHeight === '700px') {
                    container.style.maxHeight = '0';
                    toggleButton.innerHTML = '展开';
                } else {
                    container.style.maxHeight = '700px';
                    toggleButton.innerHTML = '折叠';
                }
            });

            outerContainer.appendChild(toggleButton);
            outerContainer.appendChild(container);
            document.body.appendChild(outerContainer);
            };

            /**
             * 创建一个按钮并添加到指定的容器中。
             * @param {HTMLElement} container - 要添加按钮的容器。
             * @param {string} text - 按钮上显示的文字。
             * @param {string} backgroundColor - 按钮的背景颜色。
             * @param {Function} clickHandler - 点击按钮时调用的函数。
             * @param {string} [xpath] - 可选参数，用于传递给clickHandler的额外数据。
             */


            function createButton(container, text, backgroundColor, clickHandler, xpath) {
                var button = document.createElement('button');
                var buttonText = document.createElement('span');
                buttonText.innerHTML = text;

                Object.assign(button.style, {
                    width: '44px',
                    height: '46px',
                    margin: '0',
                    background: backgroundColor,
                    border: 'none',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                });

                // 改成深色字体，清晰不刺眼
                Object.assign(buttonText.style, {
                    fontSize: '12px',
                    fontFamily: '微软雅黑, sans-serif',
                    color: '#222222',
                    fontWeight: '600',
                    pointerEvents: 'none',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    zIndex: 2
                });

                button.appendChild(buttonText);

                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'scale(1.05)';
                    button.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)';
                });

                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'scale(1)';
                    button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
                });

                button.addEventListener('click', function() {
                    button.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                        xpath ? clickHandler(xpath) : clickHandler();
                    }, 180);
                });

                container.appendChild(button);
            }



            function displayitem1() {
            // === 模块 1：显示指定模块 ===
            try {
                document.querySelectorAll('.header-extra, .skin-box.tb-module.tshop-pbsm.tshop-pbsm-tmall-srch-list')
                        .forEach(el => el.style.display = 'block');
            } catch (e) {
                console.warn?.('[Module] 显示模块失败:', e);
            }

            // === 模块 2：调整 headerCon ===
            try {
                const header = document.getElementById('headerCon');
                if (header) {
                    header.style.height = '30px';
                    header.style.backgroundImage = 'none';
                    header.style.display = 'block'; // 确保 header 自身可见
                }
            } catch (e) {
                console.warn?.('[Header] 调整 headerCon 失败:', e);
            }

            // === 模块 3：加载懒加载图片 ===
            try {
                const imgs = document.querySelectorAll('.photo img');
                console.log(`[Image] 找到 ${imgs.length} 张待处理图片`);
                imgs.forEach(img => {
                    const lazySrc = img.getAttribute('data-ks-lazyload');
                    if (lazySrc && !img.src) { // 只设置空 src 的图片
                        img.src = lazySrc;
                        img.removeAttribute('data-ks-lazyload'); // 可选：防止重复执行
                    }
                });
            } catch (e) {
                console.warn?.('[Image] 图片加载失败:', e);
            }
            }

            // ✅ 确保 DOM 加载完成后再执行
            if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', displayitem1);
            } else {
            displayitem1(); // 页面已加载，立即执行
            }



            //获取详情动图
            function extractImgSrcByXPath(xpath) {
            // 1. 域名校验：仅允许淘宝/天猫详情页
            const currentDomain = window.location.hostname;
            const condition1 = currentDomain.includes("item.taobao.com");
            const condition2 = currentDomain.includes("detail.tmall.com");
            if (!condition1 && !condition2) {
                alert("当前域名不符合要求。");
                return;
            }

            try {
                console.log("XPath:", xpath);
                // 2. 用XPath定位图片容器（优先传入的XPath）
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                let containerElement = result.singleNodeValue; // 注意：这里改为let，方便重试

                // 3. 重试逻辑：原XPath找不到则用固定XPath
                if (!containerElement) {
                xpath = '//*[@id="imageTextInfo-container"]';
                console.log("重试XPath:", xpath);
                const retryResult = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                containerElement = retryResult.singleNodeValue;
                // 原代码bug：这里直接return了，导致即使重试找到容器也会终止，已修正
                if (!containerElement) {
                    alert("未找到匹配的元素，请检查XPath路径。");
                    return;
                }
                }

                // 4. 图片数量校验：不足6张则提示无需导出
                const imgElements = containerElement.getElementsByTagName('img');
                if (imgElements.length <= 5) {
                alert(`图片数量不足6个（共${imgElements.length}个），无需导出。`);
                return;
                }

                // 5. 提取并清理图片链接
                const pcxdataList = Array.from(imgElements)
                .slice(0, 99) // 限制前99张
                .map((img, index) => {
                    // 获取img的src（兼容直接属性和getAttribute）
                    const src = img.src || img.getAttribute('src') || '';
                    // 清理链接：去除尺寸/质量参数、URL参数，trim去空格
                    let cleanedSrc = src.replace(/(?:_\d+x\d+q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|_q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|\?.*)/g, '').trim();
                    // 补全协议（//开头的链接加https:）
                    const finalUrl = cleanedSrc.startsWith('//') ? 'https:' + cleanedSrc : cleanedSrc;
                    // 返回[详情序号, 清理后的URL]
                    return [`详情${index + 1}`, finalUrl];
                })
                .filter(row => row[1]); // 过滤空URL

                // 6. 空链接校验
                if (pcxdataList.length === 0) {
                alert("未找到有效的图片链接。");
                return;
                }

                // 7. 生成CSV文件（处理特殊字符，避免CSV格式错乱）
                const csvContent = [
                "文本内容,图片URL",
                ...pcxdataList.map(row => {
                    // 转义CSV中的双引号和逗号：双引号替换为两个，内容包裹双引号
                    const text = row[0].replace(/"/g, '""');
                    const url = row[1].replace(/"/g, '""');
                    return `"${text}","${url}"`;
                })
                ].join("\n");

                // 8. 下载CSV（添加BOM头避免中文乱码）
                const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = "淘宝PC详情数据.csv";
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(downloadUrl); // 释放URL对象，避免内存泄漏

                console.log("CSV文件已生成，共提取数据:", pcxdataList.length);

            } catch (error) {
                console.error("提取失败:", error);
                alert("提取失败: " + error.message);
            }
            }

            //获取视频链接
            function extractVideoSrcFromPage() {
                // 获取当前窗口的域名
                const currentDomain = window.location.hostname;
            
                console.log(currentDomain);
                
                // 假设的条件1和条件2
                const condition1 = currentDomain.includes("item.taobao.com");
                const condition2 = currentDomain.includes("detail.tmall.com");
            
                // 检查域名是否符合任一条件
                if (!condition1 && !condition2) {
                    alert("当前域名不符合要求。");
                    return; // 结束函数执行
                }
            try {
                const videoElement = document.querySelector('#videox-video-el');
                console.log(videoElement); // 添加这行来检查是否成功找到视频元素
                if (!videoElement) {
                throw new Error("No video element with id 'videox-video-el' found.");
                }

                const videoSrc = videoElement.getAttribute('src');

                if (!videoSrc) {
                throw new Error("No 'src' attribute found on the video element.");
                }
                const result = `https:${videoSrc}`;
                console.log(result);

                // 创建一个临时的 input 元素用于复制文本
                let tempInput = document.createElement("input");
                document.body.appendChild(tempInput);
                tempInput.value = result;
                tempInput.select();
                document.execCommand("copy"); // 复制所选内容到剪贴板

                // 移除临时输入框
                document.body.removeChild(tempInput);

                // 可以选择显示一个提示信息给用户表示复制成功
                // alert("已复制到剪切板，按ctrl+v粘贴使用；视频源地址: " + result);

            } catch (error) {
                console.error("An error occurred:", error.message);
                // 同样地，对于错误信息也可以使用 alert 来显示
                alert("Error: " + error.message);
            }
            }

            // 获取店铺名（从JS代码中查找shopname参数）
            function extractshopname() {
            // 获取当前窗口的域名
            const currentDomain = window.location.hostname;

            console.log(currentDomain);
                
            // 检查域名是否为淘宝/天猫商品详情页
            const condition1 = currentDomain.includes("item.taobao.com");
            const condition2 = currentDomain.includes("detail.tmall.com");

            if (!condition1 && !condition2) {
                alert("当前域名不符合要求。");
                return;
            }

            // 封装异步逻辑到内部async函数
            const getAndCopyShopName = async () => {
                try {
                    // 核心逻辑：查找所有script标签中的shopname参数
                    // 核心逻辑：查找所有script标签中的shopname参数（异步函数内执行）
                    let shopName = null;
                    const scriptTags = document.querySelectorAll('script');

                    // 遍历所有script标签内容
                    for (const script of scriptTags) {
                        const scriptContent = script.textContent || script.innerText;

                        // 正则匹配 "shopname":"店铺名称" 格式（兼容单引号/无引号）
                        const regex = /["']shopname["']\s*:\s*["']([^"']+)["']/i;
                        const match = scriptContent.match(regex);

                        if (match && match[1]) {
                            shopName = match[1].trim();
                            break;
                        }
                    }

                    // 方案1没找到 → 方案2：查找所有带 title 属性的 span（无class）
                    if (!shopName) {
                        const allTitleSpans = document.querySelectorAll('span[title]');
                        for (const span of allTitleSpans) {
                            const title = span.getAttribute('title').trim();
                            if (title && title.length > 2 && title.length < 30) {
                                shopName = title;
                                break;
                            }
                        }
                    }

                    console.log('找到的店铺名:', shopName);
                        // 复制到剪贴板（双方案兼容，处理异步）
                        if (navigator.clipboard && window.isSecureContext) {
                            await navigator.clipboard.writeText(shopName);
                        } else {
                            const tempInput = document.createElement("input");
                            document.body.appendChild(tempInput);
                            tempInput.value = shopName;
                            tempInput.select();
                            document.execCommand("copy");
                            document.body.removeChild(tempInput);
                        }

                } catch (error) {
                    console.error("获取/复制店铺名失败:", error.message);
                    alert("操作失败：" + error.message);
                }
            };

            // 执行内部异步函数
            getAndCopyShopName();


            }



            //获取商品id
            function extractIditemdid() {
                // 获取当前窗口的域名
                const currentDomain = window.location.hostname;
            
                console.log(currentDomain);
                
                // 假设的条件1和条件2
                const condition1 = currentDomain.includes("item.taobao.com");
                const condition2 = currentDomain.includes("detail.tmall.com");
            
                // 检查域名是否符合任一条件
                if (!condition1 && !condition2) {
                    alert("当前域名不符合要求。");
                    return; // 结束函数执行
                }
            try {
                const webpageText = document.documentElement.outerHTML;

                const itemIdRegex = /data-item="(\d+)"/;
                const itemIdMatch = webpageText.match(itemIdRegex);

                if (!itemIdMatch) {
                    throw new Error("No match found for data-item attribute.");
                }

                const itemId = itemIdMatch[1];
                console.log(itemId);
                // 创建一个临时的 input 元素用于复制文本
                let tempInput = document.createElement("input");
                document.body.appendChild(tempInput);
                tempInput.value = itemId;
                tempInput.select();
                document.execCommand("copy"); // 复制所选内容到剪贴板

                // 移除临时输入框
                document.body.removeChild(tempInput);

                // 可以选择显示一个提示信息给用户表示复制成功
                // alert("已复制到剪切板，按ctrl+v粘贴使用；商品id: " + itemId);

                } catch (error) {
                console.error("An error occurred:", error.message);
                // 同样地，对于错误信息也可以使用 alert 来显示
                alert("Error: " + error.message);
                }
            }

            //获取商品主图1链接
            function extractitemd1link() {
            try {
                // 1. 检查当前域名是否是淘宝/天猫
                const currentDomain = window.location.hostname;
                const condition1 = currentDomain === 'item.taobao.com';        // 淘宝商品页
                const condition2 = currentDomain === 'detail.tmall.com';       // 天猫商品页
            
                if (!(condition1 || condition2)) {
                alert("未知域名，仅支持淘宝(item.taobao.com)和天猫(detail.tmall.com)");
                return;
                }
            
                // 使用轮询确保页面加载完成（关键！）
                function waitForThumbnails() {
                const xpath = '//div[contains(@class, "thumbnails--")]/div[1]';
                const targetElement1 = document.evaluate(
                    xpath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
            
                if (!targetElement1) {
                    console.log('⏳ 缩略图容器未找到，500ms后重试...');
                    setTimeout(waitForThumbnails, 500);
                    return;
                }
            
                // 从 targetElement1 中查找第一个 img 子元素
                const imgElement = targetElement1.querySelector('img');
                if (!imgElement || !imgElement.src) {
                    console.log('⏳ 图片元素未加载，500ms后重试...');
                    setTimeout(waitForThumbnails, 500);
                    return;
                }
            
                let imgSrc = imgElement.src;
            
                // 清理图片 URL：去除缩略图参数、格式转换、查询参数
                let cleanedImageUrl = imgSrc.replace(/(?:_\d+x\d+q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|_q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|\?.*)/g, '').trim();
            
                // 补全协议（如果是 // 开头）
                if (cleanedImageUrl.startsWith("//")) {
                    cleanedImageUrl = "https:" + cleanedImageUrl;
                }
            
                // 输出结果
                console.log('原始图片地址:', cleanedImageUrl);
            
                // 创建临时 input 用于复制
                const tempInput = document.createElement("input");
                tempInput.style.position = 'fixed';
                tempInput.style.opacity = 0;
                document.body.appendChild(tempInput);
                tempInput.value = cleanedImageUrl;
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
            
                // 提示用户
                alert("已复制到剪切板，按 Ctrl+V 粘贴使用\n主图链接：" + cleanedImageUrl);
            
                }
            
                // 开始等待元素
                waitForThumbnails();
            
            } catch (error) {
                console.error("An error occurred:", error);
                alert("Error: " + error.message);
            }
            }

            //放大选框
            function extractcheack() {
            // 获取当前窗口的域名
            const currentDomain = window.location.hostname;
            
            console.log(currentDomain);
                
            // 假设的条件1和条件2
            const condition1 = currentDomain.includes("item.taobao.com");
            const condition2 = currentDomain.includes("detail.tmall.com");

            // 检查是否符合任一条件1或条件2，如果符合则结束函数
            if (condition1 || condition2) {
                alert("当前域名不符合要求。");
                return; // 结束函数执行
            }

            ///示例：假设还有第三个条件或其他操作
            // const condition3 = currentDomain.includes("s.tmall.com");
            // if(condition3){
            //     // 执行特定于condition3的操作
            // }

            //至尊宝插件定位元素并放大    
            var inputElements = document.querySelectorAll('.zzb_item_checbox.zzb_item_checbox_hasSold');
            inputElements.forEach(function(inputElement) {
                // 使用 transform 属性来缩放元素到200%
                inputElement.style.transform = 'scale(2)';
                // 可选：设置缩放的中心点，默认是50% 50%，这里设置为左上角
                inputElement.style.transformOrigin = '0 0';
                
            });
            //哈士奇插件定位元素并放大
            // 选择所有具有 .hsq-checkbox__inner 类的元素
            var checkboxElements = document.querySelectorAll('.hsq-checkbox__inner');
            // 遍历每个选中的元素并设置其宽度和高度
            checkboxElements.forEach(function(spanElement) {
                // 设置宽度为50像素
                spanElement.style.width = '100px';
                // 设置高度为20像素
                spanElement.style.height = '30px';
                
                // 添加边框
                spanElement.style.border = '1px solid #000'; // 2像素宽的实线黑色边框
                
            });
            }

            //获取商品和链接
            function titleandlink() {
            // 获取当前窗口的域名
            const currentDomain = window.location.hostname;

            console.log(currentDomain);
                
            // 假设的条件1和条件2
            const condition1 = currentDomain.includes("item.taobao.com");
            const condition2 = currentDomain.includes("detail.tmall.com");

            // 检查域名是否符合任一条件
            if (!condition1 && !condition2) {
                alert("当前域名不符合要求。"); // 保留该弹窗
                return; // 结束函数执行
            }



            // 封装所有逻辑到内部async函数，处理异步获取店铺名
            const getTitleLinkAndShopName = async () => {
                try {
                const webpageText = document.documentElement.outerHTML;

                const itemIdRegex = /data-item="(\d+)"/;
                const itemIdMatch = webpageText.match(itemIdRegex);

                if (!itemIdMatch) {
                    throw new Error("No match found for data-item attribute.");
                }

                const itemId = "https://detail.tmall.com/item.htm?id="+itemIdMatch[1];
                console.log(itemId);

                // 获取 <title> 标签的文本内容
                const titleElement = document.querySelector('title');
                if (!titleElement) { // 新增：检查title元素是否存在
                    throw new Error("未找到title标签");
                }
                const titleText1 = titleElement.textContent.trim();
                console.log(titleText1); 

                // Step 3: 判断域名条件（修复：变量名重复问题，改用新变量）
                const isTaobao = currentDomain === 'item.taobao.com';        // 淘宝商品页
                const isTmall = currentDomain === 'detail.tmall.com';       // 天猫商品页

                // 修复：声明cleaned变量（原代码未声明导致全局污染）
                let cleaned = '';
                if (isTaobao) {
                    cleaned = titleText1.replace(/\s*-淘宝网\s*$/g, '').trim();
                    console.log("淘宝清理后:", cleaned);
                } else if (isTmall) {
                    cleaned = titleText1.replace(/\s*-tmall\.com天猫\s*$/g, '').trim();
                    console.log("天猫清理后:", cleaned);
                } else {
                    cleaned = titleText1; // 兜底：使用原始标题
                    console.log("未知域名，使用原始标题:", cleaned);
                }

                // Step 5: 拼接结果（临时）
                const titleandlinks = itemId + "," + cleaned;
                console.log("临时结果(无店铺名):", titleandlinks);



                // 核心逻辑：查找所有script标签中的shopname参数（异步函数内执行）
                let shopName = null;
                const scriptTags = document.querySelectorAll('script');

                // 遍历所有script标签内容
                for (const script of scriptTags) {
                    const scriptContent = script.textContent || script.innerText;

                    // 正则匹配 "shopname":"店铺名称" 格式（兼容单引号/无引号）
                    const regex = /["']shopname["']\s*:\s*["']([^"']+)["']/i;
                    const match = scriptContent.match(regex);

                    if (match && match[1]) {
                        shopName = match[1].trim();
                        break;
                    }
                }

                // 方案1没找到 → 方案2：查找所有带 title 属性的 span（无class）
                if (!shopName) {
                    const allTitleSpans = document.querySelectorAll('span[title]');
                    for (const span of allTitleSpans) {
                        const title = span.getAttribute('title').trim();
                        if (title && title.length > 2 && title.length < 30) {
                            shopName = title;
                            break;
                        }
                    }
                }

                console.log('找到的店铺名:', shopName);

                // 优先级：￥ > 券后 > 秒杀价
                // 查找规则：文字与价格在同一个DIV下，是同级兄弟元素
                function getTargetPrice() {
                    // 1. 拿到页面所有 span
                    const allSpans = document.querySelectorAll('span');
                    let targetParentDiv = null;

                    // ===== 第一步：找到包含关键词的 span，并获取它的父级DIV =====
                    for (const span of allSpans) {
                    const text = span.textContent.trim();
                    
                    // 优先匹配：￥
                    if (text.includes('￥')) {
                        targetParentDiv = span.parentElement;
                        break;
                    }
                    // 备选1：券后
                    if (!targetParentDiv && text.includes('券后')) {
                        targetParentDiv = span.parentElement;
                        break;
                    }
                    // 备选2：秒杀价
                    if (!targetParentDiv && text.includes('秒杀价')) {
                        targetParentDiv = span.parentElement;
                        break;
                    }
                    }

                    // 没找到父容器 → 退出
                    if (!targetParentDiv) {
                    console.log('❌ 未找到价格区域');
                    return null;
                    }

                    // ===== 第二步：在同一个父DIV下，找所有子span，提取价格 =====
                    const siblingSpans = targetParentDiv.querySelectorAll(':scope > span');
                    for (const s of siblingSpans) {
                    const content = s.textContent.trim();
                    // 匹配纯数字价格（整数/小数）
                    if (/^\d+(\.\d+)?$/.test(content)) {
                        console.log('✅ 找到价格：', content);
                        return content;
                    }
                    }

                    console.log('❌ 未找到价格数字');
                    return null;
                }

                // 执行
                const price = getTargetPrice();
                console.log('最终价格：', price);

                // 最终拼接：店铺名 + 商品链接 + 清理后标题 + 价格
                const titleandlinks1 = shopName + "," + itemId + "," + cleaned + "," + price ;
                console.log("最终结果:", titleandlinks1);
                
                // 复制到剪贴板（双方案兼容，处理异步）
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(titleandlinks1);
                } else {
                    const tempInput = document.createElement("input");
                    document.body.appendChild(tempInput);
                    tempInput.value = titleandlinks1;
                    tempInput.select();
                    document.execCommand("copy");
                    document.body.removeChild(tempInput);
                }

                // ====== 已移除复制成功的弹窗 ======
                // alert(`已复制数据到剪贴板：\n${titleandlinks1}`);

                } catch (error) {
                console.error("An error occurred:", error.message);
                alert("Error: " + error.message); // 保留该错误弹窗
                }
            };

            // 执行内部异步函数
            getTitleLinkAndShopName();
            }

            //获取SKU图片
            function e1xtractImgSrcByXPathsku() {
                try {
                    // ============== 新增：登录状态判断（核心修改点） ==============
                    // 1. 获取用户昵称元素，判断是否包含英文冒号
                    const userNickEl = document.querySelector('p.site-nav-user-nick');
                    let needBackupPlan = false;

                    if (userNickEl) {
                        const nickText = userNickEl.textContent.trim();
                        // 判断是否包含 英文冒号 :
                        needBackupPlan = nickText.includes(':');
                    }

                    // ============== 执行对应方案 ==============
                    if (needBackupPlan) {
                        // ====================== 备用方案：未登录/子账号模式 ======================
                        console.log("检测到昵称含冒号，执行备用方案");

                        // 1. 获取所有 class 包含 skuValueWrap 的 div 元素
                        const skuValueWraps = document.querySelectorAll('div[class*="skuValueWrap"]');

                        // 如果一个都没找到 → 提示并退出
                        if (skuValueWraps.length === 0) {
                            alert("备用方案：未找到 skuValueWrap 元素！");
                            return;
                        }

                        let targetSkuValueWrap = null; // 最终要选中的元素

                        // 2. 遍历每一个 skuValueWrap，按你的规则匹配
                        for (const skuValueWrap of skuValueWraps) {
                            // 找到 skuValueWrap 的**上一级父 div**
                            const parentDiv = skuValueWrap.parentElement;
                            if (!parentDiv || parentDiv.tagName !== 'DIV') continue; // 确保父级是 div

                            // 找到父级内的**第一个子 div**
                            const firstChildDiv = parentDiv.querySelector(':scope > div:first-child');
                            if (!firstChildDiv) continue;

                            // 3. 判断第一个 div 内是否包含文本：颜色分类
                            const divText = firstChildDiv.textContent.trim().toLowerCase();

                            // 第一步：优先匹配 颜色 / 颜色分类
                            if (divText.includes('颜色') || divText.includes('颜色分类')) {
                                targetSkuValueWrap = skuValueWrap;
                                break;
                            }
                            // 第二步：如果上面没匹配到，再匹配 商品规格
                            if (divText.includes('商品规格')) {
                                targetSkuValueWrap = skuValueWrap;
                                break;
                            }
                        }

                        // 4. 最终判断
                        if (!targetSkuValueWrap) {
                            alert("备用方案：所有 skuValueWrap 均未匹配到【颜色分类】！");
                            return;
                        }

                        // ✅ 这里就是你最终要使用的目标元素
                        console.log('✅ 成功定位到目标 skuValueWrap：', targetSkuValueWrap);


                        
                        // 1. 定位 class 包含 contentWrap 的 div
                        const contentWrap = targetSkuValueWrap.querySelector('div[class*="contentWrap"]');
                        if (!contentWrap) {
                            alert("备用方案：未找到 contentWrap 元素！");
                            return;
                        }

                        // 2. 进入第一个子 div
                        const firstChildDiv = contentWrap.querySelector(':scope > div');
                        if (!firstChildDiv) {
                            alert("备用方案：未找到 contentWrap 下的子元素！");
                            return;
                        }

                        // 3. 获取一级子 div 列表
                        const itemDivs = Array.from(firstChildDiv.children).filter(child => child.tagName === 'DIV');
                        if (itemDivs.length === 0) {
                            alert("备用方案：未找到任何SKU数据！");
                            return;
                        }

                        // 4. 提取数据
                        const dataList = [];
                        itemDivs.forEach((item, index) => {
                            // 读取 span 的 title 属性
                            const skuName = item.querySelector('span')?.getAttribute('title')?.trim() || `sku${index+1}`;
                            // 读取 img 的 src
                            const originalImgUrl = item.querySelector('img')?.src || "无图片";
                            // 图片地址清洗（和原逻辑保持一致）
                            const imgSrc = originalImgUrl.replace(/(?:_\d+x\d+q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|_q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|\?.*)/g, '').trim();
                            
                            dataList.push([`sku${index+1}.${skuName}`, imgSrc]);
                        });

                        // 生成并下载CSV
                        exportToCsv(dataList, "淘宝商品SKU备用方案数据.csv");

                    } else {
                        // ====================== 原始方案：正常登录模式 ======================
                        console.log("未检测到冒号，执行原始方案");
                        
                        // 1. 检查当前域名是否是淘宝/天猫
                        const currentDomain = window.location.hostname;
                        const condition1 = currentDomain === 'item.taobao.com';        // 淘宝商品页
                        const condition2 = currentDomain === 'detail.tmall.com';       // 天猫商品页

                        let targetElement = null;
                        
                        if (condition1 || condition2 ) {
                            const xpath = '//*[@id="tbpcDetail_SkuPanelBody"]/div[contains(., "颜色分类")]/div/div[1]/div[contains(., "颜色分类")]/div[2]/div/div';
                            targetElement = document.evaluate(
                                xpath,
                                document,
                                null,
                                XPathResult.FIRST_ORDERED_NODE_TYPE,
                                null
                            ).singleNodeValue;
                        
                            // 如果仍然找不到，报错并退出
                            if (!targetElement) {
                                alert("TM未找到商品规格数据，请确认页面是否加载完成！");
                                return;
                            }

                        } else {
                            alert("未知域名，仅支持淘宝(item.taobao.com)和天猫(detail.tmall.com)");
                            return;
                        }
                        
                        // 3. 遍历子元素，提取文本和图片URL
                        const dataList = [];
                        const childDivs = Array.from(targetElement.children).filter(child => child.tagName === 'DIV');

                        childDivs.forEach((childDiv,index) => {
                            const spanText = childDiv.querySelector('span')?.textContent.trim() || "无文本";
                            const originalImgUrl = childDiv.querySelector('img')?.src || "无图片URL";
                            const imgSrc = originalImgUrl.replace(/(?:_\d+x\d+q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|_q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|\?.*)/g, '').trim();
                            const enhancedText = `sku${index+1}.${spanText}`;
                            dataList.push([enhancedText, imgSrc]);
                        });

                        // 生成并下载CSV
                        exportToCsv(dataList, "淘宝商品SKU图数据.csv");
                    }

                } catch (error) {
                    console.error("错误:", error);
                    alert("提取失败: " + error.message);
                }
            }

            // ============== 公共工具函数：CSV导出（复用代码，简化逻辑） ==============
            function exportToCsv(dataList, fileName) {
                try {
                    // 生成CSV
                    const csvContent = [
                        "文本内容,图片URL",
                        ...dataList.map(row => `"${row[0]}","${row[1]}"`)
                    ].join("\n");

                    // 下载文件
                    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = fileName;
                    link.click();

                    // 清理资源
                    setTimeout(() => {
                        URL.revokeObjectURL(downloadUrl);
                        link.remove();
                    }, 100);

                    console.log("CSV文件已生成，共提取数据:", dataList.length);
                    alert(`提取成功！共 ${dataList.length} 条SKU数据`);
                } catch (err) {
                    console.error("导出CSV失败：", err);
                    alert("导出文件失败");
                }
            }


            //获取PC图片
            function itemZimg() {
            try {
                // 1. 检查当前域名是否是淘宝/天猫
                const currentDomain = window.location.hostname;
                const condition1 = currentDomain === 'item.taobao.com';        // 淘宝商品页
                const condition2 = currentDomain === 'detail.tmall.com';       // 天猫商品页

                let targetElement = null;  // 使用let声明变量
                
                if (condition1 || condition2 ) {
                const xpath = '//div[contains(@class, "thumbnails--")]';
                targetElement = document.evaluate(
                    xpath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
            
                // 如果仍然找不到，报错并退出
                if (!targetElement) {
                    alert("未找到指定数据类型ZT，请确认页面是否加载完成！");
                    return;
                }

                } else {
                alert("未知域名，仅支持淘宝(item.taobao.com)和天猫(detail.tmall.com)");
                return;
                }
            
                // 3. 遍历子元素，提取文本和图片URL
                const pcdataList = [];
                const pcchildDivs = Array.from(targetElement.children).filter(child => child.tagName === 'DIV');

                pcchildDivs.forEach((pcchildDiv, index) => {
                const pcspanText = `主图${index + 1}`; // 主图1、主图2、主图3...
                const pcoriginalImgUrl = pcchildDiv.querySelector('img')?.src || "无图片URL";
                const pcimgSrc = pcoriginalImgUrl.replace(/(?:_\d+x\d+q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|_q\d+[^?]*?\.(?:jpg|png|webp)?_\.(?:jpg|png|webp)|\?.*)/g, '').trim();
                pcdataList.push([pcspanText, pcimgSrc]); // 确保顺序：[文本, URL]
                });

                // 4. 生成CSV（确保第一列是文本，第二列是URL）
                const csvContent = [
                "文本内容,图片URL", // CSV表头
                ...pcdataList.map(row => `"${row[0]}","${row[1]}"`) // 数据行
                ].join("\n");

                // 5. 下载CSV文件（UTF-8编码）
                const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = "淘宝PC主图数据.csv";
                link.click();

                // 6. 清理资源
                setTimeout(() => {
                URL.revokeObjectURL(downloadUrl);
                link.remove();
                }, 100);

                console.log("CSV文件已生成，共提取数据:", pcdataList.length);
            } catch (error) {
                console.error("错误:", error);
                alert("提取失败: " + error.message);
            }
            }

            //获取商品链接
            function itemlink() {
            // 获取当前窗口的域名
            const currentDomain = window.location.hostname;

            console.log(currentDomain);
                
            // 假设的条件1和条件2
            const condition1 = currentDomain.includes("item.taobao.com");
            const condition2 = currentDomain.includes("detail.tmall.com");

            // 检查域名是否符合任一条件
            if (!condition1 && !condition2) {
                alert("当前域名不符合要求。");
                return; // 结束函数执行
            }
            try {
                const webpageText = document.documentElement.outerHTML;

                const itemIdRegex = /data-item="(\d+)"/;
                const itemIdMatch = webpageText.match(itemIdRegex);

                if (!itemIdMatch) {
                    throw new Error("No match found for data-item attribute.");
                }

                const itemId = "https://detail.tmall.com/item.htm?id="+itemIdMatch[1];

                console.log(itemId);
                const links = itemId ;
                console.log("最终结果:", links);
                
                // 创建一个临时的 input 元素用于复制文本
                let tempInput = document.createElement("input");
                document.body.appendChild(tempInput);
                tempInput.value = links;
                tempInput.select();
                document.execCommand("copy"); // 复制所选内容到剪贴板

                // 移除临时输入框
                document.body.removeChild(tempInput);

                // 可以选择显示一个提示信息给用户表示复制成功
                // alert("已复制到剪切板，按ctrl+v粘贴使用；商品id: " + links);

            } catch (error) {
                console.error("An error occurred:", error.message);
                // 同样地，对于错误信息也可以使用 alert 来显示
                alert("Error: " + error.message);
            }
            }

            //拼接标题
            function getAllText() {
            // 获取容器元素
            const container = document.querySelector('span'); // 根据实际结构调整选择器
            
            // 递归提取所有文本节点内容
            let fullText = '';
            const extractText = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                fullText += node.textContent.trim();
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 处理所有子节点
                node.childNodes.forEach(extractText);
                }
            };
            
            extractText(container);
            return fullText;
            }

            function extractShopLinkFromPage() {
            // 获取当前窗口的域名（保留原有的域名检查逻辑）
            const currentDomain = window.location.hostname;

            console.log("当前域名:", currentDomain);
                
            // 保留原有的域名检查条件
            const condition1 = currentDomain.includes("item.taobao.com");
            const condition2 = currentDomain.includes("detail.tmall.com");

            // 检查域名是否符合任一条件
            if (!condition1 && !condition2) {
                alert("当前域名不符合要求。");
                return; // 结束函数执行
            }

            // 核心修改：将包含await的逻辑封装到内部async函数中
            const getAndCopyShopLink = async () => {
                try {
                    // 核心逻辑：查找包含"进店"文本的span元素
                    const xpath = "//span[contains(text(), '进店')]";
                    const spanElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (!spanElement) {
                        throw new Error("未找到包含'进店'文本的span元素。");
                    }
                    console.log("找到目标span元素:", spanElement);

                    // 向上查找最近的父级a标签
                    const aElement = spanElement.closest('a');
                    if (!aElement) {
                        throw new Error("找到的span元素没有父级a标签。");
                    }
                    console.log("找到父级a标签:", aElement);

                    // 获取a标签的href属性值
                    const hrefValue1 = aElement.getAttribute('href');
                    if (!hrefValue1) {
                        throw new Error("a标签中未找到href属性值。");
                    }
                    console.log("提取到的href值:", hrefValue1);
                    const hrefValue="https:"+hrefValue1
                    // 复制href值到剪贴板（双方案兼容）
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(hrefValue);
                    } else {
                        const tempInput = document.createElement("input");
                        document.body.appendChild(tempInput);
                        tempInput.value = hrefValue;
                        tempInput.select();
                        document.execCommand("copy");
                        document.body.removeChild(tempInput);
                    }

                    // ====== 已删除复制成功的弹窗提示 ======
                    // alert(`已成功复制进店链接到剪贴板：\n${hrefValue}`);

                } catch (error) {
                    console.error("提取链接时出错:", error.message);
                    //alert("提取链接失败：" + error.message);
                }
            };
            getAndCopyShopLink();
            }


            // ===================== 核心工具函数：查找指定特征的script标签内容 =====================
            /**
             * 查找页面中包含指定特征字符串的script标签内容
             * @param {string} feature - 特征字符串（如 "!(function ()"）
             * @returns {string} 匹配的script标签内容，未找到则返回空字符串
             */
            function getScriptContentWithFeature(feature) {
            try {
                console.log(`开始查找包含特征 "${feature}" 的script标签...`);
                
                // 获取页面所有script标签
                const allScripts = document.querySelectorAll('script');
                if (allScripts.length === 0) {
                console.error('错误：页面中未找到任何script标签');
                return '';
                }

                // 遍历查找包含特征字符串的script标签（忽略空格/换行）
                for (let script of allScripts) {
                const scriptContent = script.textContent || script.innerText || '';
                const normalizedContent = scriptContent.replace(/\s+/g, ' ').trim();
                const normalizedFeature = feature.replace(/\s+/g, ' ').trim();
                
                if (normalizedContent.includes(normalizedFeature)) {
                    console.log('✅ 找到匹配的script标签，提取内容成功');
                    return scriptContent;
                }
                }

                console.warn(`⚠️ 未找到包含特征 "${feature}" 的script标签`);
                return '';
            } catch (error) {
                console.error('❌ 提取script标签内容失败：', error.message);
                return '';
            }
            }

            // ===================== 核心解析函数：从脚本内容提取SKU价格信息 =====================
            /**
             * 解析原始脚本内容，提取skuBase/props/sku2info关联的价格信息
             * @param {string} rawCode - 从script标签提取的原始代码
             * @returns {object} 解析结果（success: 布尔值, data: 价格列表/error: 错误信息）
             */
            function extractBValueFromTruncatedCode(rawCode) {
            try {
                if (!rawCode || rawCode.trim() === '') {
                throw new Error('原始代码字符串为空，无法解析');
                }

                // 定位var b = 后的内容
                const bStart = rawCode.indexOf('var b = ') + 7;
                if (bStart === 6) { // indexOf返回-1时，+7=6
                throw new Error('未找到 "var b = " 关键字');
                }
                
                let bContent = rawCode.substring(bStart);
                const bracePositions = [];
                
                // 收集所有闭合大括号的位置，用于定位JSON结束位置
                for (let i = 0; i < bContent.length; i++) {
                if (bContent[i] === '}') bracePositions.push(i);
                }
                
                if (bracePositions.length < 5) {
                throw new Error('无法定位有效的JSON结束位置：括号数量不足');
                }
                
                // 截取到倒数第5个大括号（适配常见的截断场景）
                const validEndPos = bracePositions[bracePositions.length - 5] + 1;
                bContent = bContent.substring(0, validEndPos);
                
                // 清理JSON格式（修复截断/格式错误）
                let cleanJson = bContent
                .replace(/u…$/, '')        // 移除末尾的截断字符
                .replace(/'/g, '"')        // 单引号转双引号
                .replace(/,\s*$/, '')      // 移除末尾多余的逗号
                .replace(/\"\"false\"\"/g, '"false"'); // 修复异常的false值
                
                cleanJson = fixUnclosedJson(cleanJson); // 补全未闭合的括号/中括号
                const bObject = JSON.parse(cleanJson);
                const priceInfoList = getNumberedPriceText(bObject); // 解析价格列表

                return {
                success: true,
                data: priceInfoList,
                error: null
                };
            } catch (e) {
                return { 
                success: false, 
                error: `提取失败：${e.message}`,
                data: []
                };
            }
            }

            /**
             * 补全未闭合的JSON括号/中括号（修复截断的JSON）
             * @param {string} jsonStr - 待修复的JSON字符串
             * @returns {string} 修复后的JSON字符串
             */
            function fixUnclosedJson(jsonStr) {
            let openBraces = 0, openBrackets = 0;
            for (let char of jsonStr) {
                if (char === '{') openBraces++;
                else if (char === '}') openBraces--;
                else if (char === '[') openBrackets++;
                else if (char === ']') openBrackets--;
            }
            
            let fixed = jsonStr;
            while (openBraces > 0) { fixed += '}'; openBraces--; }
            while (openBrackets > 0) { fixed += ']'; openBrackets--; }
            return fixed;
            }

            function getNumberedPriceText(bObject) {
            try {
                // 1. 逐层解构核心数据，兼容字段缺失
                const { res = {} } = bObject?.loaderData?.home?.data || {};
                const { skuCore = {}, skuBase = {} } = res;
                const { sku2info = {} } = skuCore;

                // 2. 关键数据校验（严格匹配你的数据结构）
                if (typeof sku2info !== 'object') {
                throw new Error('未找到skuCore.sku2info字段');
                }
                if (!Array.isArray(skuBase.skus)) {
                throw new Error('未找到skuBase.skus数组');
                }
                if (!skuBase.props || !Array.isArray(skuBase.props[0]?.values)) {
                throw new Error('未找到skuBase.props[0].values规格列表');
                }

                // 提取规格值列表（从skuBase.props[0].values）
                const propValues = skuBase.props[0].values;
                const priceInfoList = [];

                // 3. 遍历skuBase.skus数组，匹配每个SKU的信息
                skuBase.skus.forEach((skuItem, index) => {
                const { propPath, skuId } = skuItem || {};
                
                // 跳过无效SKU（空/0）
                if (!skuId || skuId === '0') return;
                if (!propPath) {
                    console.warn(`序号${index+1} - skuId: ${skuId} 缺失propPath`);
                    return;
                }

                // 解析propPath：取冒号后的值（vid）
                const vid = propPath.split(':')[1];
                if (!vid) {
                    console.warn(`skuId: ${skuId} - propPath解析失败，值为：${propPath}`);
                    return;
                }

                // 匹配规格名称（从propValues找对应vid）
                const matchedProp = propValues.find(item => item.vid === vid);
                const propName = matchedProp?.name || `未知规格(vid=${vid})`;

                // 匹配价格（优先取subPrice券后价，兼容原价）
                const skuInfo = sku2info[skuId];
                if (!skuInfo) {
                    console.warn(`skuId: ${skuId} 未在sku2info中找到对应价格`);
                    return;
                }
                // 修复：删除错误的console(originalPrice)，并调整变量定义顺序
                const originalPrice = skuInfo.price?.priceText || '未知原价'; // 优惠前价格
                const couponPrice = skuInfo.subPrice?.priceText || originalPrice; // 券后价（无则用原价）

                // 4. 组装最终数据（包含原价+券后价，更完整）
                priceInfoList.push({
                    序号: index+1,
                    skuId: skuId,
                    规格名称: propName,
                    优惠前价格: originalPrice,
                    券后价格: couponPrice
                });
                });

                return priceInfoList;
            } catch (e) {
                console.error('解析SKU价格信息失败：', e.message);
                return [];
            }
            }

            // ===================== 优化后的CSV下载函数 =====================
            /**
             * 将SKU价格信息列表生成CSV文件并触发下载
             * @param {array} priceInfoList - 包含序号/skuId/规格名称/优惠前价格/券后价格的列表
             * @param {string} [fileNamePrefix='SKU价格信息'] - CSV文件名称前缀
             */
            function downloadFinalResultAsCSV(priceInfoList, fileNamePrefix = 'SKU价格信息') {
            try {
                // 空数据校验（增强提示）
                if (!Array.isArray(priceInfoList) || priceInfoList.length === 0) {
                const warnMsg = '无匹配的SKU价格数据，无法生成CSV文件！';
                console.warn(warnMsg);
                alert(warnMsg);
                return;
                }

                // 1. 构建标准化CSV表头（适配新增字段，中文更友好）
                const headers = ['序号', 'SKU编号', '规格名称', '优惠前价格（元）', '券后价格（元）'];
                
                // 2. 处理数据行（全字段转义，兼容所有特殊字符）
                const rows = priceInfoList.map(item => {
                // 对每个字段进行CSV格式转义（解决逗号、双引号、换行符问题）
                const escapeField = (value) => {
                    if (value === undefined || value === null) return ''; // 空值处理
                    const strValue = String(value);
                    // 包含逗号、双引号、换行符则用双引号包裹，内部双引号转义为两个
                    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n') || strValue.includes('\r')) {
                    return `"${strValue.replace(/"/g, '""')}"`;
                    }
                    return strValue;
                };

                return [
                    escapeField(item.序号),
                    escapeField(item.skuId),
                    escapeField(item.规格名称),
                    escapeField(item.优惠前价格),
                    escapeField(item.券后价格)
                ].join(',');
                });

                // 3. 拼接CSV内容（BOM头+UTF-8，彻底解决中文乱码）
                const csvContent = [headers.join(','), ...rows].join('\r\n'); // 用\r\n兼容Windows/Mac
                const blob = new Blob(['\uFEFF' + csvContent], { 
                type: 'text/csv; charset=utf-8;' 
                });

                // 4. 生成安全的文件名（避免特殊字符导致下载失败）
                const timeStamp = new Date().toISOString().replace(/[:T.]/g, '-').slice(0, 19); // 2026-02-09-15-30-25
                const safeFileName = `${fileNamePrefix}_${timeStamp}.csv`;

                // 5. 创建下载链接（兼容不同浏览器）
                const link = document.createElement('a');
                // 兼容URL.createObjectURL在部分浏览器的兼容性问题
                if (window.URL && URL.createObjectURL) {
                link.href = URL.createObjectURL(blob);
                } else {
                link.href = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvContent);
                }
                link.download = safeFileName;
                link.style.display = 'none';

                // 6. 触发下载（兼容低版本浏览器）
                document.body.appendChild(link);
                // 模拟点击（兼容Firefox）
                const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
                });
                link.dispatchEvent(clickEvent);

                // 7. 清理资源（避免内存泄漏）
                setTimeout(() => {
                document.body.removeChild(link);
                if (window.URL && URL.revokeObjectURL) {
                    URL.revokeObjectURL(link.href);
                }
                }, 1000);

                // 8. 友好提示（带数据量统计）
                const successMsg = `✅ CSV文件生成成功！\n共导出 ${priceInfoList.length} 条SKU价格数据\n文件名：${safeFileName}`;
                console.log(successMsg);
                alert(successMsg);

            } catch (csvError) {
                const errorMsg = `生成CSV文件失败：${csvError.message}`;
                console.error(errorMsg, csvError);
                alert(errorMsg);
            }
            }

            // ===================== 主函数：整合所有逻辑，一键执行 =====================
            /**
             * 主入口函数：提取SKU信息并下载CSV
             * @param {string} [feature='!(function ()'] - 匹配script标签的特征字符串
             * @returns {array} 解析后的SKU价格列表
             */
            function getskutxtxinxi(feature = '!(function ()') {
            try {
                console.log('========== 开始提取SKU价格信息 ==========');
                
                // 1. 提取包含指定特征的script内容
                const rawScriptContent = getScriptContentWithFeature(feature);
                if (!rawScriptContent) {
                throw new Error('未提取到有效的script内容');
                }

                // 2. 解析script内容，提取SKU价格列表
                const parseResult = extractBValueFromTruncatedCode(rawScriptContent);
                if (!parseResult.success) {
                throw new Error(parseResult.error);
                }
                const priceInfoList = parseResult.data;

                // 3. 控制台展示结果
                console.log('\n=== SKU价格信息解析结果 ===');
                console.table(priceInfoList);

                // 4. 生成并下载CSV文件
                downloadFinalResultAsCSV(priceInfoList);

                console.log('========== 提取流程执行完成 ==========');
                return priceInfoList;
            } catch (error) {
                console.error('❌ 主流程执行出错：', error.message);
                alert('提取SKU信息失败：' + error.message);
                return [];
            }
            }
        }
})();
  }
});


