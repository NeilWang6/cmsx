/**
 * @author shanshan.hongss
 * @date 2011.04.22
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

if (window.FE && (!FE.sys || !FE.sys.Dcms || !FE.sys.Dcms.Drive)){
    jQuery.namespace('FE.sys.Dcms.Drive');
    ;(function($, drive){
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
             * add by hongss on 2011.12.15
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
                
                return div.childNodes;
            },
            /**
              * ����html
              * html: ��ѡ����Ҫ�����html
              * container: ��ѡ������html������
              * deletess: ��ѡ���Ƿ�ɾ��style/script
              * isReplace: ��ѡ���Ƿ��滻������true:�滻��Ĭ�ϣ���false:���滻
              * ���ش�����Ԫ�ض��󣬲�����scriptԪ��
             */
            handle: function(html, container, deletess, isReplace){
                var objContent = $('<div/>');
                if ($.type(deletess)==='boolean'){
                    isReplace = deletess;
                    deletess = 'none';
                }
                isReplace = (typeof isReplace!=='undefined') ? isReplace : true;
                /*
                  <span>�ô�˵�������ڽ��IE�е�һ��Ԫ��Ϊ<script>ʱ����ִ�и�script������
                */
                //objContent.innerHTML = this._innerShiv('<span style="display:none">hack ie</span>' + html);
                
                objContent.append(this._innerShiv('<span style="display:none">hack ie</span>' + html));
                
                //add by hongss on 2011.12.15 for delect style or script  start
                switch (deletess){
                    case 'style':
                        objContent.find('style').remove();
                        break;
                    case 'script':
                        objContent.find('script').remove();
                        break;
                    case 'both':
                        objContent.find('style, script').remove();
                        break;
                }
                //end
                
                var scripts = objContent.find('script'),
                len = scripts.length,
                arrScript = [];
                //��¼��scripts��parent,before,after,src,script
                for (var i=0; i<len; i++){
                    var script = scripts.eq(i),
                    objScript = {};
                    objScript['parent'] = script.parent();
                    objScript['before'] = this._getBefore(script);
                    objScript['after'] = this._getAfter(script);
                    objScript['src'] = script.attr('src');
                    objScript['script'] = script.html();
                    arrScript.push(objScript);
                }
                
                scripts.remove();
                
                /*ѡ����ʵķ�ʽ����HTML*/
                var objHtml = objContent.children();
                if (isReplace){
                    container.replaceWith(objHtml);
                } else {
                    container.html('').append(objHtml);
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
                        var child = $(children[i]);
                        objBefore.after(child);
                        objBefore = child;
                    }
                } else if(objAfter && objAfter.length!==0){
                    for (var i=0; i<len; i++){
                        var child = $(children[i]);
                        objAfter.before(child);
                        objAfter = child;
                    }
                } else if(objParent && objParent.length!==0){
                    objParent.html(str);
                }
            },
            /**
             * ��ȡelǰһ����script���ֵܽڵ�
             */
            _getBefore: function(el){
                var prevEls = el.prevAll();
                for (var i=0, l=prevEls.length; i<l; i++){
                    if (prevEls[i].nodeName.toUpperCase()!=='SCRIPT'){
                        return prevEls.eq(i);
                    }
                }
                return $();
            },
            /**
             * ��ȡel��һ����script���ֵܽڵ�
             */
            _getAfter: function(el){
                var nextEls = el.nextAll();
                for (var i=0, l=nextEls.length; i<l; i++){
                    if (nextEls[i].nodeName.toUpperCase()!=='SCRIPT'){
                        return nextEls.eq(i);
                    }
                }
                return $();
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
            }
        },
        readyFun = [
            /**
             * JSȡ����
             */
            function(){
                request($('.dcms-position-beacon-js'));
            },
            /**
             * ESI�ĵ��������ع���
             */
            function(){
                var els = $('.dcms-beacon-position'),
                params = [];
                //�ع���
                if (els.length>0) {
                    els.each(function(i){
                        var param = $(this).data('exposure-id'),
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
        function request(els, callback) {
            callback = $.extend({}, callback);
            els.each(function(j){
                var that = $(this),
                url = that.data('url'),
                deletess = that.data('deletess');
                $.ajax({
                    url:url,
                    dataType:'jsonp',
                    success:function(o){
                        if (o&&o.content){
                            insertHtml.init();
                            var objContent = insertHtml.handle(o.content, that, deletess);
                            insertHtml.reset();
                            
                            var success = callback.success;
                            if (success && $.isFunction(success)){
                                success.call(objContent);
                            }
                            
                            //�Ƿ���е�������ع���
                            if (o.pid&&o.rid&&o.tid){
                                var pid = o.pid, 
                                rid = o.rid,
                                tid = o.tid,
                                clickParam = 'pid='+pid+'&rid='+rid+'&tid='+tid,
                                exposureParam = pid+','+rid+','+tid+';';
                                
                                //���ӵ���������Ҫ������
                                objContent.filter('a').data('click-param', clickParam);
                                objContent.find('a').data('click-param', clickParam);
                                
                                //�ع���
                                iexposure(exposureParam);
                                //add by hongss on 2012.05.14
                                objContent.filter('.dcms-beacon-position').attr('data-exposure-id', exposureParam);
                            }
                        } else {
                            var error = callback.error;
                            if (error && $.isFunction(error)){
                                error.call(that);
                            } else {
                                failure(that, '��������Ϊ�գ�����ϵ����Ա');
                            }
                        }
                    },
                    error:function(){
                        var error = callback.error;
                        if (error && $.isFunction(error)){
                            error.call(that);
                        } else {
                            failure(that, '��������Ϊ�գ�����ϵ����Ա');
                        }
                    }
                });
            });
        }
        drive.request = request;
        
        /**
         * ������ʾ
         * el: ��ѡ�����ش�����Ϣ������
         * html: ��ѡ����Ҫ��ʾ�Ĵ�����Ϣ(html)
         */
        function failure(el, html){
            el.replaceWith('<div style="font-size:16px; font-weight:bolder;">'+html+'</div>');
        }
         
        /**
         * ������
         * modify by pingchun.yupc on 2011.11.21 for add a parameter of url
         */
        function iclick(){
            var pageId = getPageId();
            $('.dcms-beacon-position-a').live('mousedown', function(){
                var el = $(this),
                param = el.data('click-param'),
                url= el.attr('href'),
                idx = url.indexOf('?'),
                idx1 = url.indexOf('#');
                
                url = (idx!==-1) ? url.substring(0, idx) : url;
                url = (idx1!==-1) ? url.substring(0, idx1) : url;
                param +='&url='+url;
                (new Image).src = 'http://stat.1688.com/click_dcms.htm?'+param+'&st_page_id='+pageId;
            });
        }
        /**
         * �ع���
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
            base = $('base', head);
            //���IE��<base />��ǩ�е�bug
            (base.length>0) ? head.insertBefore(child, base[0]) : head.appendChild(child);
        }
        
        //��ȡpage_id
        function getPageId(){
            var pageId;
            if (window.dmtrack_pageid) {
                pageId = window.dmtrack_pageid;
            } else {
                pageId = '';
            }
            getPageId = function(){ return pageId;}
            return pageId;
        }
        
        $(function(){
             for (var i=0, l=readyFun.length; i<l; i++) {
                 try {
                     readyFun[i]();
                 } catch(e) {
                     if ($.log) {
                         $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                     }
                 } finally {
                     continue;
                 }
             }
        });
         
    })(jQuery, FE.sys.Dcms.Drive);
}

