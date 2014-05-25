/**
 * @author hongss
 * @userfor �༭����ģ��
 * @date  2012-02-10
 */
 
;(function($, D, undefined){
    D.EditContent = {
        /**
         * @methed editContent �༭���ݣ������ı�#text�����ӵ�href��ͼƬ��src������������ֵ���޸� 
         * @param opts ������  {elem:el(jQuery����), key:key(��������), value:value(����ֵ), 
         *                           isEdit:true|false(�Ƿ����޸ģ���Ϊֱ���޸ķǡ��������򡰻ָ�����),
         *                           isReturnInfo: true|false(�Ƿ񷵻�nodeInfo����)}
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
				//�׳��¼�
				/*$(window).trigger('EditContent.text',{
					elem:opts['elem']
				});*/
            } else {
                //var value = $.util.escapeHTML($.util.unescapeHTML(opts['value']), true);
                var value = opts['value'];
                oldOpts['value'] = opts['elem'].attr(opts['key']) || '';
                opts['elem'].attr(opts['key'], value);
            }
            
            //��ߴ���Ϊ������ã�ԭ���޴˲��������������
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
         * @methed editCss �༭CSS��ʽ
         * @param opts ������  {elem:el(jQuery����), key:key(css������), value:value(css����ֵ), pseudo:':link'(α��), 
         *  isEditClass(�Ƿ�༭class�е���ʽ):'false', 'isEdit':true|false(�Ƿ����޸ģ���Ϊֱ���޸ķǡ��������򡰻ָ�����)}
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
         * @methed removeStyle ɾ��style�����е�css��ʽ����
         * @param opts ������  {elem:el(jQuery����), key:key(css������), isRemoveStyle(�Ƿ��Ƴ�style�����е���ʽ):'true', 
         *                       'isEdit':true|false(�Ƿ����޸ģ���Ϊֱ���޸ķǡ��������򡰻ָ�����)}
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
         * @methed editCopy �༭copy���ԣ�����ǩ�ظ�opts['value']��
         * @param opts ������  {elem:el(jQuery����), value:value(�ظ�����), relative:[rel1, rel2, ...],
         *                      'isEdit':true|false(�Ƿ����޸ģ���Ϊֱ���޸ķǡ��������򡰻ָ�����)}
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
         * @methed editLink �༭�������ԣ���Ԫ�ؼ��ϻ�ɾ��a��ǩ
         * @param opts ������  {elem:el(jQuery����), value:value(�Ƿ���Ҫa��ǩ��1��ʾ��Ҫ��0��ʾ����Ҫ),
         *                          ahtml:'<a href=""></a>'(����������html����), "isEdit":true|false}
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
         * @methed editDel �༭ɾ�����ԣ���opts['elem']��ǩɾ�����������opts['relative']������ǩҲɾ��
         * @param opts ������  {elem:el(jQuery����), relative:[rel1, rel2, ...], isEdit:true/false}
         *                  isEdit:��trueʱ˵����Ҫ��¼�����س���������ȥ
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
                //��¼�����Ѿ����޸Ĺ�
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
         * @methed _getRemoveNodeInfo ��ȡ
         * @param el ִ�е�Ԫ��
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
         * @methed delRepeatStyle ɾ����module�����е�style/link��ǩ
         * @param opts ������  {htmlcode:html(��Ҫ�����html����), module:el(jQuery����), classname:className}
         * @return ���ش�����html����
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
         * @methed addPrefix Ϊclass�����ǰ׺
         * @param opts ������  {htmlcode:html(��Ҫ�����html), fixstr:class(�����ǰ׺���ַ���[class��]), prestr:������ǰ׺���ַ���[class��]}
         * @return ���ش�����html����
         */
        addPrefix: function(opts){
            if (!(opts['htmlcode']&&opts['fixstr']&&opts['prestr'])){ return; }
            var fixReg = new RegExp('([\\s*\'\"])(\.'+opts['fixstr']+')([\\s*\'\"\{])', 'g');
            return opts['htmlcode'].replace(fixReg, '$1.'+opts['prestr']+' $2$3');
        },
        /**
         * @methed _addLink ��Ԫ�ؼ���a��ǩ
         * @param elem ��Ҫ��a��ǩ��Ԫ��
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
         * @methed _removeLink ��Ԫ��ɾ��a��ǩ
         * @param elem ��Ҫɾ��a��ǩ��Ԫ��
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
         * @methed _getChildNodes ��ȡ�ǿա���ע�͵��ӽڵ�
         * @param elem Ԫ�أ���jQuery����
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
         * @methed _getWidgetEl ��ȡ��Ӧcell��module��row��layout
         * @param el ��ǰԪ�أ�jQuery����
         */
        _getWidgetEl: function(el){
            var widgetEl = el.closest(D.EditContent.CONSTANTS.IDENTIFY_TYPE_CLASS_NAME.join());
            return (widgetEl.length>0) ? widgetEl : el;
        },
        /**
         * @methed _getStyleEl ��ȡstyle��ǩ�����û���Զ�����һ��
         * @param widgetEl Ԫ��Ԫ��
         * @param cellClassName cell��Class��
         */
        _getStyleEl: function(widgetEl, cellClassName){
            var styleEl = widgetEl.siblings('style[data-for='+cellClassName+']');
            
            if (!styleEl.length){
                styleEl = $('<style type="text/css" data-for="'+cellClassName+'"></style>').insertBefore(widgetEl);
            }
            return styleEl;
        },
        /**
         * @methed _editCssInElem �ڱ�ǩ��Style�������޸���Ӧ��ʽ
         * @param opts ��������editCss����
         */
        _editCssInElem: function(opts){
            var style = opts['elem'].attr('style') || '',
                newStyle = this._getCssProperty(style, opts['key'], opts['value'], opts['isRemoveStyle']);
            
            opts['elem'].attr('style', newStyle);
        },
        /**
         * @methed _removeCssInElem �ڱ�ǩ��Style������ɾ����Ӧ��ʽ
         * @param opts ��������editCss����
         */
        _removeCssInElem: function(opts){
            
        },
        /**
         * @methed _editCssInClass ��class���޸���Ӧ��ʽ
         * @param opts ��������editCss����
         */
        _editCssInClass: function(opts){
            var widgetEl = this._getWidgetEl(opts['elem']),
                //��cell�ĸ���Ԫ��Ҳ�ɱ༭ʱȡ��cell-��ʼ��class������Ϊ����
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
         * @methed _modifyCss �޸�CSS��ʽ
         * @param style css��ʽ�ַ���
         * @param className ��Ҫ�޸���ʽ��ǩ��class��
         * @param key ��Ҫ�޸���ʽ��������
         * @param value ��Ҫ�޸���ʽ������ֵ
         * @param cellClassName ��ǩ���ڵ�Ԫ��class��
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
         * @methed _getCssProperty �޸�CSS��ʽ
         * @param cssStr css��ʽ�����ַ���
         * @param key ��Ҫ�޸���ʽ��������
         * @param value ��Ҫ�޸���ʽ������ֵ
         * @param isRemoveStyle �Ƿ��Ƴ�style�е�css��ʽ����
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
         * @methed _getSiblingsIdx ��ȡĳ��Ԫ����Ԫ�ؼ����ǵڼ���
         * @param elem ��Ҫ֪��������Ԫ��
         * @param siblings Ԫ�ؼ�
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
         * @methed _handleCopy �ظ�����
         * @param elem ��Ҫ�ظ���Ԫ��
         * @param times �ظ�����
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
         * @methed _getCloneEl ��ȡ�ظ�Ԫ��
         * @param elem ��Ҫ�ظ���Ԫ��
         * @return ���ش������ظ�Ԫ��
         */
        _getCloneEl: function(elem){
            var cloneEl = elem.clone();
            cloneEl.find('link,style').remove();
            return cloneEl;
        },
        /**
         * @methed _delStyle ɾ��style/link��ǩ
         * @param htmlcode ��Ҫ�����html����
         * @return ���ش�����html����
         */
        _delStyle: function(widget){
            widget = widget.not('style, link');
            widget.find('style, link').remove();
            var div = $('<div />');
            div.append(widget);
            return div.html();
        },
        /**
         * @methed _handleStyleEls �ж�����module���Ƿ����ͬ����cell��
         *                          ������ڽ�styleEls�Ƶ��������������cell�ϣ�����ɾ��
         * @param styleEls <style />��<link />��ǩ��Ԫ�ؼ�
         */
        _handleStyleEls: function(elem, className, styleEls, isEdit, doc){
            var moduleEl = elem.closest('.'+D.EditContent.CONSTANTS.MODULE_TYPE_CLASS_NAME),
                els = moduleEl.find('.'+className),
                length = els.length,
                tempSteps = [], self = this;
            if (length>1){
                for (var i=0; i<length; i++){
                    if (els[i]!==elem[0]){
                        //���Ǵ˴��ı仯��Ӱ��ҳ��Ч�����ݿ��ǲ���¼������������
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
         * @methed _setEmpty �����ǩ�ڵ�Ԫ��ֻ�пհ׷�ʱ����ձ�ǩ�ڵ���������
         * @param el ָ����ǩ
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