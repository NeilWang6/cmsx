/**
 * SPMģ��
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
        S_PLAIN_OBJ = "::-plain-::", // һ��������ַ��������ڱ�ʶ�������ļ�ֵ

        G = this.globals,
        C = this.config,
        T = this.tools,
        win = window,
        doc = win.document,
        
        wh_in_page = S_FALSE,   // ҳ�����Ƿ����޺����
        wh_spm_data = {},       // �޺� SPM ���ݣ�key Ϊ xpath
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

            // ��ȫ�ֱ��������� img����ֹ img ���������ջ��ƹ���������������ʧ��
            // �ο���http://hi.baidu.com/meizz/blog/item/a0f4fc0ae9d8be1694ca6b05.html
            win[rnd_id] = img;

            img.onload = img.onerror = function () {
                win[rnd_id] = null;
            };

            img.src = src = param_data ? (url + link_char + param_data) : url;
            img = null; // ɾ����ʱ����������

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
                // ���ҳ���ϴ��� _SPM_a��_SPM_b����ʾҳ�������޺����
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
                // ���ҳ���ϴ��� jQuery��ʹ�� jQuery �ķ���
                jQuery(doc).ready(f);

            } else {

                // �ж�ҳ���Ƿ��Ѿ��������
                if (doc.readyState === "complete") {
                    // ���ҳ���Ѿ�������ɣ�ֱ��ִ�к��� f
                    f();

                } else {
                    // ʹ�� window �� onload �¼�
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
        // a ����ָ���� SPM ����λ������ֵ����Щ������ָ����ֵ
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
        // ȡ��һ�� A Ԫ���� DOM ȫ���еĳ���λ��
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
        // ������ href �м���� spm ���������ԭ�� href ������ spm���������
        updateHrefWithSPMId = function (href, dataSpm) {

            // ȥ�����е� href �е� spm ����
            if (href && /&?\bspm=[^&#]*/.test(href)) {
                href = href.replace(/&?\bspm=[^&#]*/g, '')
                    .replace(/&{2,}/g, '&')
                    .replace(/\?&/, '?')
                    .replace(/\?$/, '');
            }

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
        // д���� currentNode �� href ��ֵ
        spmWriteHref = function (el, href) {
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
        getSPMIdFromHref = function(href) {
            var m;
            return (href && (m = href.match(/&?\bspm=([^&#]*)/))) ? m[1] : '';
        },
        // ���������Ľڵ�
        dealNoneSPMLink = function(el) {
            var currentNode = el,
                lastSpmId = getAnchor4thId(currentNode) || getAnchorGlobalPosizion(currentNode),
                strSpm = [spm_global(), 0, lastSpmId].join('.');

            anchorAddSpmParam(currentNode, strSpm);
        },

        // ȡ������ spm id (c����)���ڵ�
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
                    // ���޺��б��в��ҵ�ǰģ�������
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
        
        // ����spm ������Ϣ d�������ҷ���spm
        // d �ɼ��㵱ǰģ������������, �����id��¼��ģ���� data-spm-max-idx
        // ��һ�ε����spm������¼�������� data-spm-anchor-id
        initSPMModule = function(el, spmAreaData) {
            var currentNode = el,
                areaTarget = spmAreaData.spmEl,
                areaSpm = spmAreaData.spmId,
                strSpm = [spm_global(), areaSpm].join(".");

            // �ж�a.b.c��ϵ� spm �Ƿ�Ϸ�
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
        // �ϲ�spm����
        setSpmParm = function(el) {
            var currentNode = el,
                spmAnchorId = T.tryToGetAttribute(currentNode, S_DATA_SPM_ANCHOR_ID),
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
                            // �㵽��������
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