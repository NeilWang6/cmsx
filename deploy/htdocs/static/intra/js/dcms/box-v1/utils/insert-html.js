;(function($, D, undefined){
    /**
     * modify by hongss on 2012.05.25 for “回撤”功能
     */
    D.InsertHtml = {
        /**
          * 处理html
          * html: 必选，需要处理的html
          * container: 必选，承载html的容器
          * insertType: 必选，插入类型或插入形式
          * doc: 可选，文档对象，当执行的js在iframe的子模板时需要传
          * isExecJs: 可选，是否执行JS
          * isEdit: 可选，是否是编辑（体现在页面上的）
          * 返回处理后的元素对象，不包括script元素
          **注意** 目前为止能记录到“回撤”功能去的只有以下几种方法：html, replaceWith, after, before, html, append, wrap
         */
        init: function(html, container, insertType, doc, isExecJs){
            var isEdit;
            if ($.type(html) === 'object'){
                var opts = html;
                html = opts['html'];
                container = opts['container'];
                insertType = opts['insertType'];
                doc = opts['doc'];
                isExecJs = opts['isExecJs'];
                isEdit = opts['isEdit'];
            }
            if ($.type(doc) === 'boolean'){
                isExecJs = doc;
                doc = document;
            }
            isExecJs = (typeof isExecJs==='undefined') ? true : isExecJs;
            doc = doc || document;
            
            this._ready();
            var objContent = document.createElement('div');
            objContent.innerHTML = html;  
            objContent = $(objContent);
            var scripts = objContent.find('script'),
            len = scripts.length,
            arrScript = [];
            //记录下scripts的parent,before,after,src,script
            for (var i=0; i<len; i++){
                var script = scripts.eq(i),
                objScript = {};
                script.attr('type', 'text/plain');
                objScript['parent'] = script.parent();
                objScript['before'] = this._getBefore(script);
                objScript['after'] = this._getAfter(script);
                objScript['src'] = script.attr('src');
                objScript['script'] = script.html();
                arrScript.push(objScript);
            }
            /*选择合适的方式插入HTML*/
            var objHtml = objContent.children();
            //container[insertType](objHtml);
            var editInsertSteps = [];
            
            if (isEdit===true){
                switch (insertType){
                    case 'html':
                        var nodeInfo = this._htmlNodeInfo(html, container, insertType, doc);
                        container[insertType](objHtml);
                        editInsertSteps.push(nodeInfo);
                        break;
                    case 'replaceWith':
                        //if (objHtml.length>1){
                            /*var firstChile = objHtml.eq(0),
                                onceNodeInfo = this._replaceOnceNodeInfo(D.BoxTools.getEl2Html(firstChile), container, insertType, doc);
                            container[insertType](firstChile);
                            editInsertSteps.push(onceNodeInfo);*/
                            //for (var i=objHtml.length-1; i>=0; i--){
                            for (var i=0; i<objHtml.length; i++){
                                var el = objHtml.eq(i),
                                    //tempCon = D.BoxTools.getElem(onceNodeInfo['redo']['node'], $('body', doc)),
                                    nodeInfo = this._outsideNodeInfo(el, container, 'before', doc);
                                //tempCon['after'](el);
                                editInsertSteps.push(nodeInfo);
                            } 
                            var editDelSteps = D.EditContent.editDel({'elem':container, 'isEdit':isEdit});
                            editInsertSteps = editInsertSteps.concat(editDelSteps); 
                        
                        /*} else {
                            var nodeInfo = this._replaceOnceNodeInfo(html, container, insertType, doc);
                            container[insertType](objHtml);
                            editInsertSteps.push(nodeInfo);
                        }*/
                        break;
                    case 'append':
                        for (var i=0, l=objHtml.length; i<l; i++){
                            var el = objHtml.eq(i),
                                nodeInfo = this._appendNodeInfo(el, container, insertType, doc);
                            //container[insertType](el);
                            editInsertSteps.push(nodeInfo);
                        }
                        break;
                    case 'before':
                    case 'after':
                        for (var i=objHtml.length-1; i>=0; i--){
                            var el = objHtml.eq(i),
                                nodeInfo = this._outsideNodeInfo(el, container, insertType, doc);
                            //container[insertType](el);
                            editInsertSteps.push(nodeInfo);
                        }
                        break;
                    case 'wrap':
                        var nodeInfo = this._wrapNodeInfo(html, container, insertType, doc);
                        container[insertType](objHtml);
                        editInsertSteps.push(nodeInfo);
                        break;
                }
            } else {
                container[insertType](objHtml);
            }
            objHtml.find('script').add(objHtml.filter('script')).attr('type', 'text/javascript');
            /*处理JS*/
            if (isExecJs===true){
                this._includeScript(arrScript, 0, doc);
            }
            
            this._reset();
            //return objHtml;
            
            if (isEdit===true){
                return editInsertSteps;
                //记录内容已经被修改过
                /*D.BoxTools.setEdited({
                    'param':editInsertSteps,
                    'callback':$.nnop
                });*/
            }
            
            if (D.DropInPage){
                D.DropInPage.addEnableClass(container.parent());
            }
            
        },
        /**
         * @methed _htmlNodeInfo 当insertType为"html"时获取“回撤”数据的方法
         */
        _htmlNodeInfo: function(html, container, insertType, doc){
            var nodeInfo = {};
            nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                'execEl': container.html(),
                'relEl': container,
                'editType': 'insert',
                'doc': doc,
                'insertType': insertType
            });
            nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                'execEl': html,
                'relEl': container,
                'editType': 'insert',
                'doc': doc,
                'insertType': insertType
            });
            return nodeInfo;
        },
        /**
         * @methed _outsideNodeInfo 在元素后面查内容时记录“回撤”数据的方法，用在replaceWith和after
         */
        _outsideNodeInfo: function(elem, container, insertType, doc){
            var nodeInfo = {},
                realContainer = this._getRealContainer(container),
                realInsertType = this._getRealInsertType(container) || insertType,
                relation, tempCon = container;
            
            if (realInsertType==='after'){
                relation = 'next';
                if (realContainer[0]!==container[0]){
                    tempCon = container.prev().prev();
                }
                
            } else {
                relation = 'prev';
            }
            nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                'execEl':D.BoxTools.getEl2Html(elem), 
                'relEl':tempCon, 
                'editType':'insert', 
                'doc':doc, 
                'insertType':realInsertType
            });
            container[insertType](elem);
            
            var execEl = this._getExecEl(realContainer, relation, realInsertType); 
            
            //做after/before处理时需要 realContainer[relation]()[relation]()
            nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                'execEl':execEl, 
                'editType':'delete'
            });
            return nodeInfo;
        },
        
        _getExecEl: function(container, relation, realInsertType){
            if (relation==='prev'){
                if (container[relation+'All']('.crazy-box-'+realInsertType+'-singer').length>0){
                    return container[relation]()[relation]();
                }
                return container[relation]();
            } else {
                return container;
            }
        },
        /**
         * @methed _appendNodeInfo 插入内容时记录“回撤”数据的方法，用在append
         */
        _appendNodeInfo: function(elem, container, insertType, doc){
            var nodeInfo = {},
                children = container['children']();
            
            nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                'execEl':D.BoxTools.getEl2Html(elem), 
                'relEl':container,
                'editType':'insert', 
                'doc':doc, 
                'insertType':insertType
            });
            container[insertType](elem);
            nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                'execEl':container.children().last(), 
                'editType':'delete'
            });
            return nodeInfo;
        },
        
        _wrapNodeInfo: function(html, container, insertType){
            var nodeInfo = {};
            nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                'execEl': '',
                'relEl': container,
                'editType': 'insert',
                //'doc': doc,
                'insertType': 'unwrap'
            });
            nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                'execEl': html,
                'relEl': container,
                'editType': 'insert',
                //'doc': doc,
                'insertType': 'wrap'
            });
            return nodeInfo;
        },
        /**
         * @methed _getRealContainer 遇到前、后标识的时候向上或向下找真正的内容元素
         */
        _getRealContainer: function(elem){
            if (elem.hasClass('crazy-box-before-singer')===true){
                return elem.next();
            }
            if (elem.hasClass('crazy-box-after-singer')===true){
                return elem.prev();
            }
            return elem;
        },
        _getRealPosContainer: function(elem){
            if (elem.prevAll('.crazy-box-before-singer').length>0){
                return elem.prev();
            }
            return elem;
        },
        _getRealInsertType: function(elem){
            if (elem.hasClass('crazy-box-before-singer')===true){
                return 'before';
            }
            if (elem.hasClass('crazy-box-after-singer')===true){
                return 'after';
            }
        },
         /*初始化，重置write/writeln方法，只需执行一次*/
        _ready : function(){
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
         */
        _reset : function(){
            if (this.write){
                document.write = this.write;
            }
            if (this.writeln){
                document.writeln = this.writeln;
            }
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
         * 获取el前一个非script的兄弟节点
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
         * 获取el后一个非script的兄弟节点
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
         * 外部引入的script处理，使其同步加载，递归函数
         * arrScript: 需要处理的script数组
         * i: 数组下标
         */
        _includeScript: function(arrScript, i, doc){
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
                            self._includeScript(arrScript, j, doc);
                        }
                        script.onload = script.onreadystatechange = null;
                    }
                };
                this._insertHead(script, doc);
            } else {  //内联的script
                this._insertHead(script, doc);
                script.text = arrScript[i].script;
                if (j<len){
                    self._includeScript(arrScript, j, doc);
                }
            }
        },
        _insertHead: function(child, doc){
            var head = $('head', doc)[0],
            base = $('base', head);
            //解决IE中<base />标签中的bug
            (base.length>0) ? head.insertBefore(child, base[0]) : head.appendChild(child);
        }
    }
})(dcms, FE.dcms);