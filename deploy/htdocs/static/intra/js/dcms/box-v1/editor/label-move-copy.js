/**
 * @author hongss
 * @userfor 标签内容的上移、下移、复制；目前逻辑是只对cell下的能重复的标签可以进行移动、复制操作
 * @date  2013.01.07
 * @rely /box-v1/common/tools.js | /box-v1/ui/high-light.js | /box-v1/common/edit-content.js
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
 
;(function($, D, editor){
    //数据处理层
    var _M = {
        /**
         * @methed [isEnable] 是否允许上移、下移、复制等操作
         * @param [el] 必选，需要做出判断的元素，jQuery对象
         * @return true | false
         */
        isEnable: function(el){
            return !!(this._isCopyable(el) && this._isLabelInCell(el));
        },
        /**
         * @methed [_isCopyable] 是否允许重复(在配置项中是否有允许重复的配置)
         * @param [el] 必选，需要做出判断的元素，jQuery对象
         * @return true | false
         */
        _isCopyable: function(el){
            var options = el.data(CONSTANTS.TAG_DATA_BOX_OPTIONS);
            return !!D.BoxTools.parseOptions(options, ['ability', 'copy', 'enable']);
        },
        /**
         * @methed [_isCopyable] 是否是cell内的标签
         * @param [el] 必选，需要做出判断的元素，jQuery对象
         * @return true | false
         */
        _isLabelInCell: function(el){
            return !!( !el.hasClass(CONSTANTS.CELL_STANDARD_CLASS_NAME) && 
                        el.closest('.'+CONSTANTS.CELL_STANDARD_CLASS_NAME).length>0 && 
                        el.find('.'+CONSTANTS.CELL_STANDARD_CLASS_NAME).length===0 );
        },
        moveUp: function(el){
            var elPath = D.BoxTools.getPath(el);
            D.EditContent.moveUp({'elem':el, 'doc':_V.iframeDoc, 'isEdit':true});
            return D.BoxTools.getElem(elPath, _V.iframeBody).prev();
        },
        moveDown: function(el){
            var elPath = D.BoxTools.getPath(el);
            D.EditContent.moveDown({'elem':el, 'doc':_V.iframeDoc, 'isEdit':true});
            return D.BoxTools.getElem(elPath, _V.iframeBody).next();
        },
        copy: function(el){
            D.EditContent.copyOnce({'elem':el, 'doc':_V.iframeDoc, 'isEdit':true});
            return el;
        }
    }; 
    
    //展示层
    var _V = {
        lightEl: null,    //用于显示高亮的元素
        iframeDoc: null, //当前文档
        init: function(doc){
            this.iframeDoc = doc;
            this.iframeBody = $('body', doc);
            this.lightEl = $('#crazy-box-move-light', doc);
            _C._eventMoveUp();
            _C._eventMoveDown();
            _C._eventCopy();
            _C._eventDoc();
        },
        /**
         * @methed [_isCopyable] 是否是cell内的标签
         * @param [el] 必选，需要高亮的元素，jQuery对象
         */
        showMoveLight: function(el, doc, lightEl){
            if (doc && $(doc)[0]){
                this.iframeDoc = doc;
                this.iframeBody = $('body', doc);
                this.lightEl = $('#crazy-box-move-light', doc);
            }
            if (_M.isEnable(el)){
                D.BoxTools.hideHighLight();
                D.HighLight.showLight(this.lightEl, el);
            } else {
                this.hideMoveLigth();
                D.BoxTools.showHighLight(el, lightEl);
            }
        },
        hideMoveLigth: function(){
            D.HighLight.hideLight(this.lightEl);
        },
        /**
         * @methed [_handleEvent] 处理上移、下移、复制的事件
         * @param [type] 必选，moveUp(上移) | moveDown(下移) | copy(复制) 取三者之一
         * @param [el] 必选，需要高亮的元素，jQuery对象
         */
        _handleEvent: function(type, e){
            e && e.preventDefault();
            var el = D.HighLight.getLightElemData(this.lightEl),
                newEl = _M[type](el);
            //D.HighLight.hideLight(this.lightEl);
            console.log(newEl);
            D.HighLight.showLight(this.lightEl, newEl);
        }
    };
    
    //控制层
    var _C = {
        _eventMoveUp: function(){
            $('.ml-moveup', _V.lightEl).bind('click', function(e){
                _V._handleEvent('moveUp', e);
            });
        },
        _eventMoveDown: function(){
            $('.ml-movedown', _V.lightEl).bind('click', function(e){
                _V._handleEvent('moveDown', e);
            });
        },
        _eventCopy: function(){
            $('.ml-copy', _V.lightEl).bind('click', function(e){
                _V._handleEvent('copy', e);
            });
        },
        _eventDoc: function(){
            $(document).bind('box.editor.label_move_copy', function(e, param){
                //console.log(11);
                //不知道为何param本是jQuery对象，但传到此处就变成了元素对象
                var args = Array.prototype.slice.call(arguments, 1);
                _V.showMoveLight.apply(_V, args);
            });
        }
    };
    
    //常量定义
    var CONSTANTS = {
        TAG_DATA_BOX_OPTIONS: 'boxoptions',
        CELL_STANDARD_CLASS_NAME: 'crazy-box-cell'
    };
    
    editor.LabelMoveCopy = _V;
})(dcms, FE.dcms, FE.dcms.box.editor);