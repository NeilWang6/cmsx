/**
 * 盒子布局 模版和组件级联类目展示
 * @author springyu
 */

;(function($, D) {
    /**
     * 级联下拉控件
     * @param {Object} url  请求数据URL 使用json
     * 默认返回数据格式如下：{"status":"success","data":[{"level":"1","name":"今天","code":"6292","parentCode":"0"},{"level":"1","name":"土狼","code":"6295","parentCode":"0"},{"level":"1","name":"明天","code":"6297","parentCode":"0"}],"msg":""}
     * @param {Object} options 初始化参数
     */
    var CascadeSelect = function(url, options) {
        var _options = {
            id : 'catalog_id',
            parentId : 'first_catalog_id',
            parentPlaceHolder : '一级类目',
            placeHolder : '二级类目',
            htmlCode : '<div class="catalog-content"><select class="parent" id="first_catalog_id" name="firstCatalogId"></select><select class="child" id="catalog_id"  name="catalogId"></select><span class="dcms-validator-tip"></span></div>'
        };
        this.url = url;
        this.options = $.extend({}, _options, options);
        this.container = $('#' + this.options.container);
        this.postion = this.options.postion;
        if(this.options.htmlCode) {
            var $htmlCode = $(this.options.htmlCode), _$parent = $htmlCode.find('.parent'), _$child = $htmlCode.find('.child');
            _$parent.attr('id', this.options.parentId);
            if(this.options.parentName) {
                _$parent.attr('name', this.options.parentName);
            }
            _$child.attr('id', this.options.id);
            if(this.options.parentName) {
                _$child.attr('name', this.options.name);
            }
            switch(this.postion) {
                case 'after':
                    this.container.after($htmlCode);
                    break;
                case 'before':
                    this.container.before($htmlCode);
                    break;
                default:
                    this.container.append($htmlCode);
                    break;

            }

        }
        this.parent = $('#' + this.options.parentId, this.container.parent());
        this.id = $('#' + this.options.id, this.container.parent());

        this.id.attr('data-valid', '{required:true,key:"' + this.options.placeHolder + '"}');

    };
    CascadeSelect.prototype = {
        constructor : CascadeSelect,
        init : function() {
            var self = this;

            $.post(self.url, self.options.params, function(json) {
             
                if(json && json.status === 'success') {
                    self.parent.data('json', (json.data));
                    self._handleSelect();
                }
            }, 'json');
        },
        _handleSelect : function() {
            var self = this, json, object;
            self.parent.empty();
            self.parent.append("<option selected value=''>" + self.options.parentPlaceHolder + "</option>");
            self.id.append("<option selected value=''>" + self.options.placeHolder + "</option>");
           
            json = self.parent.data('json');
              
            if(json) {
                var value = self.container.data('value'), parentValue = '';
                (function() {
                	
                    for(var i = 0; i < json.length; i++) {
                        object = json[i];
                        if(parseInt(object.level) === 1) {
                            self.parent.append('<option value="' + object.code + '">' + object.name + '</option>');
                        } else {
                            if(value) {
                                if(parseInt(value) === parseInt(object.code)) {
                                    parentValue = object.parentCode;
                                }
                            }
                        }

                    }
                    //需要增加-1:未分类 的选项
                    if(self.options.extraValue){
                    	self.parent.append(self.options.extraValue);
                    }
                    
                })();

                (function() {
                    self.id.empty();
                    
                    if(value && value == -1) {            		
                    	self.id.append(self.options.extraValue);
                    	self.parent.val(-1);
                    }else{
                    	self.id.append("<option value=''>" + self.options.placeHolder + "</option>");
                        self.parent.val(parentValue);
                           
                		for(var i = 0; i < json.length; i++) {
                            object = json[i];
                            if(parseInt(parentValue) === parseInt(object.parentCode)) {
                                if(value && parseInt(value) === parseInt(object.code)) {
                                    self.id.append('<option selected value="' + object.code + '">' + object.name + '</option>');
                                } else {
                                    self.id.append('<option value="' + object.code + '">' + object.name + '</option>');
                                }

                            }
                        }
                    }
                    
                })();

                self.parent.bind('change', function(event) {
                    var parentId = self.parent.val();
                    self.id.empty();
                    //增加-1：未分类
                    if(parseInt(parentId) === -1){
                    	self.id.append(self.options.extraValue);                   	
                        return;
                    }
                    
                    self.id.append("<option value='' selected>" + self.options.placeHolder + "</option>");
                    for(var i = 0; i < json.length; i++) {
                        object = json[i];
                        if(parseInt(parentId) === parseInt(object.parentCode)) {
                            self.id.append('<option value="' + object.code + '">' + object.name + '</option>');
                        }
                    }

                });
            }

        }
    };

    D.CascadeSelect = CascadeSelect;
})(dcms, FE.dcms);
