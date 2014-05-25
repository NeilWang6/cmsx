/**
 * @author shanshan.hongss
 * @usefor ���ߺ�̨��ʽͳһ ���� ���ӡ�ɾ�����ƶ�
 * @date   2012.09.24
 */

;(function($, T){
    T.AddDelMove = function(opts){
        this._init(opts);
    };
    T.AddDelMove.defConfig = {
        container:'.form', //����������ѡ����(selector)���������津����¼�����
        operateEl:'.item-operate', //�������󣬼������ӡ�ɾ�����ƶ��������ѡ����(selector)�������Ӳ���������(����)��
        add:'.icon-add',  //���Ӵ����ѡ����(selector)
        del:'.icon-delete',  //ɾ�������ѡ����(selector)
        moveup:'.icon-moveup',  //���ƴ����ѡ����(selector)
        movedown:'.icon-movedown',  //���ƴ����ѡ����(selector)
        afterAdd: null,  //�������Ӳ�����Ļص�����
        afterDel: null,  //����ɾ��������Ļص�����
        afterMoveup: null,  //�������Ʋ�����Ļص�����
        afterMovedown: null,  //�������Ʋ�����Ļص�����
        allowDelAll:false //�Ƿ�����ɾ��ȫ��������ֻʣһ��Ԫ��ʱ�Ƿ�����ɾ��
    };
    T.AddDelMove.prototype = {
        _init: function(opts){
            var self = this,
                config = $.extend({}, T.AddDelMove.defConfig, opts);

            self._setFirstAddLastStyle(config);
            //���Ӵ�����¼�
            $(config.container).delegate(config.operateEl+' '+config.add, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    cloneEl = operateEl.clone();

                operateEl.after(cloneEl);

                self._setFirstAddLastStyle(config);

                if (config.afterAdd){
                    config.afterAdd.call(this, cloneEl, el);
                }
            });

            //ɾ��������¼�
            $(config.container).delegate(config.operateEl+' '+config.del, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    siblingEls = operateEl.siblings(config.operateEl);

                if (config.allowDelAll==true || siblingEls.length>0){
                    operateEl.remove();
                }

                self._setFirstAddLastStyle(config);

                if (config.afterDel){
                	//add by 2013-02-18  pingchun.yupc �����ֵܽڵ����
                    config.afterDel.call(this, operateEl, el,siblingEls);
                }
            });

            //���ƴ�����¼�
            $(config.container).delegate(config.operateEl+' '+config.moveup, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    prevEl = operateEl.prev(config.operateEl);
                if (prevEl.length>0){
                    prevEl.before(operateEl);
                }

                self._setFirstAddLastStyle(config);

                if (config.afterMoveup){
                    config.afterMoveup.call(this, operateEl, el);
                }
            });

            //���ƴ�����¼�
            $(config.container).delegate(config.operateEl+' '+config.movedown, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    nextEl = operateEl.next(config.operateEl);
                if (nextEl.length>0){
                    nextEl.after(operateEl);
                }

                self._setFirstAddLastStyle(config);

                if (config.afterMovedown){
                    config.afterMovedown.call(this, operateEl, el);
                }
            });
        },
        _setFirstAddLastStyle: function(config){
            var items = $(config.operateEl, config.container),
                firstEl = items.eq(0),
                lastEl = items.eq(items.length-1);
            items.find(config.moveup).show();
            items.find(config.movedown).show();
            items.find(config.del).show();
            firstEl.find(config.moveup).hide();
            lastEl.find(config.movedown).hide();

            if ( config.allowDelAll==false && items.length===1){
                items.find(config.del).hide();
            }
        }
    };
})(jQuery, FE.tools);