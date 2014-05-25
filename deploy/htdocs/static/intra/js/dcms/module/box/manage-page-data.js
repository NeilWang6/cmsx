/**
 * @author hongss
 * @userfor 拖拽元件到页面中，还包括了移动、复制的数据计算层
 * @date  2012.08.10
 */

;(function($, D){
    D.ManagePageDate = {
        /**
         * @methed _handleCopyHtml 处理copy需要用的html代码
         * @param el 被拷贝的元素，jQuery对象
         * @param mod container|replace|sibling，进行拷贝时的模式
         * @param target 触点元素
         * @return 处理后的htmlcode
         */
        handleCopyHtml: function(el, mod, target, chooseLevel){
            var self = this,
                htmlcode, classReg, className, oldModuleClass, newModuleClass,
                type = self.getWidgetType(el) || chooseLevel,
                opts = {'mod':mod, 'target':target, 'type':type};
            if (type==='cell'){
                var moduleClass = '.crazy-box-module',
                    moduleReg = /^(cell-module$)|(cell-module-\d+$)/;
                classReg = /^cell-/;
                oldModuleClass = D.BoxTools.getClassName(el.closest(moduleClass), moduleReg);
                newModuleClass = D.BoxTools.getClassName(target.closest(moduleClass), moduleReg);
            } else {
                //modify by hongss on 2012.02.23
                //classReg = new RegExp('^(crazy-'+type+'$)|(crazy-'+type+'-\\d+$)');
                classReg = new RegExp('^(cell-'+type+'$)|(cell-'+type+'-\\d+$)');
            }
            className = D.BoxTools.getClassName(el, classReg);
            opts['classname'] = className;

            htmlcode = self._getCopyHtml(el, type, className);
            htmlcode = self.handleStyle(htmlcode, opts, false, oldModuleClass, newModuleClass);
            return htmlcode;
        },
        /**
         * @methed _handleStyle 处理style的相关内容
         * @param htmlcode 加载并需要处理的数据
         * @param opts 配置项 {'mod':'container|replace|sibling', 'target':target(), 'classname':className, 'type':类型(layout|grid...)}
         * @param isNew 是否为新增
         * @param oldModuleClass 可选，module的class名，只有当opts['type']==='cell'并isNew===false才有
         * @param newModuleClass 可选，module的class名，只有当opts['type']==='cell'并isNew===false才有
         * @return 处理后的htmlcode
         */
        handleStyle: function(htmlcode, opts, isNew, oldModuleClass, newModuleClass){
            if ($.type(isNew)!=='boolean'){
                newModuleClass = oldModuleClass;
                oldModuleClass = isNew;
                isNew = null;
            }
            //将module升级为row，因需求需要做特殊处理
            if (opts['type']==='module' && (isNew===true||D.DropInPage.state==='copy')){
                htmlcode = '<div class="crazy-box-row cell-row" data-boxoptions=\'{"css":[{"key":"background","name":"背景设置","type":"background"}],"ability":{"copy":{"enable":"true"}}}\'>\
                            <div class="crazy-box-box box-100" data-boxoptions=\'{"css":[{"key":"background","name":"背景设置","type":"background"},{"key":"width","name":"宽度","type":"input","disable":"true"}],"ability":{"container":{"enableType":"module","number":"1"}}}\'>'
                            + htmlcode + '</div></div>';
                opts['type'] = 'row';
            }
            
            htmlcode = this._handleReplaceClass(htmlcode, opts['type'], oldModuleClass, newModuleClass);
            
            switch(opts['mod']){
                case 'replace':
                    htmlcode = this._delStyle(htmlcode, opts['target'], opts['classname'], true);
                    break;
                case 'container':
                case 'sibling':
                    htmlcode = this._delStyle(htmlcode, opts['target'], opts['classname'], false);
                    break;
            }
            if (isNew===true){
                htmlcode = this._addFixpreClass(htmlcode, opts['target'], opts['type']);
            }
            return htmlcode;
        },
        /**
         * @methed _handleReplaceClass 处理替换class名
         * @param htmlcode 需要处理的html代码
         * @param type htmlcode所对应的类型，layout|grid|row|box|module|cell
         * @param oldModuleClass 可选，老的module class名
         * @param newModuleClass 可选，新的module class名
         * @return 返回处理后的htmlcode
         */
        _handleReplaceClass: function(htmlcode, type, oldModuleClass, newModuleClass){
            var div = $('<div />'), htmlNode;
            //div.html(htmlcode);
            D.InsertHtml.init(htmlcode, div, 'html', false);
            switch (type){
                case 'layout':
                    htmlcode = this._handleReplace(div, htmlcode, 'layout');
                case 'row':
                    htmlcode = this._handleReplace(div, htmlcode, 'row');
                case 'module':
                    htmlcode = this._handleReplace(div, htmlcode, 'module');
                    break;
                case 'cell':
                    htmlcode = this._replaceNewClass(htmlcode, null, 'cell', oldModuleClass, newModuleClass);
                    break;
            }
            return htmlcode;
        },
        /**
         * @methed _delStyle 处理元件中的style
         * @param htmlcode 需要处理的html代码
         * @param target 触点元素，jQuery对象
         * @param isReplace 是否替换，true|false
         * @return 返回处理后的htmlcode
         */
        _delStyle: function(htmlcode, target, className, isReplace){
            var module = target.closest('.crazy-box-module');
                //className = this.elemInfo['className'];
            if (module.length>0){
                var length = module.find('.'+className).length;
                if (length>1){
                    htmlcode = D.EditContent.delRepeatStyle({'htmlcode':htmlcode, 'module':module, 'classname':className});
                } else if(length===1) {
                    if (isReplace===true && !target.hasClass(className)){
                        //htmlcode = D.EditContent.delRepeatStyle({'htmlcode':htmlcode, 'module':module, 'classname':className});
                    } else if(isReplace===false){
                        htmlcode = D.EditContent.delRepeatStyle({'htmlcode':htmlcode, 'module':module, 'classname':className});
                    }
                }
            }
            return htmlcode;
        },
        /**
         * @methed _addFixpreClass 增加前缀class名
         * @param htmlcode 需要处理的html代码
         * @param target 触点元素
         * @param type htmlcode所对应的类型，layout|grid|row|box|module|cell
         * @return 返回处理后的htmlcode
         */
        _addFixpreClass: function(htmlcode, target, type){
            if (type==='cell'){
                var parentNode = target.closest('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+'module'),
                    htmlNode = $(htmlcode).filter('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+type),
                    //preClassName = D.BoxTools.getClassName(parentNode, /^(crazy-module$)|(crazy-module-\d+$)/),  modify by hongss on 2012.02.23
                    preClassName = D.BoxTools.getClassName(parentNode, /^(cell-module$)|(cell-module-\d+$)/),
                    fixClassName = D.BoxTools.getClassName(htmlNode, /^cell-/);
                
                htmlcode = D.EditContent.addPrefix({'htmlcode':htmlcode, 'fixstr':fixClassName, 'prestr':preClassName});
            }
            return htmlcode;
        },
        /**
         * @methed _handleReplace 处理替换
         * @param div jQuery对象
         * @param htmlcode 需要处理的html字符串
         * @param type htmlcode所对应的类型，layout|grid|row|box|module|cell
         * @return 返回处理后的htmlcode
         */
        _handleReplace: function(div, htmlcode, type){
            var htmlNode, replaceHtml, className,
                classReg = new RegExp('^(cell-'+type+'$)|(cell-'+type+'-\\d+$)');
            
            htmlNode = div.find('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+type);
            for (var i=0, l=htmlNode.length; i<l; i++){
                var el = htmlNode.eq(i);
                className = D.BoxTools.getClassName(el, classReg);
                replaceHtml = this._getCopyHtml(el, type, className);
                replaceHtml = this._replaceNewClass(replaceHtml, el, type, className);
                D.DropInPage._replaceHtml({'htmlcode':replaceHtml, 'target':el, 'isExecJs':false});
                htmlcode = div.html();
            }
            return htmlcode;
        },
        /**
         * @methed _replaceNewClass 替换成新的class名
         * @param htmlcode 需要处理的html代码
         * @param htmlNode 需要替换的节点
         * @param type htmlcode所对应的类型，layout|grid|row|box|module|cell
         * @param oldClass 可选，原来老的class名
         * @return 返回处理后的htmlcode
         */
        _replaceNewClass: function(htmlcode, htmlNode, type, oldClass, newClass){
            if (type==='layout'||type==='row'||type==='module' || type==='cell'){
                //D.BoxTools.setUuid();
                //var classMod = 'crazy-'+type,  modify by hongss on 2012.02.23
                var classMod = 'cell-'+type,
                    classReg = new RegExp('^('+classMod+'$)|('+classMod+'-\d+$)');
                newClass = newClass || classMod + '-' + D.BoxTools.getUuid();
                oldClass = oldClass || D.BoxTools.getClassName(htmlNode, classReg);
                htmlcode = D.BoxTools.replaceClassName(htmlcode, oldClass, newClass);
            }
            return htmlcode;
        },
        /**
         * @methed _getWidgetClasses 获取元件(widget)的相关class名，elemClass和enableClass
         * @param elem 元件元素，jQuery对象
         */
        getWidgetClasses: function(elem, curElemClass, curEnableClass){
            var type = this.getWidgetType(elem),
                CONSTANTS = D.DropInPage.CONSTANTS,
                elemClass, enbaleClass;
            if ($.inArray(type, CONSTANTS.ALL_WIDGET_TYPES)>-1){
                elemClass = CONSTANTS.ELEMENT_CLASS_PREFIX+type;
                enableClass = CONSTANTS.ENABLE_CLASS_PREFIX+type;
            } else {
                elemClass = curElemClass;
                enableClass = curEnableClass;
            }
            return {'elemClass':elemClass, 'enableClass':enableClass};
        },
        /**
         * @methed _getWidgetType 获取元件的类型
         * @param elem 元件元素，jQuery对象
         */
        getWidgetType: function(elem){
            if (!elem){ return; }
            var ALL_WIDGET_TYPES = D.DropInPage.CONSTANTS.ALL_WIDGET_TYPES,
                type;
            for (var i=ALL_WIDGET_TYPES.length-1; i>0; i--){
                if (elem.hasClass(D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+ALL_WIDGET_TYPES[i])===true){
                    type = ALL_WIDGET_TYPES[i];
                    break;
                }
            }
            type = type || 'label';
            return type;
        },
        /**
         * @methed _getCopyHtml 获取需要复制的html代码
         * @param el 需要复制的元素，jQuery对象
         * @param type 元件类型，layout|grid|row|box|module|cell
         * @return 返回需要复制的html代码，包括style和script
         */
        _getCopyHtml: function(el, type, className){
            var parent = (type==='cell') ? el.closest('.'+D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX+'module') : el.parent(),
                div = $('<div />'),
                elem = el.clone(),
                scriptsObj = parent.find('script[data-for='+className+']').clone();
            
            this._setScriptAttr(elem.find('script'), 'text/plain');
            this._setScriptAttr(scriptsObj, 'text/plain');
            
            div.append(parent.find('link[data-for='+className+'],style[data-for='+className+']').clone())
                .append(elem).append(scriptsObj);
            
            //去除cell高亮的class名
            div.find('.'+D.DropInPage.defConfig.cellHightLightCurrent).removeClass(D.DropInPage.defConfig.cellHightLightCurrent);
            
            return div.html();
        },
        /**
         * @methed _setScriptAttr 设置script标签的type属性值
         * @param scripts script标签集，jQuery对象
         * @param type type值
         */
        _setScriptAttr: function(scripts, type){
            scripts.each(function(i, el){
                $(el).attr('type', type);
            });
        },
        /**
         * @methed getModuleHtml 获得module的HTML代码，用于提供出来在其他非盒子页面上使用
         * @param scripts script标签集，jQuery对象
         * @param type type值
         */
        getModuleHtml: function(editHtml){
            editHtml = editHtml.replace(/data-boxoptions=\"([^"]+)\"/g, '');
            editHtml = editHtml.replace(/data-eleminfo=\"([^"]+)\"/g, '');
            editHtml = '<link rel="stylesheet" href="http://static.c.aliimg.com/css/app/tools/box/global/extension-min.css" />\n' + editHtml;
            return editHtml;
        }
    };
    
})(dcms, FE.dcms);