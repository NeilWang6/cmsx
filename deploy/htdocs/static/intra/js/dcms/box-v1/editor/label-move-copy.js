/**
 * @author hongss
 * @userfor ��ǩ���ݵ����ơ����ơ����ƣ�Ŀǰ�߼���ֻ��cell�µ����ظ��ı�ǩ���Խ����ƶ������Ʋ���
 * @date  2013.01.07
 * @rely /box-v1/common/tools.js | /box-v1/ui/high-light.js | /box-v1/common/edit-content.js
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
 
;(function($, D, editor){
    //���ݴ����
    var _M = {
        /**
         * @methed [isEnable] �Ƿ��������ơ����ơ����ƵȲ���
         * @param [el] ��ѡ����Ҫ�����жϵ�Ԫ�أ�jQuery����
         * @return true | false
         */
        isEnable: function(el){
            return !!(this._isCopyable(el) && this._isLabelInCell(el));
        },
        /**
         * @methed [_isCopyable] �Ƿ������ظ�(�����������Ƿ��������ظ�������)
         * @param [el] ��ѡ����Ҫ�����жϵ�Ԫ�أ�jQuery����
         * @return true | false
         */
        _isCopyable: function(el){
            var options = el.data(CONSTANTS.TAG_DATA_BOX_OPTIONS);
            return !!D.BoxTools.parseOptions(options, ['ability', 'copy', 'enable']);
        },
        /**
         * @methed [_isCopyable] �Ƿ���cell�ڵı�ǩ
         * @param [el] ��ѡ����Ҫ�����жϵ�Ԫ�أ�jQuery����
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
    
    //չʾ��
    var _V = {
        lightEl: null,    //������ʾ������Ԫ��
        iframeDoc: null, //��ǰ�ĵ�
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
         * @methed [_isCopyable] �Ƿ���cell�ڵı�ǩ
         * @param [el] ��ѡ����Ҫ������Ԫ�أ�jQuery����
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
         * @methed [_handleEvent] �������ơ����ơ����Ƶ��¼�
         * @param [type] ��ѡ��moveUp(����) | moveDown(����) | copy(����) ȡ����֮һ
         * @param [el] ��ѡ����Ҫ������Ԫ�أ�jQuery����
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
    
    //���Ʋ�
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
                //��֪��Ϊ��param����jQuery���󣬵������˴��ͱ����Ԫ�ض���
                var args = Array.prototype.slice.call(arguments, 1);
                _V.showMoveLight.apply(_V, args);
            });
        }
    };
    
    //��������
    var CONSTANTS = {
        TAG_DATA_BOX_OPTIONS: 'boxoptions',
        CELL_STANDARD_CLASS_NAME: 'crazy-box-cell'
    };
    
    editor.LabelMoveCopy = _V;
})(dcms, FE.dcms, FE.dcms.box.editor);