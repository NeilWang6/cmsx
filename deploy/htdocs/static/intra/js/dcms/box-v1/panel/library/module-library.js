/**
 * @author springyu
 * @userfor  查询组件库信息
 * @date  2012-12-25
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

(function($, D, panel) {
    var library = panel.library;

    library.Module = {
        /**
         * 初始化组件库
         * @param {Object} p
         */
        init : function(p) {
            var that = this;
            $('div.dcms-box-page').remove();
            that._query(p);
            D.bottomAttr.resizeWindow();
        },
        /**
         * 查询组件库
         * @param {Object} p
         */
        _query : function(p) {
            var that = this, url = that.CONSTANTS.REQUEST_LIBRARY_URL, content = $('div.edit-content');

            var keyword = $('#moduleKeyWords').val(), catalog = $('#catalog_id', '.find-bar').val(), libraryType = $('#library_type').val();

            // 扩展别的属性，如标签
            var data = $.extend({
                pageSize : 5,
                libraryType : 'library',
                resourceType : "pl_module"
            }, p || {});
            if(keyword) {
                data.keyword = keyword;
            }
            if(catalog) {
                data.catalogId = catalog;
            } else {
                delete data.catalogId;
            }

            data.type = 'find';
            if(libraryType) {
                data.libraryType = libraryType;
                if(libraryType === 'personal') {
                    //url = that.CONSTANTS.REQUEST_PERSONAL_LIBRARY_URL;
                }
                if(libraryType === 'favorit') {
                    data.type = 'fav-module';
                    url = that.CONSTANTS.REQUEST_FAVORIT_LIBRARY_URL;
                }
            }

            $.ajax({
                url : url,
                type : "POST",
                data : data,
                success : function(o) {
                    o = $.parseJSON(o);
                    content.empty();
                    $('div.dcms-box-page').remove();
                    content.append('<div class="find-bar"><div class="find-row"><select id="library_type"></select><label id="module_catalog"></label><div class="catalog-content"><select id="first_catalog_id" name="firstCatalogId"></select><select id="catalog_id"  name="catalogId"></select><span class="dcms-validator-tip"></span></div></div><div class="find-row"><input type="text" id="moduleKeyWords" value=""><a href="#" class="search" id="searchModule">搜索</a></div></div>');
                    if(o && o.data) {
                        o = o.data;
                    }
                    $.use('web-sweet', function() {
                        var pageOption = {
                            "id" : "module-page",
                            "display" : "none"
                        };
                        library.showMessage(o, content, pageOption);
                        if(data) {
                            if(data.catalogId) {
                                $("#module_catalog").data('value', data.catalogId);
                            }
                            if(data.keyword) {
                                $("#moduleKeyWords").val(data.keyword);
                            }

                            data.showPage && ($("#module-page").show());
                            D.bottomAttr.resizeWindow();
                        }

                        that._page(data);
                        that._catalogInit();
                        library.libraryTypeInit(data.libraryType, function(selected) {
                            if(selected === 'favorit') {
                                $('.catalog-content').hide();
                                $('#library_type').css('width', '160px');
                            } else {
                                $('#library_type').removeAttr('style');
                                $('.catalog-content').css('display', 'inline-block');
                            }
                        });

                    });
                },
                error : function() {
                    console.log("连接超时请重试！");
                }
            });
        },
        /**
         * 分页事件邦定
         * @param {Object} query
         */
        _page : function(query) {
            var cuPage = 1, that = this;

            var searchFn = function() {
                var data = {
                    "showPage" : true
                };
                data = $.extend(data, query);
                data.currentPageSize = 1;
                $('#module-page').show();
                delete data.tag;
                delete data.keyword;
                delete data.catalogId;
                delete data.libraryType;
                that.init(data);
            };
            $("#searchModule").bind('click', function(e) {
                e.preventDefault();
                searchFn();
            });
            $('#moduleKeyWords').bind('keypress', function(e) {
                var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                if(keyCode === 13) {
                    searchFn();
                }
            });
            $('#upPage').bind('click', function() {// 上一页
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    query = $.extend(query, {
                        currentPageSize : cuPage - 1,
                        "showPage" : true
                    });
                    that.init(query);
                }

            });
            $('#downPage').bind('click', function() {// 下一页
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    query = $.extend(query, {
                        currentPageSize : cuPage + 1,
                        "showPage" : true
                    });
                    that.init(query);
                }
            });

        },
        /**
         * 类目加载
         */
        _catalogInit : function() {
            var that = this, url = that.CONSTANTS.REQUEST_MODULE_CATALOG_URL;
            cascadeModule = new D.CascadeSelect(url, {
                params : {
                    type : 'module',
                    catalogId : '0'
                },
                container : 'module_catalog',
                htmlCode : ''
            });
            cascadeModule.init();
        }
    };
    //常量定义
    library.Module.CONSTANTS = {
        REQUEST_LIBRARY_URL : D.domain + '/page/box/queryModuleAjax.html?_input_charset=UTF8', //请求素材库URL
        REQUEST_PERSONAL_LIBRARY_URL : D.domain + '/page/box/queryPersonalLib.html?_input_charset=UTF8', //请求个人库url
        REQUEST_FAVORIT_LIBRARY_URL : D.domain + '/page/box/queryModuleAjax.html?_input_charset=UTF8', //请求个人收藏url
        REQUEST_MODULE_CATALOG_URL : D.domain + '/page/box/query_module_catalog.html?_input_charset=UTF8', //加载类目URL

    };
})(dcms, FE.dcms, FE.dcms.box.panel);
