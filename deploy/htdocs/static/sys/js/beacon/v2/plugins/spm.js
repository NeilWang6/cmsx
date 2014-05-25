/**
 * SPMģ��
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

    wh_in_page = S_FALSE,   // ҳ�����Ƿ����޺����
    wh_spm_data = {},       // �޺� SPM ���ݣ�key Ϊ xpath
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
         * ��� href ��ʽ����ʱ���� IE8/9 �� href ����Ч��
         * ��ȡ anchor.href ʱ��ֱ�ӳ���
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
            // ���ҳ���ϴ��� _SPM_a��_SPM_b����ʾҳ�������޺����
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
            // ���ҳ���ϴ��� jQuery��ʹ�� jQuery �ķ���
            jQuery(doc).ready(f);

        } else {

            // �ж�ҳ���Ƿ��Ѿ��������
            if (doc.readyState === "complete") {
                // ���ҳ���Ѿ�������ɣ�ֱ��ִ�к��� f
                f();

            } else {
                // ʹ�� window �� onload �¼�
                on(win, "load", f);
            }
        }
    },

    getElementByXPath = function(xpath, context) {
      if (!context) context = doc;
      if (doc.evaluate) {
        return context.evaluate(xpath, doc, null, 9, null).singleNodeValue;
      }

      // �Զ��巽��
      var arr_paths = xpath.split("/");
      var x1;

      while (!x1 && arr_paths.length > 0) {
        x1 = arr_paths.shift();
      }
      // ȡ��һ����ǩ x1
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

        /** spmData ���ݸ�ʽ���磺
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
    // a ����ָ���� SPM ����λ������ֵ����Щ������ָ����ֵ
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
        // ȥ�����е� href �е� spm ����
        if (href && /&?\bspm=[^&#]*/.test(href)) {
            href = href.replace(/&?\bspm=[^&#]*/g, '')
                .replace(/&{2,}/g, '&')
                .replace(/\?&/, '?')
                .replace(/\?$/, '');
        }

        return href;
    },
    // ������ href �м���� spm ���������ԭ�� href ������ spm���������
    updateHrefWithSPMId = function(href, dataSpm) {

        href = removeAnchorSPM(href);

        if (!dataSpm) return href;

        // �� href �в����µ� spm ����
        var search, hash, a,
            and_char = "&",
            query_split,
            query_count,
            filename,
            file_ext;

        if (href.indexOf("#") != -1) {
            a = href.split("#");
            href = a.shift();
            hash = a.join("#"); // ȡ��һ�� # ��Ĳ���
        }
        query_split = href.split("?");
        query_count = query_split.length - 1;

        // ���洦�����硰http://www.taobao.com��������ĩβ������/��������
        // �������Ӷ�Ӧ��filenameΪ��
        a = query_split[0].split("//");
        a = a[a.length - 1].split("/");
        filename = a.length > 1 ? a.pop() : "";

        if (query_count > 0) {
            /**
             * ���ڴ������� http://ju.atpanel.com/?scm=1005.10.1.703&url=http://www.tmall.com/go/act/tmall/mymx-ym.php?spm=1.1000386.222017.20&ad_id=&am_id=&cm_id=&pm_id=150100827263368085f8
             * ���������ӣ�ע��������������?����
             * ����һ����ת���ӣ����� spm ������Ҫ���ں���һ�� ? ֮��
             * ��������������2012-03-30��������ͳһ�� spm �����ӵ� href �����һ�� ? ֮��
             */
            search = query_split.pop(); // ȡ���һ�� ? ��Ĳ���
            href = query_split.join("?"); // ���һ�� ? ֮ǰ�Ĳ���
        }

        if (search &&
            query_count > 1 && // # ֻ�����������ϵġ�?���� url ִ�������ļ��
            search.indexOf("&") == -1 &&
            search.indexOf("%") != -1) {
            /**
             * ��һЩҳ�棬�� http://login.taobao.com/member/logout.jhtml?f=top&redirectURL=http://login.tmall.com/?spm=1007.100361.0.180%26redirect_url=http%253A%252F%252Ftemai.tmall.com%252F%253Fspm%253D3.1000473.197562.2%2526prt%253D1336367425196%2526prc%253D4
             * spm �������ڵڶ��� ? ֮�󣬵��ǵڶ��� ? ֮��� & ���Ѿ����˹淶��ת�룬��������ӵ� spm ����� & ҲҪ����ת��
             */
            and_char = "%26";
        }

        href = href + "?spm=" + dataSpm
            + (search ? (and_char + search) : "")
            + (hash ? ("#" + hash) : "")
        ;

        /**
         * ����ļ����������
         * ������IE�£��������spm�������ܻ������ļ���׺�����޸ģ�
         *
         * ���磺
         * ԭʼ�������ӣ�
         * http://download.alipay.com/sec/edit/aliedit.exe
         *
         * ����spm����֮��
         * http://download.alipay.com/sec/edit/aliedit.exe?spm=a2107.1.1000341.10�������⣬IE�º�׺�����޸�Ϊ��.10����
         *
         * ����file����֮��
         * http://download.alipay.com/sec/edit/aliedit.exe?spm=a2107.1.1000341.10&file=aliedit.exe��û�����⣩
         *
         * ��ˣ������������ļ����ص��������һ���������
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
                // ��ͼƬ��׺����β�����Ӳ��� spm ����
                return 0;
            }

            if (!search && query_count <= 1) {
                if (!hash && !({
                    "htm": 1,
                    "html": 1,
                    "php": 1
                }).hasOwnProperty(file_ext)) {
                    // ��Ϊ��ǰ�ļ���һ�������ļ�����Ӷ������
                    href += "&file=" + filename;
                }
            }
        }

        return href;
    },
    // ���� spmid �Ĳ���
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
    // д���� currentNode �� href ��ֵ
    spmWriteHref = function(el, href) {
        /**
         * ˵����
         * �� href ǰ���һ���ո�ķ�ʽ������̫�࣬
         * �������ʹ�ü�һ���� <b></b> �ڵ�Ȼ����ɾ���ķ�����
         * ����http://oldj.net/article/ie-bug-at-href-innerHTML/
         *
         * �ο���https://github.com/kissyteam/kissy/blob/master/src/dom/src/attr.js#L215
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
    // ���������Ľڵ�
    dealNoneSPMLink = function(el) {
        var currentNode = el,
            strSpm = [spm_global, 0, 0].join('.');

        anchorAddSpmParam(currentNode, strSpm);
    },

    // ȡ������ spm id (c����)���ڵ�
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

    // ����spm ������Ϣ d�������ҷ���spm
    // d �ɼ��㵱ǰģ������������, �����id��¼��ģ���� data-spm-max-idx
    // ��һ�ε����spm������¼�������� data-spm-anchor-id
    initSPMModule = function(el, spmAreaData) {
        var currentNode = el,
            areaTarget = spmAreaData.spmEl,
            areaSpm = spmAreaData.spmId,
            strSpm = [spm_global, areaSpm].join(".");

        // �ж�a.b.c��ϵ� spm �Ƿ�Ϸ�
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
    // �ϲ�spm����
    setSpmParm = function(el) {
        var currentNode = el,
            spmAnchorId = tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID),
            spmAreaData;

        if (!spmAnchorId) {
            spmAreaData = getParentSPMId(currentNode.parentNode);

            if (!spmAreaData.spmId) {
                // �����spmģ�������
                dealNoneSPMLink(currentNode);

                return;
            }

            // spm ģ���ʼ��
            initSPMModule(currentNode, spmAreaData);

            // ��ʼ������Ԫ�ؾ߱� data-spm-anchor-id ����
            spmAnchorId = tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID);
        }

        anchorAddSpmParam(currentNode, spmAnchorId);
    },
    doTrace = function(e, el) {
      var tn;

      while (el && (tn = el.tagName.toLowerCase())) {

        if (tn === "a" || tn === "area") {
          // �㵽��������
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
