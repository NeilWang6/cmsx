/**
 * @author springyu
 * @userfor  ��ѯ�ؼ�����Ϣ
 * @date  2012-12-25
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

(function($, D, panel) {
    var library = panel.library;
    // �����ؼ�
    library.Cell = {
        url : '/page/box/queryCellAjax.html?_input_charset=UTF8',
        init : function(p) {
            var that = this;
            $('div.dcms-box-page').remove();
            if( typeof p === 'object') {
                that._query(p);
            } else {
                that._query({
                    type : 'find',
                    currentPageSize : p
                });
            }

            // console.log('pingchun.yupc');
            D.bottomAttr.resizeWindow();
        },
        _query : function(p) {
            var that = this, url = that.CONSTANTS.REQUEST_LIBRARY_URL, content = $('div.edit-content');
            var keyword = $('#moduleKeyWords').val(), catalog = $('#catalog_id', '.find-bar').val(), libraryType = $('#library_type').val();

            // ��չ������ԣ����ǩ
            var data = $.extend({
                libraryType : 'library',
                resourceType : "pl_cell"
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
                    url = that.CONSTANTS.REQUEST_PERSONAL_LIBRARY_URL;
                }
                if(libraryType === 'favorit') {
                    data.type = 'fav-cell';
                    url = that.CONSTANTS.REQUEST_FAVORIT_LIBRARY_URL;
                }
            }
            $.ajax({
                url : url,
                type : "POST",
                data : data,
                success : function(o) {
                    o = $.parseJSON(o);
                    if(o && o.data) {
                        o = o.data;
                    }
                    content.empty();
                    $('div.dcms-box-page').remove();
                    // content.append('<div class="nav-ret" id="nav-ret"><a href="#" id="ret" title="����"><--&nbsp;����</a></div>');
                    content.append('<div class="find-bar"><div class="find-row"><select id="library_type"></select><label id="cell_catalog"></label><div class="catalog-content"><select id="first_catalog_id" name="firstCatalogId"></select><select id="catalog_id"  name="catalogId"></select><span class="dcms-validator-tip"></span></div></div><div class="find-row"><input type="text" id="moduleKeyWords" value=""><a href="#" class="search" id="searchModule">����</a></div></div>');
                    $.use('web-sweet', function() {
                        library.showMessage(o, content);

                    });
                    if(data) {
                        if(data.catalogId) {
                            $("#cell_catalog").data('value', data.catalogId);
                        }
                        if(data.keyword) {
                            $("#moduleKeyWords").val(data.keyword);
                        }

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
                },
                error : function() {
                    content.html("���ӳ�ʱ�����ԣ�");
                }
            });

        },
        _page : function(query) {
            var cuPage = 1, that = this;
            var searchFn = function() {
                var data = {
                };
                data = $.extend(data, query);
                data.currentPageSize = 1;
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

            $('#upPage').bind('click', function() {// ��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    var data = $.extend(query, {
                        currentPageSize : cuPage - 1,

                    });
                    that.init(data);
                }

            });
            $('#downPage').bind('click', function() {// ��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    var data = $.extend(query, {
                        currentPageSize : cuPage + 1,

                    });
                    that.init(data);
                }
            });

        },
        /**
         * ��Ŀ����
         */
        _catalogInit : function() {
            var that = this, url = that.CONSTANTS.REQUEST_CELL_CATALOG_URL;
            var cascadeModule = new D.CascadeSelect(url, {
                params : {
                    type : 'cell',
                    catalogId : '0'
                },
                container : 'cell_catalog',
                htmlCode : ''
            });
            cascadeModule.init();
        }
    };
    //��������
    library.Cell.CONSTANTS = {
        REQUEST_LIBRARY_URL : D.domain + '/page/box/queryCellAjax.html?_input_charset=UTF8', //�����زĿ�URL
        REQUEST_PERSONAL_LIBRARY_URL : D.domain + '/page/box/queryPersonalLib.html?_input_charset=UTF8', //������˿�url
        REQUEST_FAVORIT_LIBRARY_URL : D.domain + '/page/box/queryCellAjax.html?_input_charset=UTF8', //��������ղ�url
        REQUEST_CELL_CATALOG_URL : D.domain + '/page/box/query_module_catalog.html?_input_charset=UTF8', //������ĿURL
    };
})(dcms, FE.dcms, FE.dcms.box.panel);
