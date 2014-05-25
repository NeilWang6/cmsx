/**
 * @author shanshan.hongss
 * @date 2011.05.25
 * @update 2011.07.19 hongss for inner script
 * @update 2011.11.21 pingchun.yupc for add a parameter of url
 * @update 2011.12.20 hongss for 1. 在内容插入完成后将document.write/document.writeln还原回来
 *                               2. 新增动态接口     3. 新增允许剔除style/script标签配置，data-deletess="style|script|both|none"
 * @update 2011.12.28 hongss for 回调函数扩展为{ success:function(){}, error:function(){} }
 * @update 2012.02.10 hongss for 将打点请求中的page_id字段名改成st_page_id
 * @update 2012.02.15 hongss for 只要求将点击打点改成st_page_id，现将曝光打点改回page_id
 * @update 2012.03.08 chuangui.xie 添加对返回内容包含HTML5标签的支持
 * @update 2012.03.20 hongss for 通过对命名空间的判断，避免执行多次
 * @update 2012.03.21 hongss for 1.修复点击打点st_page_id参数st_问题     2.修复模板中内容直接为a连接打点参数未加上问题
 *
 * @注意：打点信息异常重要，点击打点st_page_id，曝光打点page_id，切记切记！！！！
 * 
 */

if (window.FD && (!FD.sys || !FD.sys.Dcms || !FD.sys.Dcms.Drive)){
    YAHOO.namespace("FD.sys.Dcms.Drive");
    (function(w, drive){
        var objParent = null,
        objAfter = null,
        objBefore = null,
        insertHtml = {
            /*初始化，重置write/writeln方法，只需执行一次*/
            init : function(){
                var self = this;
                self.write = document.write;
                self.writeln = document.writeln;
                document.write = function (str) {
                    self._reWrite(str);
                };
                document.writeln = function (str) {
                    self._reWrite(str+'\n');
                };
            },
            /**
             * 重置document.write 和 document.writeln 方法
             * add by hongss on 2011.12.19
             */
            reset : function(){
                if (this.write){
                    document.write = this.write;
                }
                if (this.writeln){
                    document.writeln = this.writeln;
                }
            },
            /**
              * 解决IE6~8不解析HTML5标签的问题
              * html: 必选，需要处理的html
              * 返回处理后的元素对象
             */
            _innerShiv:function(html){
            
                var div,
                doc = document,
                needsShiv,
                html5 = 'abbr article aside audio canvas datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video'.split(' ');

                if (!div) {
                    div = doc.createElement('div');

                    div.innerHTML = '<nav></nav>';
                    needsShiv = div.childNodes.length !== 1;
                    if (needsShiv) {
                        var shimmedFrag = document.createDocumentFragment();
                        var i = html5.length;
                        while (i--) {
                            shimmedFrag.createElement(html5[i]);
                        }

                        shimmedFrag.appendChild(div);
                    }
                }

                div.innerHTML = html;
                
                return div;
            },
            /**
              * 处理html
              * html: 必选，需要处理的html
              * el: 必选，承载html的容器
              * isReplace: 可选，是否替换容器；true:替换（默认）；false:不替换
              * 返回处理后的元素对象，不包括script元素
             */
            handle: function(html, el, deletess, isReplace){
                if (!(html || el)){ return; }
                var objContent = document.createElement('div'),
                self = this;
                
                if (deletess instanceof Boolean){
                    isReplace = deletess;
                    deletess = 'none';
                }
                isReplace = (typeof isReplace!=='undefined') ? isReplace : true;
                /*
                  <span>用处说明：用于解决IE中第一个元素为<script>时，不执行该script的问题
                */
                objContent.innerHTML = '<span style="display:none">hack ie</span>' + html;

                
                //add by hongss on 2011.12.19 for delect style or script  start
                switch (deletess){
                    case 'style':
                        self._delElementsByTag('style', objContent);
                        break;
                    case 'script':
                        self._delElementsByTag('script', objContent);
                        break;
                    case 'both':
                        self._delElementsByTag('style', objContent);
                        self._delElementsByTag('script', objContent);
                        break;
                }
                //end
                
                var scripts = objContent.getElementsByTagName('script'),
                len = scripts.length,
                arrScript = [];
                
                //记录下scripts的parent,before,after,src,script，并从innerHTML中移除script标签
                for (var i=0, n=0; i<len; i++){
                    if (scripts[n]){
                        var script = scripts[n],
                        objScript = {};
                        objScript['parent'] = script.parentNode;
                        objScript['before'] = $D.getPreviousSibling(script);
                        objScript['after'] = $D.getNextSibling(script);
                        objScript['script'] = script.innerHTML;
                        objScript['src'] = script.src;
                        arrScript.push(objScript);
                        script.parentNode.removeChild(script);
                    } else {
                        n++;
                    }
                }
                
                /*选择合适的方式插入HTML*/
                var objHtml = $D.getChildren(this._innerShiv(objContent.innerHTML));
                if (isReplace){
                    for (var i=0, l=objHtml.length; i<l; i++){
                        $D.insertBefore(objHtml[i], el);
                    }
                    if (el.parentNode){
                        el.parentNode.removeChild(el);
                    }
                } else {
                    el.innerHTML = '';
                    for (var i=0, l=objHtml.length; i<l; i++){
                        el.appendChild(objHtml);
                    }
                }
                
                /*处理JS*/
                this._includeScript(arrScript, 0);
                
                return objHtml;
            },
            /**
             * 重写write
             */
            _reWrite: function(str){
                var div = document.createElement('div');
                div.innerHTML = str;
                var children = div.childNodes,
                len = children.length;
                if (objBefore && objBefore.length!==0){
                    for (var i=0; i<len; i++){
                        var child = children[i];
                        $D.insertAfter(children[i], objBefore);
                        objBefore = child;
                    }
                } else if(objAfter && objAfter.length!==0){
                    for (var i=0; i<len; i++){
                        var child = children[i];
                        $D.insertBefore(children[i], objAfter);
                        objAfter = child;
                    }
                } else if(objParent && objParent.length!==0){
                    objParent.innerHTML = str;
                }
            },
            /**
             * 外部引入的script处理，使其同步加载，递归函数
             * arrScript: 需要处理的script数组
             * i: 数组下标
             */
            _includeScript: function(arrScript, i){
                var len = arrScript.length;
                if (!(arrScript||i) || i>=len){
                    return;
                }
                var script = document.createElement('script'),
                self = this,
                j = i + 1;
                script.type = 'text/javascript';
                
                objParent = arrScript[i].parent;
                objAfter = arrScript[i].after;
                objBefore = arrScript[i].before;
                
                //外联的script
                if (arrScript[i].src){
                    script.src = arrScript[i].src;
                    script.onload = script.onreadystatechange = function(){
                        if (!script.readyState || script.readyState==='loaded' || script.readyState==='complete'){
                            if (j<len){
                                self._includeScript(arrScript, j);
                            }
                            script.onload = script.onreadystatechange = null;
                        }
                    };
                    insertHead(script);
                } else {  //内联的script
                    insertHead(script);
                    script.text = arrScript[i].script;
                    if (j<len){
                        self._includeScript(arrScript, j);
                    }
                }
            },
            /**
             * 从root中删除标签名为tagName的标签集
             */
            _delElementsByTag: function(tagName, root){
                var els = root.getElementsByTagName(tagName);
                for (var i=0, l=els.length; i<l; i++){
                    var el = els[i];
                    if (el){
                        el.parentNode.removeChild(el);
                        i--;
                    }
                }
            }
        },
        
        readyFun = [
            /**
             * JS取数据，及其打点
             */
            function(){
                request($$('.dcms-position-beacon-js'));
            },
            /**
             * ESI的点击打点与曝光打点
             */
            function(){
                var els = $$('.dcms-beacon-position'),
                params = [];
                //曝光打点
                if (els.length>0) {
                    els.forEach(function(el){
                        var param = $D.getAttribute(el, 'data-exposure-id'),
                        l = params.length;
                        
                        if (params[l-1]!==param){
                            params.push(param);
                        }
                    });
                    iexposure(params.join(';'));
                }
                //点击打点
                iclick();
            }
        ];
        
        /**
         * 根据data-url中的数据请求模板，并做相应处理
         * els: 需要通过发送请求替换成模板内容的元素集
         * callback: { success:function(){}, error:function(){} }
                success: 成功时执行的回调函数，this指向请求回来的element(jQuery对象)
                error: 失败时执行的回调函数，this指向当前元素
         */
        function request(els, callback){
            callback = FD.common.applyIf({}, callback);
            $D.batch(els, function(el){
                var url = $D.getAttribute(el, 'data-url'),
                deletess = $D.getAttribute(el, 'data-deletess'),
                param = {},
                configs = {
                    onCallback: function(o){
                        if (o && o.content){
                            insertHtml.init();
                            var objHtml = insertHtml.handle(o.content, el, deletess);
                            insertHtml.reset();
                            //如果有回调函数的话，执行之
                            var success = callback.success;
                            if (success && !!(success instanceof Function)){
                                success.call(objHtml);
                            }
                            //是否进行点击打点和曝光打点
                            if (o.pid&&o.rid&&o.tid){
                                var pid = o.pid,
                                rid = o.rid,
                                tid = o.tid,
                                clickParam = 'pid='+pid+'&rid='+rid+'&tid='+tid,
                                exposureParam = pid+','+rid+','+tid+';';
                                
                                //增加点击打点所需要的数据
                                $D.batch(objHtml, function(el){
                                    if (el.tagName.toUpperCase()==='A'){
                                        el.setAttribute('data-click-param', clickParam);
                                    }
                                    $D.batch($$('a', el), function(a){
                                        a.setAttribute('data-click-param', clickParam);
                                    });
                                    //add by hongss on 2012.05.14
                                    if ($D.hasClass(el, 'dcms-beacon-position')){
                                        el.setAttribute('data-exposure-id', exposureParam);
                                    }
                                });
                                //曝光打点
                                iexposure(exposureParam);
                            }
                        } else {
                            var error = callback.error;
                            if (error && !!(error instanceof Function)){
                                error.call(el);
                            } else {
                                failure(el, '数据加载失败，稍后刷新重试');
                            }
                        }
                    },
                    onFailure: function(o){
                        var error = callback.error;
                        if (error && !!(error instanceof Function)){
                            error.call(el);
                        } else {
                            failure(el, '数据加载失败，稍后刷新重试');
                        }
                    },
                    onTimeout: function(o){
                        var error = callback.error;
                        if (error && !!(error instanceof Function)){
                            error.call(el);
                        } else {
                            failure(el, '数据加载失败，稍后刷新重试');
                        }
                    }
                },
                transaction=FD.common.request('jsonp',url,configs,param);
            });
        }
        drive.request = request;
        
        /**
         * 错误提示
         * el: 必选，承载错误信息的容器
         * html: 必选，需要显示的错误信息(html)
         */
        function failure(el, html){
            if (!(el || html)){ return; }
            var errDiv = document.createElement('div');
            errDiv.innerHTML = html;
            $D.setStyle(errDiv, 'fontSize', '16px');
            $D.setStyle(errDiv, 'fontWeight', 'bolder');
            $D.insertAfter(errDiv, el);
            el.parentNode.removeChild(el);
        }
        /**
         * 点击打点
         * modify by pingchun.yupc on 2011.11.21 for add a parameter of url
         */
        function iclick(){
            var pageId = getPageId();
            $E.delegate(document, 'mousedown', function(e){
                var param = $D.getAttribute(this, 'data-click-param'),
                url = $D.getAttribute(this,'href'),
                idx = url.indexOf('?'),
                idx1 = url.indexOf('#');
                
                url = (idx!==-1) ? url.substring(0,idx) : url;
                url = (idx1!==-1) ? url.substring(0,idx1) : url;
                param +='&url='+url;
                (new Image).src = 'http://stat.1688.com/click_dcms.htm?'+param+'&st_page_id='+pageId;
            }, 'a.dcms-beacon-position-a');
        }
        /**
         * 曝光打点
         * params: 必选，曝光打点所需参数
         */
        function iexposure(params){
            var pageId = getPageId(),
            script = document.createElement('script');
            insertHead(script);
            script.setAttribute('type', 'text/javascript');
            script.src = 'http://ctr.1688.com/ctr_dcms.html?info='+params+'&page_id='+pageId;
        }
        
        /**
         * 将元素插入到 head 中
         * child: 必选，需要插入到head的元素
         */
        function insertHead(child){
            var head = document.getElementsByTagName('head')[0],
            base = $$('base', head);
            //解决IE中<base />标签中的bug
            (base.length>0) ? head.insertBefore(child, base[0]) : head.appendChild(child);
        }
        
        //获取page_id
        function getPageId(){
            var pageId = window.dmtrack_pageid || '';
            getPageId = function(){ return pageId;}
            return pageId;
        }
        
        
        $E.onDOMReady(function(){
             for (var i=0, l=readyFun.length; i<l; i++) {
                 try {
                     readyFun[i]();
                 } catch(e) {
                     if (console && console.info){   
                        console.info('Error at No.' + i + '; ' + e.name + ':' + e.message);
                    }
                 } finally {
                     continue;
                 }
             }
         });
         
    })(window, FD.sys.Dcms.Drive);
}

