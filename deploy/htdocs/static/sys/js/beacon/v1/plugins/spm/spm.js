/**
 * SPM模块
 * @author : arcthur.cheny
 * @createTime : 2012-07-18
 * @lastModifiy : 2012-11-16
 */
(function($ns){
    $ns.moduleManager.register('spm', function(){
        var S_TRUE = true,
        S_FALSE = false,

        S_SPM_ATTR_NAME      = 'data-spm',
        S_DATA_SPM_ANCHOR_ID = 'data-spm-anchor-id',
        S_SPM_DATA_PROTOCOL  = 'data-spm-protocol',
        S_SPM_DATA_HAS_SUB   = 'data-spm-has-sub',
        S_PLAIN_OBJ = "::-plain-::", // 一个特殊的字符串，用于标识无需编码的键值

        G = this.globals,
        C = this.config,
        T = this.tools,
        win = window,
        doc = win.document,
        
        wh_in_page = S_FALSE,   // 页面上是否有无痕埋点
        wh_spm_data = {},       // 无痕 SPM 数据，key 为 xpath
        wh_spm_initialized = S_FALSE,

        spm_protocol = '',
        spm_meta = '',
        spm_stat_url = C.spmServer,

        is_dom_ready = S_FALSE,
        isContain = function (s1, s2) {
            return s1.indexOf(s2) > -1;
        },
        isStartWith = function (s1, s2) {
            return s1.indexOf(s2) == 0;
        },
        
        makeCacheNum = function () {
            return Math.floor(Math.random() * 268435456).toString(16);
        },
        
        obj2param = function (obj) {
            var a = [], k, v;
            for (k in obj)
                if (obj.hasOwnProperty(k)) {
                    v = "" + obj[k];
                    a.push(isStartWith(k, S_PLAIN_OBJ) ? v : (k + "=" + encodeURIComponent(v)));
                }
            return a.join("&");
        },
        
        arr2param = function (arr) {
            var a = [], k, v,
                i, len = arr.length;

            for (i = 0; i < len; i ++) {
                k = arr[i][0];
                v = arr[i][1];
                a.push(isStartWith(k, s_plain_obj) ? v : (k + "=" + encodeURIComponent(v)));
            }
            return a.join("&");
        },

        sendData = function (url, data) {
            var img = new Image(),
                rnd_id = "_img_" + Math.random(),
                link_char = url.indexOf("?") == -1 ? "?" : "&",
                src,
                param_data = data ? (
                    T.isArray(data) ? arr2param(data) : obj2param(data)
                    ) : "";

            // 在全局变量中引用 img，防止 img 被垃圾回收机制过早回收造成请求发送失败
            // 参考：http://hi.baidu.com/meizz/blog/item/a0f4fc0ae9d8be1694ca6b05.html
            win[rnd_id] = img;

            img.onload = img.onerror = function () {
                win[rnd_id] = null;
            };

            img.src = src = param_data ? (url + link_char + param_data) : url;
            img = null; // 删除临时变量的引用

            return src;
        },
        
        getMetaTags = function () {
            return doc.getElementsByTagName('meta');
        },
        
        getSPMFromMeta = function () {
            var metas = getMetaTags(),
                i, l,
                meta,
                meta_name;

            for (i = 0, l = metas.length; i < l; i++) {
                meta = metas[i];
                meta_name = T.tryToGetAttribute(meta, "name");
                if (meta_name == S_SPM_ATTR_NAME) {
                    spm_protocol = T.tryToGetAttribute(meta, S_SPM_DATA_PROTOCOL);
                    spm_meta = T.tryToGetAttribute(meta, 'content');
                }
            }
        },
        
        spm_global = function() {
            var spm_a = '', spm_b = '', spm_ab;
            
            getSPMFromMeta();
            
            if (win._SPM_a && win._SPM_b) {
                // 如果页面上存在 _SPM_a、_SPM_b，表示页面上有无痕埋点
                spm_a = win._SPM_a.replace(/^{(\w+)}$/g, "$1");
                spm_b = win._SPM_b.replace(/^{(\w+)}$/g, "$1");
                
                if (spm_a !== '{}' && spm_b !== '{}') {
                    wh_in_page = S_TRUE;
                }
            }
            
            if (!spm_a || !spm_b || spm_a === '{}' || spm_b === '{}') {
                spm_a = spm_meta;
                spm_b = T.tryToGetAttribute(doc.body, S_SPM_ATTR_NAME) || 0;
            }
            
            spm_ab = spm_a + "." + spm_b;
            
            if (!spm_a || !spm_b || !/^[\w\-\*]+\.[\w\-\*]+$/.test(spm_ab)) {
                spm_ab = 0;
            }
            
            return spm_ab;
        },
        
        getSpmModuleProtocol = function(el) {
            var tmp;
            while ((el = el.parentNode) && el.tagName != 'BODY') {
                tmp = T.tryToGetAttribute(el, S_SPM_DATA_PROTOCOL);
                if (tmp) return tmp;
            }
            return '';
        },
        
        onDOMReady = function (f) {
            if (win.jQuery) {
                // 如果页面上存在 jQuery，使用 jQuery 的方法
                jQuery(doc).ready(f);

            } else {

                // 判断页面是否已经加载完成
                if (doc.readyState === "complete") {
                    // 如果页面已经加载完成，直接执行函数 f
                    f();

                } else {
                    // 使用 window 的 onload 事件
                    T.on(win, "load", f);
                }

            }
        },
        
        wh_init = function () {
            if (wh_spm_initialized) return;

            if (!win["spmData"]) {
                if (!is_dom_ready) {
                    setTimeout(arguments.callee, 100);
                }
                return;
            }
            wh_spm_initialized = S_TRUE;

            /** spmData 数据格式形如：
             *
             * {'data': [
             *         {
             *             "spmc": "1000891",
             *             "spmd": "",
             *             "xpath": "/html[1]/body[1]/table[2]/tbody[1]/tr[1]/td[2]/div[1]/div[3]"
             *         }
             * ]};
             */

            var data = win["spmData"]["data"],
                i, l,
                idata,
                xpath;

            if (!data || !T.isArray(data)) return;

            for (i = 0, l = data.length; i < l; i++) {
                idata = data[i];
                xpath = idata.xpath;
                wh_spm_data[xpath] = {
                    spmc: idata.spmc,
                    spmd: idata.spmd
                };
            }
        },
        
        wh_getXPath = function (el) {
            var all_nodes = doc.getElementsByTagName("*"),
                segs, i, sib, unique_id_count,
                node, el_id;

            for (segs = []; el && el.nodeType == 1; el = el.parentNode) {
                if (el.id) {
                    el_id = el.id;
                    unique_id_count = 0;
                    for (i = 0; i < all_nodes.length; i++) {
                        node = all_nodes[i];
                        if (node.id && node.id == el_id) {
                            unique_id_count++;
                            break;
                        }
                    }
                    if (unique_id_count == 1) {
                        segs.unshift("id(\"" + el_id + "\")");
                        return segs.join("/");
                    } else {
                        segs.unshift(el.tagName.toLowerCase() + "[@id=\"" + el_id + "\"]");
                    }

                } else {
                    for (i = 1, sib = el.previousSibling; sib; sib = sib.previousSibling) {
                        if (sib.tagName == el.tagName)  i++;
                    }
                    segs.unshift(el.tagName.toLowerCase() + "[" + i + "]");
                }

            }

            return segs.length ? "/" + segs.join("/") : null;
        },
        
        wh_isModule = function (el) {
            var data = wh_spm_data[wh_getXPath(el)];

            return data ? data.spmc : "";
        },
        
        isAlipayUrl = function(url) {
            return url ?
                (!!url.match(/^[^\?]*\balipay\.(?:com|net)\b/i))
                : false;
        },
        // a 链接指定了 SPM 第四位参数的值，这些链接用指定的值
        getAnchor4thId = function (el) {
            var spm_d, xpath, data;

            if (wh_in_page) {
                xpath = wh_getXPath(el);
                data = wh_spm_data[xpath];
                if (data) {
                    spm_d = data["spmd"];
                }
            } else {
                spm_d = T.tryToGetAttribute(el, S_SPM_ATTR_NAME);
                if (!spm_d || !spm_d.match(/^d\w+$/)) {
                    spm_d = "";
                }
            }

            return spm_d;
        },
        // 取得一个 A 元素在 DOM 全局中的出现位置
        getAnchorGlobalPosizion = function(el) {
            var anchors = doc.getElementsByTagName('a'),
                l = anchors.length, i;

            for (i = 0; i < l; i ++) {
                if (anchors[i] === el) { 
                    return i + 1;
                }
            }

            return 0;
        },
        // 给定的 href 中间插入 spm 参数，如果原来 href 中已有 spm，则将其更新
        updateHrefWithSPMId = function (href, dataSpm) {

            // 去掉现有的 href 中的 spm 参数
            if (href && /&?\bspm=[^&#]*/.test(href)) {
                href = href.replace(/&?\bspm=[^&#]*/g, '')
                    .replace(/&{2,}/g, '&')
                    .replace(/\?&/, '?')
                    .replace(/\?$/, '');
            }

            if (!dataSpm) return href;

            // 在 href 中插入新的 spm 参数
            var search, hash, a,
                and_char = "&",
                query_split,
                query_count,
                filename,
                file_ext;
            
            if (href.indexOf("#") != -1) {
                a = href.split("#");
                href = a.shift();
                hash = a.join("#"); // 取第一个 # 后的部分
            }
            query_split = href.split("?");
            query_count = query_split.length - 1;

            // 下面处理形如“http://www.taobao.com”这样的末尾不带“/”的链接
            // 这种链接对应的filename为空
            a = query_split[0].split("//");
            a = a[a.length - 1].split("/");
            filename = a.length > 1 ? a.pop() : "";

            if (query_count > 0) {
                /**
                 * 由于存在类似 http://ju.atpanel.com/?scm=1005.10.1.703&url=http://www.tmall.com/go/act/tmall/mymx-ym.php?spm=1.1000386.222017.20&ad_id=&am_id=&cm_id=&pm_id=150100827263368085f8
                 * 这样的链接，注意其中有两个“?”，
                 * 这是一种跳转链接，其中 spm 参数需要加在后面一个 ? 之后，
                 * 经与梵易商量（2012-03-30），决定统一将 spm 参数加到 href 的最后一个 ? 之后
                 */
                search = query_split.pop(); // 取最后一个 ? 后的部分
                href = query_split.join("?"); // 最后一个 ? 之前的部分
            }

            if (search &&
                query_count > 1 && // # 只对两个及以上的“?”的 url 执行这样的检测
                search.indexOf("&") == -1 &&
                search.indexOf("%") != -1) {
                /**
                 * 有一些页面，如 http://login.taobao.com/member/logout.jhtml?f=top&redirectURL=http://login.tmall.com/?spm=1007.100361.0.180%26redirect_url=http%253A%252F%252Ftemai.tmall.com%252F%253Fspm%253D3.1000473.197562.2%2526prt%253D1336367425196%2526prc%253D4
                 * spm 参数加在第二个 ? 之后，但是第二个 ? 之后的 & 都已经做了规范的转码，所以新添加的 spm 后面的 & 也要进行转码
                 */
                and_char = "%26";
            }

            href = href + "?spm=" + dataSpm
                + (search ? (and_char + search) : "")
                + (hash ? ("#" + hash) : "")
            ;

            /**
             * 添加文件名额外参数
             * 由于在IE下，如果加了spm参数可能会引起文件后缀名被修改，
             *
             * 比如：
             * 原始下载链接：
             * http://download.alipay.com/sec/edit/aliedit.exe
             *
             * 加了spm参数之后：
             * http://download.alipay.com/sec/edit/aliedit.exe?spm=a2107.1.1000341.10（有问题，IE下后缀名被修改为“.10”）
             *
             * 加了file参数之后：
             * http://download.alipay.com/sec/edit/aliedit.exe?spm=a2107.1.1000341.10&file=aliedit.exe（没有问题）
             *
             * 因此，这儿会对形如文件下载的链接添加一个额外参数
             */
            file_ext = isContain(filename, ".") ? filename.split(".").pop().toLowerCase() : "";
            if (file_ext) {
                if (({
                    "png": 1,
                    "jpg": 1,
                    "jpeg": 1,
                    "gif": 1,
                    "bmp": 1,
                    "swf": 1
                }).hasOwnProperty(file_ext)) {
                    // 以图片后缀名结尾的链接不加 spm 参数
                    return 0;
                }

                if (!search && query_count <= 1) {
                    if (!hash && !({
                        "htm": 1,
                        "html": 1,
                        "php": 1
                    }).hasOwnProperty(file_ext)) {
                        // 认为当前文件是一个下载文件，添加额外参数
                        href += "&file=" + filename;
                    }
                }
            }

            return href;
        },
        // 加上 spmid 的参数
        anchorAddSpmParam = function (el, dataSpm) {
            var currentNode = el,
            href = T.tryToGetHref(currentNode),

            is_i_protocol = (
			T.tryToGetAttribute(currentNode, S_SPM_DATA_PROTOCOL)
				|| getSpmModuleProtocol(currentNode)
				|| spm_protocol
			) == 'i',

            i_protocol_beacon_url = spm_stat_url + '?spm=';

            if (!href || !dataSpm) return;
            if (href.indexOf('#') === 0 
                || href.toLowerCase().indexOf('javascript:') === 0
                || isAlipayUrl(href)) return;
            
            if (is_i_protocol) {
                i_protocol_beacon_url += dataSpm 
                                      + '&st_page_id=' + G.pageId
                                      + '&url=' + encodeURIComponent(href)
                                      + '&cache=' + makeCacheNum();
                
                sendData(i_protocol_beacon_url);
            } else {
                (href = updateHrefWithSPMId(href, dataSpm)) && spmWriteHref(currentNode, href);
            }
        },
        // 写链接 currentNode 的 href 的值
        spmWriteHref = function (el, href) {
            /**
             * 说明：
             * 在 href 前面加一个空格的方式副作用太多，
             * 这儿尝试使用加一个空 <b></b> 节点然后再删除的方法。
             * 见：http://oldj.net/article/ie-bug-at-href-innerHTML/
             *
             * 参考：https://github.com/kissyteam/kissy/blob/master/src/dom/src/attr.js#L215
             */
            var currentNode = el, b,
                inner_html = currentNode.innerHTML;

            if (inner_html && inner_html.indexOf('<') == -1) {
                b = doc.createElement('b');
                b.style.display = 'none';
                currentNode.appendChild(b);
            }
            currentNode.href = href;

            if (b) {
                currentNode.removeChild(b);
            }
        },
        getSPMIdFromHref = function(href) {
            var m;
            return (href && (m = href.match(/&?\bspm=([^&#]*)/))) ? m[1] : '';
        },
        // 处理非区块的节点
        dealNoneSPMLink = function(el) {
            var currentNode = el,
                lastSpmId = getAnchor4thId(currentNode) || getAnchorGlobalPosizion(currentNode),
                strSpm = [spm_global(), 0, lastSpmId].join('.');

            anchorAddSpmParam(currentNode, strSpm);
        },

        // 取得区块 spm id (c参数)及节点
        getParentSPMId = function (el) {
            var dataSpm,
                tagName = el.tagName.toLowerCase(),
                spmAreaInfo = {};

            while (el &&
                tagName !== 'html' && 
                tagName !== 'body') {

                if (!wh_in_page) {
                    dataSpm = T.tryToGetAttribute(el, S_SPM_ATTR_NAME);
                } else {
                    // 在无痕列表中查找当前模块的数据
                    dataSpm = wh_isModule(el);
                }

                if (dataSpm) {
                    spmAreaInfo = {
                        spmEl: el,
                        spmId: dataSpm
                    };
                    break;
                }

                if (!(el = el.parentNode)) break;
                tagName = el.tagName.toLowerCase();
            }

            return spmAreaInfo;
        },
        
        // 计算spm 链接信息 d参数，且返回spm
        // d 由计算当前模块链接数决定, 将最大id记录在模块上 data-spm-max-idx
        // 第一次点击后将spm参数记录在链接上 data-spm-anchor-id
        initSPMModule = function(el, spmAreaData) {
            var currentNode = el,
                areaTarget = spmAreaData.spmEl,
                areaSpm = spmAreaData.spmId,
                strSpm = [spm_global(), areaSpm].join(".");

            // 判断a.b.c组合的 spm 是否合法
            if (!strSpm.match || !strSpm.match(/^[\w\-\*]+\.[\w\-\*]+\.[\w\-\*]+$/)) return;

            var el_a = T.nodeListToArray(areaTarget.getElementsByTagName("a")),
                el_area = T.nodeListToArray(areaTarget.getElementsByTagName("area")),
                anchors = el_a.concat(el_area),
                anchor, href, anchorId, anchorIdx = 0;

            for (var i = 0, anchorsLen = anchors.length; i < anchorsLen; i++) {
                anchor = anchors[i];
                href = T.tryToGetHref(anchor);
                if (!href) continue;
                
                anchorIdx++;
                if (anchor === currentNode) {
                    anchorId = strSpm + '.' + (getAnchor4thId(anchor) || anchorIdx);
                    T.tryToSetAttribute(anchor, S_DATA_SPM_ANCHOR_ID, anchorId);
                    break;
                }
            }
        },
        // 合并spm参数
        setSpmParm = function(el) {
            var currentNode = el,
                spmAnchorId = T.tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID),
                spmAreaData;

            if (!spmAnchorId) {
                spmAreaData = getParentSPMId(currentNode.parentNode);

                if (!spmAreaData.spmId) {
                    // 处理非spm模块的链接
                    dealNoneSPMLink(currentNode);

                    return;
                }
                
                // spm 模块初始化
                initSPMModule(currentNode, spmAreaData);
                
                // 初始化链接元素具备 data-spm-anchor-id 属性
                spmAnchorId = T.tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID);
            }

            anchorAddSpmParam(currentNode, spmAnchorId);
        },
        init = function() {
            onDOMReady(function () {
                is_dom_ready = S_TRUE;
                
                if (!spm_global()) return;
                wh_init();

                T.on(doc.body, 'mousedown', function(e, el) {
                    var tn;
                    
                    while (el && (tn = el.tagName.toLowerCase())) {
                        
                        if (tn === "a" || tn === "area") {
                            // 点到了链接上
                            setSpmParm(el);
                            break;
                        } else if (tn === "body" || tn === "html") {
                            break;
                        }

                        el = el.parentNode;
                    }
                });
            });
        };
        return {
            init: init
        };
    });
}(MAGNETO));