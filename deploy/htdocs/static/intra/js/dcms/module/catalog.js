/**
 * @usefor catalog
 * @author hongss
 * @date 2011.11.22
 * 
 */
 
;(function($, D, undefined){
    /**
     * @methed popTree 类目树
     * @param dialog 浮出层元素ID，用于展示整个类目数
     * @param strUrl 获取数据的接口地址
     */
    D.PopTree = function(config){
        this._init(config);
    }
    
    D.PopTree.defConfig = {
        dialogEl: $('#dgPopTree'),   //类目对话框
        isDialog: true,    //是否使用弹出框
        container: '.treePanel',   //承载树结构的容器
        cancelEls: '.close-btn, .cancel-btn',  //取消关闭按钮
        submitBtn: '.submit-btn',   //“确定”按钮
        strUrl: '/admin/catalog.html',   //ajax请求URL
        modify: null  //当点下确定按钮后的回调函数
    }
    
    D.PopTree.CONSTANTS = {
        CATALOG_INFO: 'cataloginfo',
        CONTENT_TEMPLATE: '<dl class="dcms-tree-wrapper">'+  //类目树结构模板
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
                    container.html('加载数据提示：'+o.msg);
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
            //绑定“关闭”、“取消”按钮事件
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
                //绑定“确定”按钮事件
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
         * @methed show 显示类目树
         * @param triggerEl 触发显示的元素
         * @param inputEl 显示类目名称的输入框
         * @param hiddenEl 存储类目ID的隐藏域
         * @param showDialog 是否显示类目选择对话框
         */
        show: function(triggerEl, inputEl, hiddenEl, modify, showDialog){
            if ($.type(modify)==='boolean'){
				showDialog = modify;
				modify = null;
			}
			showDialog = (typeof showDialog==='undefined') ? true : showDialog;  //默认为显示
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
            // 如果有资源站点，则传进去
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
         * @methed _setValue 设置值
         * @param el 需要设置值的元素
         * @param val 值的内容
         */
        _setValue: function(el, val){
            if (el[0] && el[0].nodeName.toUpperCase()==='INPUT'){
                return (typeof val!=='undefined') ? el.val(val) : el.val();
            } else {
                return (typeof val!=='undefined') ? el.text(val) : el.text();
            }
        },
        /**
         * @methed _clickCheckbox 单击checkbox后的方法
         * @param el 被单击的checkbox
         * @param treeObj 对应的树对象
         */
        _clickCheckbox: function(el, treeObj){
            var parentEl = el.parent('dt.dcms-tree-name'),
            CATALOG_INFO = D.PopTree.CONSTANTS.CATALOG_INFO,
            elData = parentEl.data(CATALOG_INFO), id;
            if (!elData){ return; };
            id = elData['id'];
            
            if (!!el.filter(':checked').length) {
                //当单击的checkbox被选中时, 选中所有的其父级节点
                var parentNames = treeObj.showChooseNodes(id, true, false);
            } else {
                //当单击的checkbox取消选中时，将其子节点都取消选择
                parentEl.next('.dcms-tree-list').find('input:checked').attr('checked', false);
                //判断其父级元素是否有权限，如果无权限且同级元素未被选中的则取消父级节点的选择
                var parentId = elData['parentId'],
                checkedBoxes = el.parents('dd.dcms-tree-list').eq(0).find('input:checked'),
                disabled = (parentId) ? treeObj.config.data[parentId]['disabled'] : false;
                if (disabled===true && checkedBoxes.length===0){  //
                    treeObj.showChooseNodes(id, 'setFalse', false);
                }
            }
        },
        /**
         * @methed _getValue 获取所选择的值
         * @param input 输入框
         * @param treeObj 对应的树对象
         */
        _getValue: function(treeObj){
            var checkedInputs = $('input:checked', treeObj.el),
            CATALOG_INFO = D.PopTree.CONSTANTS.CATALOG_INFO,
            chekedIds = [], parentNames='';
            //剔选出真正被选择的节点ID
            checkedInputs.each(function(){
                var el = $(this).parent(),
                silbingEl = el.next('.dcms-tree-list');
                if (!silbingEl.find('input:checked').length){
                    chekedIds.push(el.data(CATALOG_INFO)['id']);
                }
            });
            //收集各个被选择节点的父辈name
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