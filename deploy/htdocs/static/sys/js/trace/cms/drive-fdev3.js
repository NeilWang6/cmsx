/**
 * @author shanshan.hongss
 * @date 2011.05.25
 * @update 2011.07.19 hongss for inner script
 * @update 2011.11.21 pingchun.yupc for add a parameter of url
 * @update 2011.12.20 hongss for 1. �����ݲ�����ɺ�document.write/document.writeln��ԭ����
 *                               2. ������̬�ӿ�     3. ���������޳�style/script��ǩ���ã�data-deletess="style|script|both|none"
 * @update 2011.12.28 hongss for �ص�������չΪ{ success:function(){}, error:function(){} }
 * @update 2012.02.10 hongss for ����������е�page_id�ֶ����ĳ�st_page_id
 * @update 2012.02.15 hongss for ֻҪ�󽫵�����ĳ�st_page_id���ֽ��ع���Ļ�page_id
 * @update 2012.03.08 chuangui.xie ��ӶԷ������ݰ���HTML5��ǩ��֧��
 * @update 2012.03.20 hongss for ͨ���������ռ���жϣ�����ִ�ж��
 * @update 2012.03.21 hongss for 1.�޸�������st_page_id����st_����     2.�޸�ģ��������ֱ��Ϊa���Ӵ�����δ��������
 *
 * @ע�⣺�����Ϣ�쳣��Ҫ��������st_page_id���ع���page_id���м��мǣ�������
 * 
 */

if (window.FD && (!FD.sys || !FD.sys.Dcms || !FD.sys.Dcms.Drive)){
    YAHOO.namespace("FD.sys.Dcms.Drive");
    (function(w, drive){
        var objParent = null,
        objAfter = null,
        objBefore = null,
        insertHtml = {
            /*��ʼ��������write/writeln������ֻ��ִ��һ��*/
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
             * ����document.write �� document.writeln ����
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
              * ���IE6~8������HTML5��ǩ������
              * html: ��ѡ����Ҫ�����html
              * ���ش�����Ԫ�ض���
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
              * ����html
              * html: ��ѡ����Ҫ�����html
              * el: ��ѡ������html������
              * isReplace: ��ѡ���Ƿ��滻������true:�滻��Ĭ�ϣ���false:���滻
              * ���ش�����Ԫ�ض��󣬲�����scriptԪ��
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
                  <span>�ô�˵�������ڽ��IE�е�һ��Ԫ��Ϊ<script>ʱ����ִ�и�script������
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
                
                //��¼��scripts��parent,before,after,src,script������innerHTML���Ƴ�script��ǩ
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
                
                /*ѡ����ʵķ�ʽ����HTML*/
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
                
                /*����JS*/
                this._includeScript(arrScript, 0);
                
                return objHtml;
            },
            /**
             * ��дwrite
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
             * �ⲿ�����script����ʹ��ͬ�����أ��ݹ麯��
             * arrScript: ��Ҫ�����script����
             * i: �����±�
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
                
                //������script
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
                } else {  //������script
                    insertHead(script);
                    script.text = arrScript[i].script;
                    if (j<len){
                        self._includeScript(arrScript, j);
                    }
                }
            },
            /**
             * ��root��ɾ����ǩ��ΪtagName�ı�ǩ��
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
             * JSȡ���ݣ�������
             */
            function(){
                request($$('.dcms-position-beacon-js'));
            },
            /**
             * ESI�ĵ��������ع���
             */
            function(){
                var els = $$('.dcms-beacon-position'),
                params = [];
                //�ع���
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
                //������
                iclick();
            }
        ];
        
        /**
         * ����data-url�е���������ģ�壬������Ӧ����
         * els: ��Ҫͨ�����������滻��ģ�����ݵ�Ԫ�ؼ�
         * callback: { success:function(){}, error:function(){} }
                success: �ɹ�ʱִ�еĻص�������thisָ�����������element(jQuery����)
                error: ʧ��ʱִ�еĻص�������thisָ��ǰԪ��
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
                            //����лص������Ļ���ִ��֮
                            var success = callback.success;
                            if (success && !!(success instanceof Function)){
                                success.call(objHtml);
                            }
                            //�Ƿ���е�������ع���
                            if (o.pid&&o.rid&&o.tid){
                                var pid = o.pid,
                                rid = o.rid,
                                tid = o.tid,
                                clickParam = 'pid='+pid+'&rid='+rid+'&tid='+tid,
                                exposureParam = pid+','+rid+','+tid+';';
                                
                                //���ӵ���������Ҫ������
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
                                //�ع���
                                iexposure(exposureParam);
                            }
                        } else {
                            var error = callback.error;
                            if (error && !!(error instanceof Function)){
                                error.call(el);
                            } else {
                                failure(el, '���ݼ���ʧ�ܣ��Ժ�ˢ������');
                            }
                        }
                    },
                    onFailure: function(o){
                        var error = callback.error;
                        if (error && !!(error instanceof Function)){
                            error.call(el);
                        } else {
                            failure(el, '���ݼ���ʧ�ܣ��Ժ�ˢ������');
                        }
                    },
                    onTimeout: function(o){
                        var error = callback.error;
                        if (error && !!(error instanceof Function)){
                            error.call(el);
                        } else {
                            failure(el, '���ݼ���ʧ�ܣ��Ժ�ˢ������');
                        }
                    }
                },
                transaction=FD.common.request('jsonp',url,configs,param);
            });
        }
        drive.request = request;
        
        /**
         * ������ʾ
         * el: ��ѡ�����ش�����Ϣ������
         * html: ��ѡ����Ҫ��ʾ�Ĵ�����Ϣ(html)
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
         * ������
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
         * �ع���
         * params: ��ѡ���ع����������
         */
        function iexposure(params){
            var pageId = getPageId(),
            script = document.createElement('script');
            insertHead(script);
            script.setAttribute('type', 'text/javascript');
            script.src = 'http://ctr.1688.com/ctr_dcms.html?info='+params+'&page_id='+pageId;
        }
        
        /**
         * ��Ԫ�ز��뵽 head ��
         * child: ��ѡ����Ҫ���뵽head��Ԫ��
         */
        function insertHead(child){
            var head = document.getElementsByTagName('head')[0],
            base = $$('base', head);
            //���IE��<base />��ǩ�е�bug
            (base.length>0) ? head.insertBefore(child, base[0]) : head.appendChild(child);
        }
        
        //��ȡpage_id
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

