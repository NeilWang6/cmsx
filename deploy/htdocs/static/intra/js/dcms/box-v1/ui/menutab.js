/**
 * @author shanshan.hongss
 * @usefor DCMS-��ľ���� ���� �˵��л�
 * @date   2012.10.19
 */

;(function($, D, undefined) {
    D.MenuTab = function(opts) {
        this._init(opts);
    };

    D.MenuTab.defConfig = {
        handlerEls : '', //��ѡ������Ԫ��ѡ����������Ҫ�С�boxCon������
        boxEls : '', //��ѡ��������չʾ��Ԫ��ѡ���������˲���������ʱ
        handlerCon : '', //����Ԫ�صĸ���Ԫ�أ�ֻ��������ʹ��
        boxCon : '', //������չʾ��Ԫ�صĸ���Ԫ�أ�ֻ��������ʹ��
        closeEls : '', //�رմ���ѡ�����������Զ���Ϊ��Ԫ��Ϊ���������Ԫ��
        currClass : 'current', //��ǰԪ��
        selected : 0, //Ĭ��ѡ���ĸ��˵�
        afterShow : null, //չʾ��Ļص���������ʹ����createTab��Ҳ�ᴥ��
        afterCreate : null, //�½���Ļص���������tab�Ѿ�����δ������Ԫ��ʱ������
        afterClose : null, // �رպ���ú���
        beforeClose : null//�ر�ǰ���ú���

    };

    D.MenuTab.prototype = {
        _init : function(opts) {
            var config = $.extend({}, D.MenuTab.defConfig, opts), handlerCon = $(config.handlerCon), boxCon = $(config.boxCon), handlerEls = $(config.handlerEls, handlerCon), boxEls = $(config.boxEls, boxCon), self = this;

            this.config = config;
            this.handlerCon = handlerCon;
            this.boxCon = $(config.boxCon);

            //��ʼ��״̬
            this._showTab(config.selected, handlerEls, boxEls);

            //ע�ᴥ���¼�
            handlerCon.delegate(config.handlerEls, 'click', function(e) {
                e.preventDefault();
                var handlerEl = $(this);
                self._showTab(handlerEl);
            });

            //ע��ر��¼�
            handlerCon.delegate(config.closeEls, 'click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var closeEl = $(this), handlerEl = closeEl.closest(config.handlerEls);
                if(config.beforeClose && typeof config.beforeClose === 'function') {
                    config.beforeClose.call(self, handlerEl);
                } else {
                    if(config.afterClose && typeof config.afterClose === 'function') {
                        config.afterClose.call(self, handlerEl);
                    }
                    if(handlerEl.length > 0) {
                        self._removeTab(handlerEl);
                    }
                }
            });
        },
        /**
         * @methed _showTab ָ��tabչʾ
         * @param handle ���ֻ�Ԫ�ض���ָ�����ڼ�����tabչʾ
         * @param handlerEls ����Ԫ�ؼ��� ��ѡ
         * @param boxEls ������չʾ��Ԫ�ؼ��� ��ѡ
         */
        _showTab : function(handle, handlerEls, boxEls) {
            var config = this.config, n, handlerEl, boxEl;
            handlerEls = handlerEls || $(config.handlerEls, this.handlerCon);
            boxEls = boxEls || $(config.boxEls, this.boxCon);

            if($.type(handle) === 'number') {
                n = handle;
                handlerEl = handlerEls.eq(n);
            } else {
                handlerEl = handle;
                n = handlerEls.index(handlerEl);
            }

            boxEl = boxEls.eq(n);
            handlerEls.removeClass(config.currClass);
            handlerEl.addClass(config.currClass);
            boxEls.hide();
            boxEl.show();

            if(config.afterShow) {
                config.afterShow.call(this, handlerEl, boxEl);
            }
        },
        /**
         * @methed _removeTab ָ��tabɾ��
         * @param handle ���ֻ�Ԫ�ض���ָ�����ڼ�����tabɾ��
         * @param handlerEls ����Ԫ�ؼ��� ��ѡ
         * @param boxEls ������չʾ��Ԫ�ؼ��� ��ѡ
         */
        _removeTab : function(handle, handlerEls, boxEls) {
            var config = this.config, n, handlerEl;
            handlerEls = handlerEls || $(config.handlerEls, this.handlerCon);
            boxEls = boxEls || $(config.boxEls, this.boxCon);

            if($.type(handle) === 'number') {
                n = handle;
                handlerEl = handlerEls.eq(n);
            } else {
                handlerEl = handle;
                n = handlerEls.index(handlerEl);
            }
            if(handlerEl.hasClass(config.currClass)) {
                var i = (n === handlerEls.length - 1) ? n - 1 : n + 1;
                this._showTab(i, handlerEls, boxEls);
            }

            handlerEl.remove();
            boxEls.eq(n).remove();
        },
        /**
         * @methed removeTab ָ��tabɾ��
         * @param handle ���ֻ�Ԫ�ض���ָ�����ڼ�����tabɾ��
         */
        removeTab : function(handle) {
            this._removeTab(handle);
        },
        /**
         * @methed createTab ����һ���µ�tab
         * @param id �ض�ID�������ID�Ѿ����ڣ������½�����ʼ��ʱ���������еĴ���Ԫ�ؼ���һ���ض�ID
         * @param handlerHtml �½�ʱ��Ҫ�õ��Ĵ�����룬������½����Բ����˲���
         * @param boxHtml �½�ʱ��Ҫ�õ�����չʾ�����룬������½����Բ����˲���
         * @param fn �ص�����
         * @param onlyCreate �Ƿ�ֻ�����½�ʱִ�У����true���ʾֻ���½�ʱִ�У�����ִ��
         */
        createTab : function(id, handlerHtml, boxHtml, fn, onlyCreate) {
            var config = this.config, handlerEls = $(config.handlerEls, this.handlerCon), boxEls = $(config.boxEls, this.boxCon), handlerEl = handlerEls.filter('#' + id);

            if(handlerEl.length > 0) {
                this._showTab(handlerEl, handlerEls, boxEls);

                if(fn && onlyCreate !== true) {
                    fn.call(this, handlerEl, boxEls.eq(handlerEls.index(handlerEl)));
                }
            } else {
                var newHandler = $(handlerHtml).appendTo(this.handlerCon), newBox = $(boxHtml).appendTo(this.boxCon);
                newHandler.attr('id', id);

                this._showTab(handlerEls.length);

                if(fn) {
                    fn.call(this, newHandler, newBox);
                }
                if(config.afterCreate) {
                    config.afterCreate.call(this, newHandler, newBox);
                }
            }
        }
    };
})(dcms, FE.dcms);
