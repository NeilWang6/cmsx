/**
 * @usefor catalog
 * @author hongss
 * @date 2011.11.22
 * 
 */
 
;(function($, D, undefined){
    /**
     * @methed popTree ��Ŀ��
     * @param dialog ������Ԫ��ID������չʾ������Ŀ��
     * @param strUrl ��ȡ���ݵĽӿڵ�ַ
     */
    D.PopTree = function(config){
        this._init(config);
    }
    
    D.PopTree.defConfig = {
        dialogEl: $('#dgPopTree'),   //��Ŀ�Ի���
        isDialog: true,    //�Ƿ�ʹ�õ�����
        container: '.treePanel',   //�������ṹ������
        cancelEls: '.close-btn, .cancel-btn',  //ȡ���رհ�ť
        submitBtn: '.submit-btn',   //��ȷ������ť
        strUrl: '/admin/catalog.html',   //ajax����URL
        modify: null  //������ȷ����ť��Ļص�����
    }
    
    D.PopTree.CONSTANTS = {
        CATALOG_INFO: 'cataloginfo',
        CONTENT_TEMPLATE: '<dl class="dcms-tree-wrapper">'+  //��Ŀ���ṹģ��
                          '<dt class="dcms-tree-name" data-disable="{disabled}"><span class="i-treebtn"></span><input type="checkbox" autocomplete="off" /> {name} ({id})</dt>'+  // class="tree-checkbox-{id}"
                          '<dd class="dcms-tree-list dcms-tree-list-{id}" ></dd>'+
                          '</dl>'
        
    }
    
    D.PopTree.ajaxRequest = function(url, container, fn){   
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(o){
                if (o.status==='200'){
                    var data = o.data,
                    self = this;
                    fn.call(self, data);  
                    D.PopTree.ajaxRequest = function(url, container, fn){ 
                        return fn.call(self, data);
                    }
                } else {
                    container.html('����������ʾ��'+o.msg);
                }
            }
        });
    }
    
    D.PopTree.prototype = {
        _init: function(config){
            var defConfig = $.extend({}, D.PopTree.defConfig);
            this.config = $.extend(defConfig, config);
            var self = this,
            config = this.config,
            dialogEl = config.dialogEl,
            container = $(config.container, dialogEl),
            cancelEls = $(config.cancelEls, dialogEl),
            submitBtn = $(config.submitBtn, dialogEl);
            
            container.html('');
            //�󶨡��رա�����ȡ������ť�¼�
            if (cancelEls && cancelEls.length){
                cancelEls.click(function(e){
                    e.preventDefault();
                    if (self.categoryDialog){
                        self.categoryDialog.dialog('close');
                        self.categoryTree.resetNodes(true);
                        
                        self.hiddenEl.val(cancelEls.eq(0).data('categoryids'));
                        self._setValue(self.inputEl, cancelEls.eq(0).data('categorynames'));
                        //self.inputEl.val(cancelEls.eq(0).data('categorynames'));
                    }
                    
                });
            }
            
            if (submitBtn && submitBtn.length){
                //�󶨡�ȷ������ť�¼�
                submitBtn.click(function(e){
                    if (self.categoryDialog){
                        self.categoryDialog.dialog('close');
                        self.categoryTree.resetNodes(true);
                        if (config.modify && $.isFunction(config.modify)){
                            config.modify.call(self, self.inputEl.val(), self.hiddenEl.val());
                        }
                    }
                    
                });
            }
            
            $('input:checkbox', container).live('click', function(e){
                e.stopPropagation();
                var el = $(this);
                self._clickCheckbox(el, self.categoryTree);
                self._getValue(self.categoryTree);
            });
        },
        /**
         * @methed show ��ʾ��Ŀ��
         * @param triggerEl ������ʾ��Ԫ��
         * @param inputEl ��ʾ��Ŀ���Ƶ������
         * @param hiddenEl �洢��ĿID��������
         * @param showDialog �Ƿ���ʾ��Ŀѡ��Ի���
         */
        show: function(triggerEl, inputEl, hiddenEl, modify, showDialog){
            if ($.type(modify)==='boolean'){
				showDialog = modify;
				modify = null;
			}
			showDialog = (typeof showDialog==='undefined') ? true : showDialog;  //Ĭ��Ϊ��ʾ
            var self = this,
            config = self.config,
            dialogEl = config.dialogEl,
            cancelEls = $(config.cancelEls, dialogEl),
            container = $(config.container, dialogEl),
            position, strTop, strLeft;
            
            self.hiddenEl = hiddenEl;
            self.inputEl = inputEl;
			if (modify && $.isFunction(modify)===true){
				self.config.modify = modify;
			}
            
            if (config.isDialog===true && showDialog===true){
                position = triggerEl.offset();
                strTop = parseInt(position.top) - parseInt($(document).scrollTop());
                strLeft = position.left - $(document).scrollLeft() + triggerEl.width();
                
                cancelEls.eq(0).data('categoryids', hiddenEl.val());
                cancelEls.eq(0).data('categorynames', self._setValue(inputEl));
                /* if (inputEl[0].tagName.toUpperCase()==='INPUT'){
                    cancelEls.eq(0).data('categorynames', inputEl.val());
                } else {
                    cancelEls.eq(0).data('categorynames', inputEl.text());
                } */
                
                $.use('ui-dialog', function(){
                    self.categoryDialog = dialogEl.dialog({
                        modal: false,
                        css: {
                            top: strTop,
                            left: strLeft
                        }
                    });
                });
            }
            
            var _tmp = config.strUrl ;
            // �������Դվ�㣬�򴫽�ȥ
            var _resourceSiteId = $('#resourceSiteId').val();
            if( _resourceSiteId){
            	_tmp += "?resourceSiteId=" +_resourceSiteId;
            }
            D.PopTree.ajaxRequest(_tmp, container, function(data){ 
                var ids = hiddenEl.val().split(',');
                if (!self.categoryTree){
                    self.categoryTree = new D.Tree(container, {
                        data: data,
                        template: D.PopTree.CONSTANTS.CONTENT_TEMPLATE,
                        append: function(data){
                            if (data.disabled && data.disabled===true){
                                this.find('input:checkbox').attr('disabled', 'disabled');
                            }
                        }
                    });
                }
                self._setValue(inputEl, self.categoryTree.showChooseNodes(ids, true).join());
                /*if (inputEl[0].tagName.toUpperCase()==='INPUT'){
                    inputEl.val(self.categoryTree.showChooseNodes(ids, true));
                } else {
                    inputEl.text(self.categoryTree.showChooseNodes(ids, true));
                }*/
                
            });
        },
        /**
         * @methed _setValue ����ֵ
         * @param el ��Ҫ����ֵ��Ԫ��
         * @param val ֵ������
         */
        _setValue: function(el, val){
            if (el[0] && el[0].nodeName.toUpperCase()==='INPUT'){
                return (typeof val!=='undefined') ? el.val(val) : el.val();
            } else {
                return (typeof val!=='undefined') ? el.text(val) : el.text();
            }
        },
        /**
         * @methed _clickCheckbox ����checkbox��ķ���
         * @param el ��������checkbox
         * @param treeObj ��Ӧ��������
         */
        _clickCheckbox: function(el, treeObj){
            var parentEl = el.parent('dt.dcms-tree-name'),
            CATALOG_INFO = D.PopTree.CONSTANTS.CATALOG_INFO,
            elData = parentEl.data(CATALOG_INFO), id;
            if (!elData){ return; };
            id = elData['id'];
            
            if (!!el.filter(':checked').length) {
                //��������checkbox��ѡ��ʱ, ѡ�����е��丸���ڵ�
                var parentNames = treeObj.showChooseNodes(id, true, false);
            } else {
                //��������checkboxȡ��ѡ��ʱ�������ӽڵ㶼ȡ��ѡ��
                parentEl.next('.dcms-tree-list').find('input:checked').attr('checked', false);
                //�ж��丸��Ԫ���Ƿ���Ȩ�ޣ������Ȩ����ͬ��Ԫ��δ��ѡ�е���ȡ�������ڵ��ѡ��
                var parentId = elData['parentId'],
                checkedBoxes = el.parents('dd.dcms-tree-list').eq(0).find('input:checked'),
                disabled = (parentId) ? treeObj.config.data[parentId]['disabled'] : false;
                if (disabled===true && checkedBoxes.length===0){  //
                    treeObj.showChooseNodes(id, 'setFalse', false);
                }
            }
        },
        /**
         * @methed _getValue ��ȡ��ѡ���ֵ
         * @param input �����
         * @param treeObj ��Ӧ��������
         */
        _getValue: function(treeObj){
            var checkedInputs = $('input:checked', treeObj.el),
            CATALOG_INFO = D.PopTree.CONSTANTS.CATALOG_INFO,
            chekedIds = [], parentNames='';
            //��ѡ��������ѡ��Ľڵ�ID
            checkedInputs.each(function(){
                var el = $(this).parent(),
                silbingEl = el.next('.dcms-tree-list');
                if (!silbingEl.find('input:checked').length){
                    chekedIds.push(el.data(CATALOG_INFO)['id']);
                }
            });
            //�ռ�������ѡ��ڵ�ĸ���name
            for (var i=0, l=chekedIds.length; i<l; i++){
                var parents = treeObj.getParents(chekedIds[i]),
                parentsName = '';
                for (var j=0, n=parents.length; j<n; j++){
                    if (j===n-1){
                        parentsName += parents[j]['name'];
                        continue;
                    }
                    parentsName += parents[j]['name']+'->';
                }
                if (i===l-1){
                    parentNames += parentsName;
                    continue;
                }
                parentNames += parentsName+', ';
            }
            //this.inputEl.val(parentNames);
            this._setValue(this.inputEl, parentNames);
            this.hiddenEl.val(chekedIds);
        }
    };
    
})(dcms, FE.dcms);