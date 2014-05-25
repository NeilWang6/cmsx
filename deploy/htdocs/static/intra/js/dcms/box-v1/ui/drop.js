/**
 * @author hongss
 * @userfor ����HTML5�Ϸ��¼����Ϸ�Ч��������ֻ������קԪ�ػ��Ϸ�Ŀ��Ԫ��
 * @date 2012.01.09
 */
 
;(function($, D, undefined){
    
    D.DragAddDrop = {
        /**
         * @methed _init ��ʼ��
         * @param config ������
         */
        init: function(config){
            this.config = $.extend({}, D.DragAddDrop.defConfig, config);
            var config = this.config,
                dragEls = config.dragEls,
                dropEls = config.dropEls;
            //���dragEls��dropEls�������ڣ��򷵻�
            if (!(dragEls && dropEls)){ return; }
            
            //���dragEls���ڣ���������Ҫ����dragEls�ϵ��¼�
            if (dragEls){
                this.dragEls = dragEls = $(dragEls);
                for (var i=0, l=dragEls.length; i<l; i++){
                    this._drag(dragEls[i]);
                    this._dragstart(dragEls[i]);
                    this._dragend(dragEls[i]);
                }
            }
            
            //���dropEls���ڣ���������Ҫ����dropEls�ϵ��¼�
            if (dropEls){
                this.dropEls = dropEls = $(dropEls);
                for (var i=0, l=dropEls.length; i<l; i++){
                    this._dragleave(dropEls[i]);
                    this._dragenter(dropEls[i]);
                    this._dragover(dropEls[i]);
                    this._drop(dropEls[i]);
                }
            }
        },
        /**
         * @methed _drag ���϶�Ԫ��ʱִ�У�����dragEls��
         * @param el ��Ҫ���¼���Ԫ�أ���jQuery����
         */
        _drag: function(el){
            var drag = this.config.drag;
            el.addEventListener('drag', function(e){
                if (drag && $.isFunction(drag)){
                    drag.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragstart ���϶�������ʼʱִ�У�����dragEls��
         * @param el ��Ҫ���¼���Ԫ�أ���jQuery����
         */
        _dragstart: function(el){
            var dragstart = this.config.dragstart;
            el.addEventListener('dragstart', function(e){
                e.dataTransfer.dropEffect = "copy";
                e.dataTransfer.effectAllowed = "copyMove";
                
                if (dragstart && $.isFunction(dragstart)){
                    dragstart.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragend ���϶���������ʱִ�У�����dragEls��
         * @param el ��Ҫ���¼���Ԫ�أ���jQuery����
         */
        _dragend: function(el){
            var dragend = this.config.dragend;
            el.addEventListener('dragend', function(e){
                e.preventDefault();
                if (dragend && $.isFunction(dragend)){
                    dragend.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragenter ��Ԫ�ر��϶�����Ч���Ϸ�Ŀ��ʱִ�У�����dropEls��
         * @param el ��Ҫ���¼���Ԫ�أ���jQuery����
         */
        _dragenter: function(el){
            var dragenter = this.config.dragenter;
            el.addEventListener('dragenter', function(e){
                if (dragenter && $.isFunction(dragenter)){
                    dragenter.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragover ��Ԫ�ر��϶�����Ч�Ϸ�Ŀ���Ϸ�ʱִ�У�����dropEls��
         * @param el ��Ҫ���¼���Ԫ�أ���jQuery����
         */
        _dragover: function(el){
            var dragover = this.config.dragover;
            el.addEventListener('dragover', function(e){
                e.preventDefault();
                if (dragover && $.isFunction(dragover)){
                    dragover.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _dragleave ��Ԫ���뿪��Ч�Ϸ�Ŀ��ʱִ�У�����dropEls��
         * @param el ��Ҫ���¼���Ԫ�أ���jQuery����
         */
        _dragleave: function(el){
            var dragleave = this.config.dragleave;
            el.addEventListener('dragleave', function(e){
                if (dragleave && $.isFunction(dragleave)){
                    dragleave.call(this, e);
                }
            }, false);
        },
        /**
         * @methed _drop �����϶�Ԫ�����ڱ��Ϸ�ʱִ�У�����dropEls��
         * @param el ��Ҫ���¼���Ԫ�أ���jQuery����
         */
        _drop: function(el){
            var drop = this.config.drop;
            el.addEventListener('drop', function(e){
                e.preventDefault();
                if (drop && $.isFunction(drop)){
                    drop.call(this, e);
                }
            }, false);
        }
    };
    
    //Ĭ��������
    D.DragAddDrop.defConfig = {
        dragEls: null,           //����ק��Ԫ�ؼ�
        dropEls: null,           //�Ϸ�Ŀ��Ԫ�ؼ�
        //dataType: 'text/html',   //����קԪ�ش洢�ĺ��Ϸ�Ŀ��Ԫ�ص���������
        drag: null,              //�ص����������϶�Ԫ��ʱִ�У�����dragEls��
        dragstart: null,         //�ص����������϶�������ʼʱִ�У�����dragEls��
        dragend: null,           //�ص����������϶���������ʱִ�У�����dragEls��
        dragenter: null,         //�ص���������Ԫ�ر��϶�����Ч���Ϸ�Ŀ��ʱִ�У�����dropEls��
        dragover: null,          //�ص���������Ԫ�ر��϶�����Ч�Ϸ�Ŀ���Ϸ�ʱִ�У�����dropEls��
        dragleave: null,         //�ص���������Ԫ���뿪��Ч�Ϸ�Ŀ��ʱִ�У�����dropEls��
        drop: null               //�ص������������϶�Ԫ�����ڱ��Ϸ�ʱִ�У�����dropEls��
    };
})(dcms, FE.dcms);