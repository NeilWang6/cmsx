/**
 * SPM模块
 * @author : arcthur.cheny
 * @createTime : 2012-07-18
 * @lastModifiy : 2013-07-03
 */
var SPM = Manifold.SPM = (function(){
    var S_TRUE = true,
    S_FALSE = false,

    IS_USE_DEFAULT_AB    = false,
    S_SPM_ATTR_NAME      = 'data-spm',
    S_DATA_SPM_ANCHOR_ID = 'data-spm-anchor-id',
    S_SPM_DATA_PROTOCOL  = 'data-spm-protocol',

    wh_in_page = S_FALSE,   // 页面上是否有无痕埋点
    wh_spm_data = {},       // 无痕 SPM 数据，key 为 xpath
    wh_spm_initialized = S_FALSE,

    spm_meta = '',
    spm_protocol = '',
    spm_stat_url = Config.spmServer,

    atta = !!doc.attachEvent,
    attachEvent = "attachEvent",
    addEventListener = "addEventListener",
    onevent = atta ? attachEvent : addEventListener,

    is_dom_ready = S_FALSE,
    isContain = function(s1, s2) {
        return s1.indexOf(s2) > -1;
    },

    tryToGetHref = function(anchor) {
        /**
         * 如果 href 格式有误时，在 IE8/9 下 href 将无效，
         * 读取 anchor.href 时会直接出错。
         */

        var href;
        try {
            href = Tools.trim(anchor.getAttribute("href", 2));
        } catch (e) {}

        return href || "";
    },

    tryToGetAttribute = function(element, attr_name) {
        return element && element.getAttribute ? (element.getAttribute(attr_name) || "") : "";
    },

    tryToSetAttribute = function(element, attr_name, attr_value) {
        if (element && element.setAttribute) {
            try {
                element.setAttribute(attr_name, attr_value);
            } catch (e) {}
        }
    },

    nodeListToArray = function(nodes) {
        var arr, length;

        try {
            // works in every browser except IE
            arr = [].slice.call(nodes);
            return arr;
        } catch(err) {
            // slower, but works in IE
            arr = [];
            length = nodes.length;

            for (var i = 0; i < length; i++) {
                arr.push(nodes[i]);
            }

            return arr;
        }
    },

    on = function(obj, eventType, f) {
        obj[onevent](
            (atta ? "on" : "") + eventType,
            function (e) {
                e = e || win.event;
                var el = e.target || e.srcElement;

                f(e, el);
            },
            S_FALSE
        );
    },

    getMetaTags = function() {
        return doc.getElementsByTagName('meta');
    },

    getSPMFromMeta = function() {
        var metas = getMetaTags(),
            i, l,
            meta,
            meta_name;

        for (i = 0, l = metas.length; i < l; i++) {
            meta = metas[i];
            meta_name = tryToGetAttribute(meta, "name");
            if (meta_name === S_SPM_ATTR_NAME) {
                spm_protocol = tryToGetAttribute(meta, S_SPM_DATA_PROTOCOL);
                spm_meta = tryToGetAttribute(meta, 'content');
            }
        }
    },

    spm_global = (function() {
        var spm_a = '', spm_b = '', spm_ab;

        getSPMFromMeta();

        if (win._SPM_a && win._SPM_b) {
            // 如果页面上存在 _SPM_a、_SPM_b，表示页面上有无痕埋点
            spm_a = win._SPM_a.replace(/^{(\w+)}$/g, "$1");
            spm_b = win._SPM_b.replace(/^{(\w+)}$/g, "$1");

            if (spm_a !== '{}' && spm_a !== '{-}' && spm_b !== '{}' && spm_b !== '{-}') {
                wh_in_page = 'true';
            }
        }

        if (!spm_a || !spm_b ||
             spm_a === '{}' || spm_b === '{}' ||
             spm_a === '{-}' || spm_b === '{-}') {
            spm_a = spm_meta;
            spm_b = tryToGetAttribute(doc.body, 'data-spm') || 0;
        }

        spm_ab = spm_a + "." + spm_b;

        if (!spm_a || !spm_b || !/^[\w\-\*]+\.[\w\-\*]+$/.test(spm_ab)) {
            IS_USE_DEFAULT_AB = true;
            spm_ab = 0;
        }

        return spm_ab;
    }()),

    getSpmModuleProtocol = function(el) {
        var tmp;
        while ((el = el.parentNode) && el.tagName != 'BODY') {
            tmp = tryToGetAttribute(el, S_SPM_DATA_PROTOCOL);
            if (tmp) return tmp;
        }
        return '';
    },

    onDOMReady = function(f) {
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
                on(win, "load", f);
            }
        }
    },

    getElementByXPath = function(xpath, context) {
      if (!context) context = doc;
      if (doc.evaluate) {
        return context.evaluate(xpath, doc, null, 9, null).singleNodeValue;
      }

      // 自定义方法
      var arr_paths = xpath.split("/");
      var x1;

      while (!x1 && arr_paths.length > 0) {
        x1 = arr_paths.shift();
      }
      // 取得一个标签 x1
      var re_1 = /^.+?\[@id="(.+?)"]$/i;
      var re_3 = /^(.+?)\[(\d+)]$/i;
      var match;

      if (match = x1.match(re_1)) {
        // tag[@id="xxx"]
        context = context.getElementById(match[1]);

      } else if (match = x1.match(re_3)) {
        // tag[1]
        context = context.getElementsByTagName(match[1])[parseInt(match[2])];
      }

      if (!context) return null;
      if (arr_paths.length == 0) return context;

      return getElementByXPath(arr_paths.join("/"), context);
    },

    wh_updateXPathElements = function() {
      var xpath;
      var founds = {};
      var el;
      var spm_data;
      for (xpath in wh_spm_data) {
        if (wh_spm_data.hasOwnProperty(xpath)) {
          el = getElementByXPath(xpath);
          if (el) {
            founds[xpath] = 1;
            spm_data = wh_spm_data[xpath];
            tryToSetAttribute(el, S_SPM_ATTR_NAME, (
              el.tagName == "A" ? spm_data["spmd"] : spm_data["spmc"]
            ) || "");
          }
        }
      }

      for (xpath in founds) {
        if (founds.hasOwnProperty(xpath)) {
          delete wh_spm_data[xpath];
        }
      }
    };

    wh_init = function() {
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

        if (!data || !Tools.isArray(data)) return;

        for (i = 0, l = data.length; i < l; i++) {
            idata = data[i];
            xpath = idata.xpath;
            xpath = xpath.replace(/^id\("(.+?)"\)(.*)/g, "//*[@id=\"$1\"]$2");
            wh_spm_data[xpath] = {
                spmc: idata.spmc,
                spmd: idata.spmd
            };
        }

        wh_updateXPathElements();
    },

    isAlipayUrl = function(url) {
        return url ?
            (!!url.match(/^[^\?]*\balipay\.(?:com|net)\b/i))
            : false;
    },
    // a 链接指定了 SPM 第四位参数的值，这些链接用指定的值
    getAnchor4thId = function(el) {
      var spm_d;

      if (IS_USE_DEFAULT_AB) {
        spm_d = '0';
      } else {
        spm_d = tryToGetAttribute(el, S_SPM_ATTR_NAME);
        if (!spm_d || !spm_d.match(/^d\w+$/)) {
          spm_d = "";
        }
      }

      return spm_d;
    },
    removeAnchorSPM = function(href) {
        // 去掉现有的 href 中的 spm 参数
        if (href && /&?\bspm=[^&#]*/.test(href)) {
            href = href.replace(/&?\bspm=[^&#]*/g, '')
                .replace(/&{2,}/g, '&')
                .replace(/\?&/, '?')
                .replace(/\?$/, '');
        }

        return href;
    },
    // 给定的 href 中间插入 spm 参数，如果原来 href 中已有 spm，则将其更新
    updateHrefWithSPMId = function(href, dataSpm) {

        href = removeAnchorSPM(href);

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
    anchorAddSpmParam = function(el, dataSpm) {
        var currentNode = el,
        href = tryToGetHref(currentNode),

        is_i_protocol = (
        tryToGetAttribute(currentNode, S_SPM_DATA_PROTOCOL)
            || getSpmModuleProtocol(currentNode)
            || spm_protocol
        ) == 'i',

        i_protocol_beacon_url = spm_stat_url + '?spm=';

        if (!href || !dataSpm) return;
        if (href.indexOf('#') === 0
            || href.toLowerCase().indexOf('javascript:') === 0
            || isAlipayUrl(href)) return;

        if (is_i_protocol) {
            href = removeAnchorSPM(href);

            i_protocol_beacon_url += dataSpm
                                  + '&st_page_id=' + Globals.pageId
                                  + '&url=' + encodeURIComponent(href)
                                  + '&cache=' + Tools.random();

            Recorder.send(i_protocol_beacon_url, '');
        } else {
            (href = updateHrefWithSPMId(href, dataSpm)) && spmWriteHref(currentNode, href);
        }
    },
    // 写链接 currentNode 的 href 的值
    spmWriteHref = function(el, href) {
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
    // 处理非区块的节点
    dealNoneSPMLink = function(el) {
        var currentNode = el,
            strSpm = [spm_global, 0, 0].join('.');

        anchorAddSpmParam(currentNode, strSpm);
    },

    // 取得区块 spm id (c参数)及节点
    getParentSPMId = function(el) {
        var dataSpm,
            tagName = el.tagName.toLowerCase(),
            spmAreaInfo = {};

        while (el &&
            tagName !== 'html' &&
            tagName !== 'body') {

            if (wh_in_page) {
              wh_updateXPathElements();
            }

            dataSpm = tryToGetAttribute(el, S_SPM_ATTR_NAME);

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
            strSpm = [spm_global, areaSpm].join(".");

        // 判断a.b.c组合的 spm 是否合法
        if (!strSpm.match || !strSpm.match(/^[\w\-\*]+\.[\w\-\*]+\.[\w\-\*]+$/)) return;

        var el_a = nodeListToArray(areaTarget.getElementsByTagName("a")),
            el_area = nodeListToArray(areaTarget.getElementsByTagName("area")),
            anchors = el_a.concat(el_area),
            anchor, href, anchorId, anchorIdx = 0;

        for (var i = 0, anchorsLen = anchors.length; i < anchorsLen; i++) {
            anchor = anchors[i];
            href = tryToGetHref(anchor);
            if (!href) continue;

            anchorIdx++;
            if (anchor === currentNode) {
                anchorId = strSpm + '.' + (getAnchor4thId(anchor) || anchorIdx);
                tryToSetAttribute(anchor, S_DATA_SPM_ANCHOR_ID, anchorId);
                break;
            }
        }
    },
    // 合并spm参数
    setSpmParm = function(el) {
        var currentNode = el,
            spmAnchorId = tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID),
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
            spmAnchorId = tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID);
        }

        anchorAddSpmParam(currentNode, spmAnchorId);
    },
    doTrace = function(e, el) {
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
    },
    init = function() {
      onDOMReady(function () {
        is_dom_ready = S_TRUE;

        if (!spm_global) return;

        wh_init();

        on(doc.body, 'mousedown', doTrace);
        on(doc.body, 'keydown', doTrace);
      });
    };
    return {
        cnt: spm_global,
        init: init
    };
}());
