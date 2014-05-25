/**
 * @author hongss
 * @userfor 编辑内容模块
 * @date  2012-02-10
 */
 
;(function($, D, undefined){
    D.EditContent = {
        /**
         * @methed editContent 编辑内容，包括文本#text，连接的href，图片的src，及其他属性值的修改 
         * @param opts 配置项  {elem:el(jQuery对象), key:key(内容类型), value:value(内容值), 
         *                           isEdit:true|false(是否是修改，人为直接修改非“撤销”或“恢复”的),
         *                           isReturnInfo: true|false(是否返回nodeInfo数据)}
         */
        editContent: function(opts){
            if (!(opts['elem']&&opts['key'])){ return; }
            opts['value'] = opts['value'] || '';
             var nodeInfo = {},
                oldOpts = $.extend({}, opts),
                newOpts = $.extend({}, opts);
            if (opts['key']==='#text'){
                var value = $.util.escapeHTML($.util.unescapeHTML(opts['value']));
                oldOpts['value'] = opts['elem'].html();
                opts['elem'].html(value);
				//抛出事件
				/*$(window).trigger('EditContent.text',{
					elem:opts['elem']
				});*/
            } else {
                //var value = $.util.escapeHTML($.util.unescapeHTML(opts['value']), true);
                var value = opts['value'];
                oldOpts['value'] = opts['elem'].attr(opts['key']) || '';
                opts['elem'].attr(opts['key'], value);
            }
            
            //这边代码为另外调用，原来无此参数，故如此设置
            if (opts['isEdit']!==false){
                nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                    'execEl': opts['elem'],
                    'editType': D.EditContent.editContent,
                    'args': newOpts
                });
                
                nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                    'execEl': opts['elem'],
                    'editType': D.EditContent.editContent,
                    'args': oldOpts
                });
                
                if (opts['isReturnInfo']===true){
                    return nodeInfo;
                } else {
                    D.BoxTools.setEdited({
                        'param': nodeInfo,
                        'callback': null
                    });
                }
            }
        },
        /**
         * @methed editCss 编辑CSS样式
         * @param opts 配置项  {elem:el(jQuery对象), key:key(css属性名), value:value(css属性值), pseudo:':link'(伪类), 
         *  isEditClass(是否编辑class中的样式):'false', 'isEdit':true|false(是否是修改，人为直接修改非“撤销”或“恢复”的)}
         */
        editCss: function(opts){
            if (!(opts['elem']&&opts['key']&&opts['value'])){ return; }
            opts['pseudo'] = opts['pseudo'] || '';
            
            var nodeInfo = {},
                oldOpts = $.extend({}, opts),
                newOpts = $.extend({}, opts);
            oldOpts['value'] = opts['elem'].css(opts['key']);
            if (opts['isEditClass']===false){
                this._editCssInElem(opts);
            } else {
                this._editCssInClass(opts);
            }
            
            if (opts['isEdit']!==false){
                nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                    'execEl': opts['elem'],
                    'editType': D.EditContent.editCss,
                    'args': newOpts
                });
                nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                    'execEl': opts['elem'],
                    'editType': D.EditContent.editCss,
                    'args': oldOpts
                });
                D.BoxTools.setEdited({
                    'param': nodeInfo,
                    'callback': null
                });
            }
        },
        /**
         * @methed removeStyle 删除style属性中的css样式属性
         * @param opts 配置项  {elem:el(jQuery对象), key:key(css属性名), isRemoveStyle(是否移除style属性中的样式):'true', 
         *                       'isEdit':true|false(是否是修改，人为直接修改非“撤销”或“恢复”的)}
         */
        removeStyle: function(opts){
            if (!(opts['elem']&&opts['key']&&opts['isRemoveStyle'])){ return; }
            if (opts['isRemoveStyle']===true){
                var nodeInfo = {},
                    oldOpts = $.extend({}, opts),
                    newOpts = $.extend({}, opts);
                
                oldOpts['value'] = opts['elem'][0].style[opts['key']];
                oldOpts['isEditClass'] = newOpts['isEditClass'] = false;
                
                this._editCssInElem(opts);
                
                if (opts['isEdit']!==false){
                    nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                        'execEl': opts['elem'],
                        'editType': D.EditContent.removeStyle,
                        'args': newOpts
                    });
                    oldOpts['isRemoveStyle'] = false;
                    nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                        'execEl': opts['elem'],
                        'editType': D.EditContent.editCss,
                        'args': oldOpts
                    });
                    D.BoxTools.setEdited({
                        'param':nodeInfo,
                        'callback': null
                    });
                }
            }
        },
        /**
         * @methed editCopy 编辑copy属性，将标签重复opts['value']次
         * @param opts 配置项  {elem:el(jQuery对象), value:value(重复次数), relative:[rel1, rel2, ...],
         *                      'isEdit':true|false(是否是修改，人为直接修改非“撤销”或“恢复”的)}
         */
        editCopy: function(opts){
            if (!(opts['elem']&&opts['value'])){ return; }
            
            var editClassName = D.BoxTools.getClassName(opts['elem'], D.EditContent.CONSTANTS.EDIT_ELEM_CLASS_NAME_REG),
                siblings = opts['elem'].parent().children('.'+editClassName),
                index = this._getSiblingsIdx(opts['elem'], siblings),
                relative = opts['relative'],
                length = ($.isArray(relative)===true) ? relative.length : 0;
                widgetEl = this._getWidgetEl(opts['elem']),
                copySteps1 = copySteps2 = [];
                
            copySteps1 = this._handleCopy(opts['elem'], siblings, opts['value'], opts['isEidt']);
            
            for (var i=0; i<length; i++){
                var relSiblings = widgetEl.find(relative[i]);
                copySteps2 = this._handleCopy(relSiblings[index], relSiblings, opts['value'], opts['isEidt']);
            }
            
            if (opts['isEidt']!==false){
                D.BoxTools.setEdited({
                    'param': copySteps1.concat(copySteps2),
                    'callback': null
                });
            }
            
        },
        /**
         * @methed editLink 编辑连接属性，给元素加上或删除a标签
         * @param opts 配置项  {elem:el(jQuery对象), value:value(是否需要a标签，1表示需要，0表示不需要),
         *                          ahtml:'<a href=""></a>'(类似这样的html代码), "isEdit":true|false}
         */
        editLink: function(opts){
            if (!(opts['elem']&&opts['value'])){ return; }
            
            switch (opts['value']){
                case '1':
                    var nodeInfo = this._addLink(opts);
                    if (opts['isEdit']!==false){
                        D.BoxTools.setEdited({
                            'param': nodeInfo,
                            'callback': null
                        });
                    }
                    break;
                case '0':
                    var nodeInfo = this._removeLink(opts['elem'], opts['isEdit']);
                    if (opts['isEdit']!==false){
                        D.BoxTools.setEdited({
                            'param': nodeInfo,
                            'callback': null
                        });
                    }
                    break;
            }
        },
        /**
         * @methed editDel 编辑删除属性，将opts['elem']便签删除，如果存在opts['relative']关联标签也删除
         * @param opts 配置项  {elem:el(jQuery对象), relative:[rel1, rel2, ...], isEdit:true/false}
         *                  isEdit:当true时说明需要记录到“回撤”数据中去
         */
        editDel: function(opts){
            if (!opts || !opts['elem']){ return; }
            
            var editClassName = D.BoxTools.getClassName(opts['elem'], D.EditContent.CONSTANTS.CELL_CLASS_NAME_REG) ||  
                                D.BoxTools.getClassName(opts['elem'], D.EditContent.CONSTANTS.EDIT_ELEM_CLASS_NAME_REG),
                parent = opts['elem'].parent(),
                editDelSteps = [], self = this, nodeInfo = {}, relativeNode;
            
            if (editClassName && opts['elem'].siblings('.'+editClassName).length===0){
                //opts['elem'].siblings('link[data-for='+editClassName+'], style[data-for='+editClassName+'], script[data-for='+editClassName+']').remove();
                //opts['elem'].siblings('script[data-for='+editClassName+']').remove();
                opts['elem'].siblings('script[data-for='+editClassName+']').each(function(i, el){
                    var el = $(el);
                    (opts['isEdit']===true) ? editDelSteps.push(self._getRemoveNodeInfo(el, opts['doc'])) : el.remove();
                });
                
                var tempSteps = this._handleStyleEls(opts['elem'], editClassName, opts['elem'].siblings('link[data-for='+editClassName+'], style[data-for='+editClassName+']'), opts['isEdit'], opts['doc']);
                if (tempSteps && tempSteps.length>0){
                    editDelSteps = editDelSteps.concat(tempSteps);
                }
            }
            
            (opts['isEdit']===true) ? editDelSteps.push(self._getRemoveNodeInfo(opts['elem'], opts['doc'])) : opts['elem'].remove();
            
            this._setEmpty(parent);
            
            var length;
            if (opts['relative'] && (length = opts['relative'].length)){
                var idx = opts['elem'].index(editClassName),
                    widgetEl = this._getWidgetEl(opts['elem']);
                for (var i=0; i<length; i++){
                    var relClass = opts['relative'][i],
                        els = widgetEl.find('.'+relClass);
                    if (els.length>=idx){
                        if (els.length===1){
                            widgetEl.find('link[data-for='+relClass+'], style[data-for='+relClass+'], script[data-for='+relClass+']').each(function(i, el){
                                var el = $(el);
                                (opts['isEdit']===true) ? editDelSteps.push(self._getRemoveNodeInfo(el, opts['doc'])) : el.remove();
                            });
                        }
                        var el = els.eq(idx),
                            par = el.parent();
                        (opts['isEdit']===true) ? editDelSteps.push(self._getRemoveNodeInfo(el, opts['doc'])) : el.remove();
                        this._setEmpty(par);
                    } 
                }
            }
            
            
            if (opts['isEdit']===true){
                return editDelSteps;
                //记录内容已经被修改过
                /*D.BoxTools.setEdited({
                    'param': editDelSteps,
                    'callback': $.nnop
                });*/
            }
            
        },
        stepDel: function(opts){
            if (!opts || !opts['elem']){ return; }
            opts['elem'].remove();
        },
        /**
         * @methed _getRemoveNodeInfo 获取
         * @param el 执行的元素
         */
        _getRemoveNodeInfo: function(el, doc){
            var nodeInfo = {}, 
                relativeNode = D.BoxTools._getRelativeNode(el);
            doc = doc || D.DropInPage.iframeDoc;
            
            nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                'execEl':el, 
                'editType':'delete', 
                'doc':doc
            });
            
            el.remove();
            nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                'execEl':el, 
                'relEl':relativeNode['elem'], 
                'editType':'insert', 
                'insertType':relativeNode['insertType'], 
                'doc':doc
            });
            
            return nodeInfo;
        },
        /**
         * @methed delRepeatStyle 删除在module中已有的style/link标签
         * @param opts 配置项  {htmlcode:html(将要加入的html代码), module:el(jQuery对象), classname:className}
         * @return 返回处理后的html代码
         */
        delRepeatStyle: function(opts){
            if (!opts['htmlcode']){ return; }
            var htmlcode = opts['htmlcode'];
            
            if (opts['classname'] && opts['module'] && opts['module'].find('.'+opts['classname']).length){
                var widget = $(htmlcode);
                htmlcode = this._delStyle(widget);
            }
            return htmlcode;
        },
        /**
         * @methed addPrefix 为class名添加前缀
         * @param opts 配置项  {htmlcode:html(需要处理的html), fixstr:class(被添加前缀的字符串[class名]), prestr:用来做前缀的字符串[class名]}
         * @return 返回处理后的html代码
         */
        addPrefix: function(opts){
            if (!(opts['htmlcode']&&opts['fixstr']&&opts['prestr'])){ return; }
            var fixReg = new RegExp('([\\s*\'\"])(\.'+opts['fixstr']+')([\\s*\'\"\{])', 'g');
            return opts['htmlcode'].replace(fixReg, '$1.'+opts['prestr']+' $2$3');
        },
        /**
         * @methed _addLink 给元素加上a标签
         * @param elem 需要加a标签的元素
         */
        _addLink: function(opts){
            if (opts['elem'][0].nodeName.toUpperCase()==='A' || opts['elem'].closest('a').length>0){ return; }
            
            /*var nodeInfo = D.InsertHtml.init({
                'html': '<a class="crazy-link-'+D.BoxTools.getUuid()+'" href="#" title="" />',
                'container': elem,
                'insertType': 'wrap',
                'isExecJs': false,
                'isEdit': true
            });*/
            var nodeInfo = {},
                ahtml = opts['ahtml'] || '<a class="crazy-link-'+D.BoxTools.getUuid()+'" href="#" title="" />';
            if (opts['isEdit']!==false){
                nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                    'execEl': opts['elem'],
                    'editType': D.EditContent.editLink,
                    'args': {'elem':opts['elem'], 'value':'0', 'isEdit':false}
                });
                
                nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                    'execEl': opts['elem'],
                    'editType': D.EditContent.editLink,
                    'args': {'elem':opts['elem'], 'value':'1', 'ahtml':ahtml, 'isEdit':false}
                });
            }
            
            opts['elem'].wrap(ahtml);
            
            return nodeInfo;
        },
        /**
         * @methed _removeLink 给元素删除a标签
         * @param elem 需要删除a标签的元素
         */
        _removeLink: function(elem, isEdit){
            if (!elem[0] || elem[0].nodeName.toUpperCase()!=='A'){ return; }
            
            var parent = elem.parent(),
                childNodes = this._getChildNodes(elem[0]),
                ahtml = D.BoxTools.getEl2Html(elem.clone().html(''));
                nodeInfo = {};
            
            if (isEdit!==false){
                nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                    'execEl': elem,
                    'editType': D.EditContent.editLink,
                    'args': {'elem':elem, 'value':'1', 'ahtml':ahtml, 'isEdit':false}
                });
                nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                    'execEl': elem,
                    'editType': D.EditContent.editLink,
                    'args': {'elem':elem, 'value':'0', 'isEdit':false}
                });
            }
            
            if (childNodes.length===1 && childNodes[0].nodeType===1){
                elem.children().unwrap();
            }else if (parent.children().length===1){
                parent.html(elem.html());
            } else {
                var span = $('<span>'), classNames, boxOptions;
                if (!!(classNames=$.trim(elem.attr('class')))){
                    span.attr('class', classNames);
                }
                if (!!(boxOptions=$.trim(elem.attr('data-boxoptions')))){
                    span.attr('data-boxoptions', boxOptions);
                }
                span.html(elem.html());
                elem.replaceWith(span);
            }
            
            return nodeInfo;
        },
        /**
         * @methed _getChildNodes 获取非空、非注释的子节点
         * @param elem 元素，非jQuery对象
         */
        _getChildNodes: function(elem){
            var childNodes = elem.childNodes,
                children = [];
            for (var i=0, l=childNodes.length; i<l; i++){
                if (childNodes[i].nodeType===1 
                            || (childNodes[i].nodeType===3 && $.trim(childNodes[i].nodeValue)!=='')){
                    children.push(childNodes[i]);
                }
            }
            return children;
        },
        /**
         * @methed _getWidgetEl 获取对应cell或module或row或layout
         * @param el 当前元素，jQuery对象
         */
        _getWidgetEl: function(el){
            var widgetEl = el.closest(D.EditContent.CONSTANTS.IDENTIFY_TYPE_CLASS_NAME.join());
            return (widgetEl.length>0) ? widgetEl : el;
        },
        /**
         * @methed _getStyleEl 获取style标签，如果没有自动生成一个
         * @param widgetEl 元件元素
         * @param cellClassName cell的Class名
         */
        _getStyleEl: function(widgetEl, cellClassName){
            var styleEl = widgetEl.siblings('style[data-for='+cellClassName+']');
            
            if (!styleEl.length){
                styleEl = $('<style type="text/css" data-for="'+cellClassName+'"></style>').insertBefore(widgetEl);
            }
            return styleEl;
        },
        /**
         * @methed _editCssInElem 在标签的Style属性中修改相应样式
         * @param opts 配置项，详见editCss方法
         */
        _editCssInElem: function(opts){
            var style = opts['elem'].attr('style') || '',
                newStyle = this._getCssProperty(style, opts['key'], opts['value'], opts['isRemoveStyle']);
            
            opts['elem'].attr('style', newStyle);
        },
        /**
         * @methed _removeCssInElem 在标签的Style属性中删除相应样式
         * @param opts 配置项，详见editCss方法
         */
        _removeCssInElem: function(opts){
            
        },
        /**
         * @methed _editCssInClass 在class中修改相应样式
         * @param opts 配置项，详见editCss方法
         */
        _editCssInClass: function(opts){
            var widgetEl = this._getWidgetEl(opts['elem']),
                //当cell的父级元素也可编辑时取其cell-开始的class名，当为类型
                editClassName = D.BoxTools.getClassName(opts['elem'],function(v){
					return v == 'crazy-current';
					
				})|| D.BoxTools.getClassName(opts['elem'], D.EditContent.CONSTANTS.CELL_CLASS_NAME_REG) ||   
                                D.BoxTools.getClassName(opts['elem'], D.EditContent.CONSTANTS.EDIT_ELEM_CLASS_NAME_REG),
                cellClassName = D.BoxTools.getClassName(widgetEl, D.EditContent.CONSTANTS.CELL_CLASS_NAME_REG) || 
                                D.BoxTools.getClassName(opts['elem'], D.EditContent.CONSTANTS.EDIT_ELEM_CLASS_NAME_REG),
                moduleClassName = D.BoxTools.getClassName(widgetEl.closest('.crazy-box-module'), /^cell-module/),
                styleEl = this._getStyleEl(widgetEl, cellClassName),
                newStyle = this._modifyCss(styleEl.html(), editClassName+opts['pseudo'], opts['key'], opts['value'], cellClassName, moduleClassName);
            styleEl.html(newStyle);
        },
        /**
         * @methed _modifyCss 修改CSS样式
         * @param style css样式字符串
         * @param className 需要修改样式标签的class名
         * @param key 需要修改样式的属性名
         * @param value 需要修改样式的属性值
         * @param cellClassName 标签所在的元件class名
         */
        _modifyCss: function(style, className, key, value, cellClassName, moduleClassName){
            var cssReg = new RegExp('(\\.'+className+'\\s*{)([^\}]*)(})', 'g'),
                self = this,
                newValue = '', newTwoValue = '';
            
            style = style || '';
            if (cssReg.test(style)===true){
                newValue = style.replace(cssReg, function($all, $one, $two, $thr){
                    return $one + self._getCssProperty($two, key, value) + $thr;
                });
            } else {
                if (moduleClassName && moduleClassName!==cellClassName){
                    newValue = '.'+moduleClassName;
                }
                if (cellClassName && cellClassName!==className){
                    newValue += ' .'+cellClassName;
                }
                newValue = newValue+' .'+className+'{'+key+':'+value+';}';
                newValue = style+'\n'+newValue;
            }
            
            return newValue;
        },
        /**
         * @methed _getCssProperty 修改CSS样式
         * @param cssStr css样式属性字符串
         * @param key 需要修改样式的属性名
         * @param value 需要修改样式的属性值
         * @param isRemoveStyle 是否移除style中的css样式属性
         */
        _getCssProperty: function(cssStr, key, value, isRemoveStyle){
            var keyReg = new RegExp('([^-]'+key+':)([^;]*)(;)', 'g'),
                newTwoValue;
            if (keyReg.test(cssStr)===true){
                newTwoValue = (isRemoveStyle===true) ? cssStr.replace(keyReg, '') 
                                        : cssStr.replace(keyReg, '$1'+value+'$3') ;
            } else {
                newTwoValue = (isRemoveStyle===true) ? cssStr 
                                    : cssStr.replace(/;\s*$/, '')+';'+key+':'+value+';';
            }
            return newTwoValue;
        },
        /**
         * @methed _getSiblingsIdx 获取某个元素在元素集中是第几个
         * @param elem 需要知道序数的元素
         * @param siblings 元素集
         */
        _getSiblingsIdx: function(elem, siblings){
            var index;
            siblings.each(function(i){
                if (siblings[i]===elem[0]){
                    index = i;
                }
            });
            return index;
        },
        /**
         * @methed _handleCopy 重复处理
         * @param elem 需要重复的元素
         * @param times 重复次数
         */
        _handleCopy: function(elem, siblings, times, isEdit){
            if (parseInt(times)===0){
                times = 1;
            }
            var length = siblings.length,
                elem = $(elem),
                cloneEl = this._getCloneEl(elem),
                copySteps = [],
                doc = (D.DropInPage&&D.DropInPage.iframeDoc) || this._getIframeDoc(elem);
            
            if (length < times){
                var lastOne = siblings.eq(length-1);
                for (var i=length; i<times; i++){
                    var cloneOne = cloneEl.clone();
                    lastOne.after(cloneOne);
                    
                    if (isEdit!==false){
                        var nodeInfo = {};
                        nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                            'execEl':lastOne.next(), 
                            'editType':'delete', 
                            'doc':doc
                        });
                        nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                            'execEl': cloneOne, 
                            'relEl': lastOne,
                            'editType': 'insert', 
                            'doc': doc,
                            'insertType': 'after'
                        });
                        copySteps.push(nodeInfo);
                    }
                }
            } else if(length > times) {
                for (var i=length; i>times; i--){
                    if (isEdit!==false){
                        var nodeInfo = {};
                        nodeInfo['redo'] = D.PageOperateHistory.getNodeInfo({
                            'execEl':siblings.eq(i-1), 
                            'editType':'delete', 
                            'doc':doc
                        });
                        nodeInfo['undo'] = D.PageOperateHistory.getNodeInfo({
                            'execEl': siblings.eq(i-1), 
                            'relEl': siblings.prev(),
                            'editType': 'insert', 
                            'doc': doc,
                            'insertType': 'after'
                        });
                        copySteps.push(nodeInfo);
                    }
                    
                    siblings.eq(i-1).remove();
                    
                    
                }
            }
            return copySteps;
        },
        _getIframeDoc: function(el){
            var parents = el.parents(document);
            return parents.eq(parents.length-1);
        },
        /**
         * @methed _getCloneEl 获取重复元素
         * @param elem 需要重复的元素
         * @return 返回处理后的重复元素
         */
        _getCloneEl: function(elem){
            var cloneEl = elem.clone();
            cloneEl.find('link,style').remove();
            return cloneEl;
        },
        /**
         * @methed _delStyle 删除style/link标签
         * @param htmlcode 需要处理的html代码
         * @return 返回处理后的html代码
         */
        _delStyle: function(widget){
            widget = widget.not('style, link');
            widget.find('style, link').remove();
            var div = $('<div />');
            div.append(widget);
            return div.html();
        },
        /**
         * @methed _handleStyleEls 判断整个module中是否存在同样的cell，
         *                          如果存在将styleEls移到除它以外的其他cell上，否则删除
         * @param styleEls <style />、<link />标签的元素集
         */
        _handleStyleEls: function(elem, className, styleEls, isEdit, doc){
            var moduleEl = elem.closest('.'+D.EditContent.CONSTANTS.MODULE_TYPE_CLASS_NAME),
                els = moduleEl.find('.'+className),
                length = els.length,
                tempSteps = [], self = this;
            if (length>1){
                for (var i=0; i<length; i++){
                    if (els[i]!==elem[0]){
                        //因考虑此处的变化不影响页面效果，暂考虑不记录到“撤销”中
                        $(els[i]).before(styleEls);
                        break;
                    }
                }
            } else {
                //styleEls.remove();
                styleEls.each(function(i, el){
                    var el = $(el);
                    (isEdit===true) ? tempSteps.push(self._getRemoveNodeInfo(el, doc)) : el.remove();
                });
                if (isEdit===true){
                    return tempSteps;
                }
            }
        },
        
        
        /**
         * @methed _setEmpty 如果标签内的元素只有空白符时，清空标签内的所有内容
         * @param el 指定标签
         */
        _setEmpty: function(el){
            if (el.length<=0){ return; }
            var div = $('<div />'),
                children;
            //div.html(el.html());
            D.InsertHtml.init(el.html(), div, 'html', false);
            children = div[0].childNodes;
            for (var i=0, l=children.length; i<l; i++){
                if (children[i].nodeName.toUpperCase()==='#COMMENT'){
                    $(children[i]).remove();
                    i--;
                    l--;
                }
            }
            if (!$.trim(div.html())){
                el.html('');
            }
            div = null;
        }
    }
    
    D.EditContent.CONSTANTS = {
        IDENTIFY_TYPE_CLASS_NAME: ['.crazy-box-cell', '.crazy-box-module', '.crazy-box-row', '.crazy-box-layout'],
        MODULE_TYPE_CLASS_NAME: 'crazy-box-module',
        CELL_CLASS_NAME_REG: /^cell-/,
        EDIT_ELEM_CLASS_NAME_REG: /^crazy-/
    }
})(dcms, FE.dcms);