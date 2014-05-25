/**
 * @author hongss
 * @userfor ��קԪ����ҳ���У����������ƶ������Ƶ����ݼ����
 * @date  2012.08.10
 */

;(function($, D){
    D.ManagePageDate = {
        /**
         * @methed _handleCopyHtml ����copy��Ҫ�õ�html����
         * @param el ��������Ԫ�أ�jQuery����
         * @param mod container|replace|sibling�����п���ʱ��ģʽ
         * @param target ����Ԫ��
         * @return ������htmlcode
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
         * @methed _handleStyle ����style���������
         * @param htmlcode ���ز���Ҫ���������
         * @param opts ������ {'mod':'container|replace|sibling', 'target':target(), 'classname':className, 'type':����(layout|grid...)}
         * @param isNew �Ƿ�Ϊ����
         * @param oldModuleClass ��ѡ��module��class����ֻ�е�opts['type']==='cell'��isNew===false����
         * @param newModuleClass ��ѡ��module��class����ֻ�е�opts['type']==='cell'��isNew===false����
         * @return ������htmlcode
         */
        handleStyle: function(htmlcode, opts, isNew, oldModuleClass, newModuleClass){
            if ($.type(isNew)!=='boolean'){
                newModuleClass = oldModuleClass;
                oldModuleClass = isNew;
                isNew = null;
            }
            //��module����Ϊrow����������Ҫ�����⴦��
            if (opts['type']==='module' && (isNew===true||D.DropInPage.state==='copy')){
                htmlcode = '<div class="crazy-box-row cell-row" data-boxoptions=\'{"css":[{"key":"background","name":"��������","type":"background"}],"ability":{"copy":{"enable":"true"}}}\'>\
                            <div class="crazy-box-box box-100" data-boxoptions=\'{"css":[{"key":"background","name":"��������","type":"background"},{"key":"width","name":"���","type":"input","disable":"true"}],"ability":{"container":{"enableType":"module","number":"1"}}}\'>'
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
         * @methed _handleReplaceClass �����滻class��
         * @param htmlcode ��Ҫ�����html����
         * @param type htmlcode����Ӧ�����ͣ�layout|grid|row|box|module|cell
         * @param oldModuleClass ��ѡ���ϵ�module class��
         * @param newModuleClass ��ѡ���µ�module class��
         * @return ���ش�����htmlcode
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
         * @methed _delStyle ����Ԫ���е�style
         * @param htmlcode ��Ҫ�����html����
         * @param target ����Ԫ�أ�jQuery����
         * @param isReplace �Ƿ��滻��true|false
         * @return ���ش�����htmlcode
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
         * @methed _addFixpreClass ����ǰ׺class��
         * @param htmlcode ��Ҫ�����html����
         * @param target ����Ԫ��
         * @param type htmlcode����Ӧ�����ͣ�layout|grid|row|box|module|cell
         * @return ���ش�����htmlcode
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
         * @methed _handleReplace �����滻
         * @param div jQuery����
         * @param htmlcode ��Ҫ�����html�ַ���
         * @param type htmlcode����Ӧ�����ͣ�layout|grid|row|box|module|cell
         * @return ���ش�����htmlcode
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
         * @methed _replaceNewClass �滻���µ�class��
         * @param htmlcode ��Ҫ�����html����
         * @param htmlNode ��Ҫ�滻�Ľڵ�
         * @param type htmlcode����Ӧ�����ͣ�layout|grid|row|box|module|cell
         * @param oldClass ��ѡ��ԭ���ϵ�class��
         * @return ���ش�����htmlcode
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
         * @methed _getWidgetClasses ��ȡԪ��(widget)�����class����elemClass��enableClass
         * @param elem Ԫ��Ԫ�أ�jQuery����
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
         * @methed _getWidgetType ��ȡԪ��������
         * @param elem Ԫ��Ԫ�أ�jQuery����
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
         * @methed _getCopyHtml ��ȡ��Ҫ���Ƶ�html����
         * @param el ��Ҫ���Ƶ�Ԫ�أ�jQuery����
         * @param type Ԫ�����ͣ�layout|grid|row|box|module|cell
         * @return ������Ҫ���Ƶ�html���룬����style��script
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
            
            //ȥ��cell������class��
            div.find('.'+D.DropInPage.defConfig.cellHightLightCurrent).removeClass(D.DropInPage.defConfig.cellHightLightCurrent);
            
            return div.html();
        },
        /**
         * @methed _setScriptAttr ����script��ǩ��type����ֵ
         * @param scripts script��ǩ����jQuery����
         * @param type typeֵ
         */
        _setScriptAttr: function(scripts, type){
            scripts.each(function(i, el){
                $(el).attr('type', type);
            });
        },
        /**
         * @methed getModuleHtml ���module��HTML���룬�����ṩ�����������Ǻ���ҳ����ʹ��
         * @param scripts script��ǩ����jQuery����
         * @param type typeֵ
         */
        getModuleHtml: function(editHtml){
            editHtml = editHtml.replace(/data-boxoptions=\"([^"]+)\"/g, '');
            editHtml = editHtml.replace(/data-eleminfo=\"([^"]+)\"/g, '');
            editHtml = '<link rel="stylesheet" href="http://static.c.aliimg.com/css/app/tools/box/global/extension-min.css" />\n' + editHtml;
            return editHtml;
        }
    };
    
})(dcms, FE.dcms);