/**
 * @author springyu
 * @userfor ���򵼺�js
 * @date 2011-12-21
 */

;(function($, D) {

    var readyFun = [
    /**
     * ���¼�
     */
    function() {
        $('ul.edit-ul a.desc').bind('click', function(e) {
            e.preventDefault();
            var self = $(this), selfParent = self.parent();
            $('ul.edit-ul li').each(function(index, obj) {
                var _self = $(obj);
                if(_self.hasClass('current')) {
                    _self.removeClass('current');
                }
                _self.children().each(function(index, o) {
                    var _o = $(o);
                    $('#' + _o.data('boptions')).addClass('dcms-box-hide');
                });
            });
            if(!selfParent.hasClass('current')) {
                selfParent.addClass('current');
                var val = self.data('boptions');
                $('#' + val).removeClass('dcms-box-hide');
            }
            if(self.data('page') === 'module') {
                D.cellBase.init(1);
                var _height = $('div.edit-content').css('height');
            }
            D.bottomAttr.resetAttr();
        });

    },
    /**
     * module�����
     * modify by hongss on 2012.05.08 for �����в���Ҫ�ļ���
     */
    function() {
        var layoutContainer = $('.edit-layout'),
            url = "/page/box/queryLayoutAjax.html";
        if(layoutContainer.length > 0) {
            D.getLayoutShowData(url, "layout", layoutContainer);
            
            //add by hongss on 2012.07.30 for ���դ��ϵͳ��ѡ��
            $('#layout-type').change(function(){
                var layoutType = $(this).val();
                D.getLayoutShowData(url, layoutType, layoutContainer);
                
                var grids = getGridsContent(layoutType),
                    doc = $($('#dcms_box_main')[0].contentWindow.document),
                    content = $('#content', doc),
                    link = $('#crazy-box-fdev', doc);
                content.removeClass('w968').removeClass('screen').removeClass('dcms-crazy-box-q952')
                       .removeClass('dcms-crazy-box-q990').removeClass('dcms-crazy-box-h990');
                content.addClass(grids['className']).addClass(grids['class']);
                link.attr('href', grids['link']);
            });
        }
        //add by hongss on 2012.09.06 for add fixed layout
        var fixedContainer = $('.edit-float-layout .content');
        if (fixedContainer.length>0){
            D.getLayoutShowData(url, "layoutFixed", fixedContainer);
        }
        
    },
    
    /**
     *  ����ͨ������
     */
    function(){
        $('#nav-banner').change(function(e){
            var doc = $($('#dcms_box_main')[0].contentWindow.document);
            if ($(this).attr('checked')==='checked'){
                var content = $('#content', doc),
                    bannerHtml = '<div id="crazy-box-banner" style="margin-bottom:0;" data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;��������&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;margin-bottom&quot;,&quot;name&quot;:&quot;�ײ���߾�&quot;,&quot;type&quot;:&quot;input&quot;},{&quot;key&quot;:&quot;width&quot;,&quot;name&quot;:&quot;���&quot;,&quot;type&quot;:&quot;input&quot;,&quot;disable&quot;:&quot;true&quot;}],&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;},&quot;delete&quot;:{&quot;enable&quot;:&quot;true&quot;}}}" data-eleminfo="{&quot;id&quot;:401,&quot;name&quot;:&quot;layout ͨ��&quot;,&quot;className&quot;:&quot;&quot;,&quot;type&quot;:&quot;layout&quot;,&quot;isResponsive&quot;:&quot;N&quot;}">\
                                    <div class="crazy-box-grid" data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;��������&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;width&quot;,&quot;name&quot;:&quot;���&quot;,&quot;type&quot;:&quot;input&quot;,&quot;disable&quot;:&quot;true&quot;},{&quot;key&quot;:&quot;height&quot;,&quot;name&quot;:&quot;�߶�&quot;,&quot;type&quot;:&quot;input&quot;}],&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;row&quot;,&quot;number&quot;:&quot;n&quot;}}}">\
                                        <div class="crazy-box-row cell-row-0" data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;��������&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;height&quot;,&quot;name&quot;:&quot;�߶�&quot;,&quot;type&quot;:&quot;input&quot;}],&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;}}}">\
                                            <div class="crazy-box-box box-100" data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;��������&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;width&quot;,&quot;name&quot;:&quot;���&quot;,&quot;type&quot;:&quot;input&quot;,&quot;disable&quot;:&quot;true&quot;},{&quot;key&quot;:&quot;height&quot;,&quot;name&quot;:&quot;�߶�&quot;,&quot;type&quot;:&quot;input&quot;}],&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;module&quot;,&quot;number&quot;:&quot;1&quot;}}}">\
                                                <div class="crazy-box-module cell-module-0" data-boxoptions="{&quot;css&quot;:[{&quot;key&quot;:&quot;background&quot;,&quot;name&quot;:&quot;��������&quot;,&quot;type&quot;:&quot;background&quot;},{&quot;key&quot;:&quot;height&quot;,&quot;name&quot;:&quot;�߶�&quot;,&quot;type&quot;:&quot;input&quot;},{&quot;key&quot;:&quot;padding&quot;,&quot;name&quot;:&quot;�ڱ߾�&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;margin&quot;,&quot;name&quot;:&quot;��߾�&quot;,&quot;type&quot;:&quot;ginputs&quot;},{&quot;key&quot;:&quot;border&quot;,&quot;name&quot;:&quot;�߿�&quot;,&quot;type&quot;:&quot;border&quot;}],&quot;ability&quot;:{&quot;copy&quot;:{&quot;enable&quot;:&quot;true&quot;}}}">\
                                                    <div class="crazy-box-content" data-boxoptions="{&quot;ability&quot;:{&quot;container&quot;:{&quot;enableType&quot;:&quot;cell&quot;,&quot;number&quot;:&quot;n&quot;}}}"></div>\
                                                </div></div></div></div></div>',
                    banner = $('#crazy-box-banner', doc);
                if (banner.length>0){
                    banner.remove();
                }
                content.before(bannerHtml);
                D.DropInPage.addEnableClass(doc);
            } else {
                $('#crazy-box-banner', doc).remove();
            }
        });
    },
    /**
     * ����༭���ֺ�iframe��λ��
     */
    function() {
        $(window).scroll(autoRight);
        $(window).resize(autoRight);
        setTimeout(autoRight, 50);
    },
    /**
     *
     */
    function() {
        $('#autocratic').bind('mouseup', function() {
            var self = this;
            $('div.attr', 'div.dialog').each(function(index, obj) {
                var _self = $(obj);
                if(_self.css('display') === 'block') {
                    if(!self.checked) {
                        //console.log('ѡ��');
                        $('div.attr-type', _self).each(function(m, o) {
                            var $html = $(o);
                            $html.data('autocratic', 'autocratic');
                        });
                    } else {
                        //console.log('no');
                        $('div.attr-type', _self).each(function(m, o) {
                            var $html = $(o);
                            var extra = $html.data(D.bottomAttr.CONSTANTS['extra']);
                            if(extra && extra.obj && extra.key) {
                                var style = extra.obj[0].style;

                                $html.removeData('autocratic');
                                if(extra.key === 'text') {
                                    D.EditContent.removeStyle({
                                        'elem' : extra.obj,
                                        'key' : 'font-weight',
                                        'isRemoveStyle' : true
                                    });
                                    D.EditContent.removeStyle({
                                        'elem' : extra.obj,
                                        'key' : 'font-size',
                                        'isRemoveStyle' : true
                                    });
                                    D.EditContent.removeStyle({
                                        'elem' : extra.obj,
                                        'key' : 'font-family',
                                        'isRemoveStyle' : true
                                    });
                                    D.EditContent.removeStyle({
                                        'elem' : extra.obj,
                                        'key' : 'color',
                                        'isRemoveStyle' : true
                                    });
                                    style.removeProperty('font-weight');
                                    style.removeProperty('font-size');
                                    style.removeProperty('font-family');
                                    style.removeProperty('color');
                                } else {
                                    D.EditContent.removeStyle({
                                        'elem' : extra.obj,
                                        'key' : extra.key,
                                        'isRemoveStyle' : true
                                    });
                                    style.removeProperty(extra.key);
                                }

                            }

                        });
                    }
                }
            });

        });
    },
    //module
    function() {
        var cModule = $('#content-module');

        cModule.bind('change', function(e) {
            var self = $(this), that = this, $html, contentCell = $('#content-cell');
            var _option = that.options[that.selectedIndex].value;
            switch(_option) {
                case 'fav-module':
                    $('div.edit-content').empty();
                    $('div.dcms-box-page').remove();
                    D.moduleFav.init(1);
                    break;
                case 'module':
                    D.moduleFind.init(1);
                    break;
                case 'cell':
                    D.cellBase.init(1);
                    break;
                default:
                    break;
            }
        });
    },
    function() {
        D.moduleFind.init(1);
    }];

    //add by hongss on 2012.08.01 for getGridsContent
    var q952 = {
            'className': 'w968',
            'class': 'dcms-crazy-box-q952',
            'layoutType': 'layout',
            'link': '/static/fdevlib/css/fdev-v4/core/fdev-float.css'
        },
        q990 = {
            'className': 'screen',
            'class': 'dcms-crazy-box-q990',
            'layoutType': 'layoutQ990',
            'link': '/static/fdevlib/css/fdev-v4/core/fdev-wide.css'
        },
        h990 = {
            'className': 'screen',
            'class': 'dcms-crazy-box-h990',
            'layoutType': 'layoutH990',
            'link': '/static/fdevlib/css/fdev-v4/core/fdev-op.css'
        };
        
    function getGridsContent(layoutType){
        var grids = {};
        switch (layoutType){
            case q952['layoutType']:
                grids = q952;
                break;
            case q990['layoutType']:
                grids = q990;
                break;
            case h990['layoutType']:
                grids = h990;
                break;
        }
        return grids;
    }
    //��ʼ����ǰҳ��ѡ��������դ��
    D.initCurrentGrids = function(doc){
        var elem = $('#content', doc),
            link = $('#crazy-box-fdev', doc),
            select = $('#layout-type');
        if (elem.hasClass(q952['class'])){
            select.val(q952['layoutType']);
            select.trigger('change');
            link.attr('href', q952['link']);
            return;
        }
        if (elem.hasClass(q990['class'])){
            select.val(q990['layoutType']);
            select.trigger('change');
            link.attr('href', q990['link']);
            return;
        }
        if (elem.hasClass(h990['class'])){
            select.val(h990['layoutType']);
            select.trigger('change');
            link.attr('href', h990['link']);
            return;
        }
        
        select.val(q952['layoutType']);
        select.trigger('change');
        link.attr('href', q952['link']);
        return;
    }
    //��ʼ��������ͨ���������Ƿ��
    D.initBannerNav = function(doc){
        if ($('#crazy-box-banner', doc).length>0){
            $('#nav-banner').attr('checked', 'checked');
        }
    }
    
    var defaultShowModule = function() {
        var $html;
        $('div.edit-content').empty();
        $('div.dcms-box-page').remove();
        $('#edit_content dd input').val('');
        $html = D.bottomAttr.getHtml('editmodule');
        $('div.edit-content').append($html);
        D.bottomAttr.bindModuleCatalogColor();
        //event
        D.moduleBind();
    };
    var showCellFind = function() {  
        $('div.edit-content').empty();
        $('div.dcms-box-page').remove();
        $('#edit_content dd input').val('');
        $html = D.bottomAttr.getHtml('editcell');
        var moduleCatalog = JSON.parse(D.storage().getItem('moduleCatalog'));
        if(!moduleCatalog) {
            D.bottomAttr.loadCellModuleCatalog();
            moduleCatalog = JSON.parse(D.storage().getItem('moduleCatalog'));
        }
        var cellCatalog = $('div.cell-catalog', $html), second = moduleCatalog.second, _text = '';

        if(moduleCatalog && second && second instanceof Array) {
            second.unshift({
                'code' : '-1',
                'name' : 'ȫ��',
                'parentCode' : ''
            });

            for(var i = 0, len = second.length; i < len; i++) {
                if(i % 2 === 0) {
                    _text += '<ul class="dcms-box-clear module-catalog-ul">';
                    _text += '<li class="float-left"><a href="#" data-cellcatalog="' + second[i].code + '" class="module-catalog" title="' + second[i].name + '">' + second[i].name + '</a></li>';
                } else {
                    _text += '<li class="float-right"><a href="#" data-cellcatalog="' + second[i].code + '" class="module-catalog" title="' + second[i].name + '">' + second[i].name + '</a></li>';
                    _text += '</ul>'
                }
            }
        }
        cellCatalog.empty();
        cellCatalog.append(_text);
        $('div.edit-content').append($html);
        D.bottomAttr.bindCellCatalogEvent();
        D.cellBind();
    };

    var autoRight = function() {
        D.bottomAttr.resizeWindow();
    };
    // query module favorite
    D.moduleFav = {
        url : '/page/box/queryModuleAjax.html?_input_charset=UTF8',
        init : function(p) {
            var that = this;
            $('div.dcms-box-page').remove();
            that._query(p);
            D.bottomAttr.resizeWindow();
        },
        _query : function(currentPageSize) {
            var urlStr = D.domain + this.url, that = this, content = $('div.edit-content');
            $.ajax({
                url : urlStr,
                type : "POST",
                data : {
                    type : 'fav',
                    currentPageSize : currentPageSize
                },
                success : function(o) {
                    o = $.parseJSON(o);
                    $.use('web-sweet', function() {
                        content.empty();
                        $('div.dcms-box-page').remove();
                        showMessage(o, content);
                        that._page();
                    });
                },
                error : function() {
                    content.html("���ӳ�ʱ�����ԣ�");
                }
            });

        },
        _page : function() {
            var cuPage = 1, that = this;

            $('#upPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage - 1);
                }

            });
            $('#downPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage + 1);
                }
            });
        }
    };
    //module find click event
    D.moduleBind = function() {
        $('#moduleFindBtn').bind('click', function(e) {
            D.moduleFind.init(1);
        });
        $('#keyWords').bind('keypress',function(e){
           var keyCode = e.keyCode?e.keyCode:e.which?e.which:e.charCode;
           if (keyCode===13){
                D.moduleFind.init(1);
              }
        });
        $('#moduleFindCancel').bind('click', function(e) {
            $('#keyWords').val('');
            $('li.selected', 'div.cmodule-catalog').each(function(index, obj) {
                var self = $(obj);
                self.removeClass('selected');
            });
            $('span.selected', 'span.page-color').each(function(index, obj) {
                var self = $(obj), that = obj;
                self.removeClass('selected');
            });
        });
    };
    //module find click event
    D.cellBind = function() {
        $('#moduleFindBtn').bind('click', function(e) {
            D.cellFind.init(1);
        });
        $('#keyWords').bind('keypress',function(e){
           var keyCode = e.keyCode?e.keyCode:e.which?e.which:e.charCode;
           if (keyCode===13){
                D.cellFind.init(1);
            }
        });
        $('#moduleFindCancel').bind('click', function(e) {
            $('#keyWords').val('');
            $('li.selected', 'div.cell-catalog').each(function(index, obj) {
                var self = $(obj);
                self.removeClass('selected');
            });
        });
    };
    // module search
    D.moduleFind = {
        url : '/page/box/queryModuleAjax.html?_input_charset=UTF8',
        init : function(p) {
            var that = this;
            $('div.dcms-box-page').remove();
            that._query(p);
            D.bottomAttr.resizeWindow();
        },
        _query : function(currentPageSize) {
            var urlStr = D.domain + this.url, that = this, content = $('div.edit-content'), catalog = '', moduleColor = '';

            var keyword = $('#keyWords').val();
            catalog = $('#catalog').val();
            moduleColor = $('#moduleColor').val();
            if(catalog && catalog.indexOf('ȫ��') !== -1) {
                catalog = '';
            }
            $.ajax({
                url : urlStr,
                type : "POST",
                data : {
                    type : 'find',
                    keyword : keyword,
                    currentPageSize : currentPageSize,
                    catalog : catalog,
                    moduleColor : moduleColor
                },
                success : function(o) {
                    o = $.parseJSON(o);
                    $.use('web-sweet', function() {
                        content.empty();
                        $('div.dcms-box-page').remove();
                        content.append('<div class="nav-ret" id="nav-ret"><a href="#" id="ret" title="����"><--&nbsp;����</a></div>');
                        showMessage(o, content);
                        content.append('<input type="hidden" id="catalog" name="catalog" value="' + catalog + '">');
                        content.append('<input type="hidden" id="moduleColor" name="moduleColor" value="' + moduleColor + '">');
                        content.append('<input type="hidden" id="keyWords" name="keyWords" value="' + keyword + '">');
                        that._page();
                    });
                },
                error : function() {
                    content.html("���ӳ�ʱ�����ԣ�");
                }
            });
        },
        _page : function() {
            var cuPage = 1, that = this;
            $('#ret').bind('click', function(e) {
                e.preventDefault();
                defaultShowModule();
            });
            $('#upPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage - 1);
                }

            });
            $('#downPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage + 1);
                }
            });
        }
    };
    //��ؼ�
    D.cellBase = {
        url : '/page/box/queryCellAjax.html?_input_charset=UTF8',
        init : function(p) {
            var that = this;

            $('div.dcms-box-page').remove();
            that._query(p);
            D.bottomAttr.resizeWindow();
        },
        _query : function(currentPageSize) {
            var urlStr = D.domain + this.url, that = this, content = $('div.edit-content');
            $.ajax({
                url : urlStr,
                type : "POST",
                data : {
                    type : 'find',
                    currentPageSize : currentPageSize,
                    keyword : '��'
                },
                success : function(o) {
                    o = $.parseJSON(o);
                    $.use('web-sweet', function() {
                        content.empty();
                        $('div.dcms-box-page').remove();
                        content.append('<div class="nav-ret" id="nav-ret"><a href="#" id="ret" title="����"><--&nbsp;����</a></div>');
                        showMessage(o, content);
                        that._page();
                    });
                },
                error : function() {
                    content.html("���ӳ�ʱ�����ԣ�");
                }
            });

        },
        _page : function() {
            var cuPage = 1, that = this;
            $('#ret').bind('click', function(e) {
                e.preventDefault();
                showCellFind();
            });
            $('#upPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage - 1);
                }

            });
            $('#downPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage + 1);
                }
            });
        }
    };
    // cell favorite
    D.cellFav = {
        url : '/page/box/queryCellAjax.html?_input_charset=UTF8',
        init : function(p) {
            var that = this;
            $('div.dcms-box-page').remove();
            that._query(p);
            D.bottomAttr.resizeWindow();
        },
        _query : function(currentPageSize) {
            var urlStr = D.domain + this.url, that = this, content = $('div.edit-content');
            $.ajax({
                url : urlStr,
                type : "POST",
                data : {
                    type : 'fav',
                    currentPageSize : currentPageSize
                },
                success : function(o) {
                    o = $.parseJSON(o);
                    $.use('web-sweet', function() {
                        content.empty();
                        $('div.dcms-box-page').remove();
                        showMessage(o, content);
                        that._page();
                    });
                },
                error : function() {
                    content.html("���ӳ�ʱ�����ԣ�");
                }
            });

        },
        _page : function() {
            var cuPage = 1, that = this;

            $('#upPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage - 1);
                }

            });
            $('#downPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage + 1);
                }
            });
        }
    };

    // cell find
    D.cellFind = {
        url : '/page/box/queryCellAjax.html?_input_charset=UTF8',
        init : function(p) {
            var that = this;
            $('div.dcms-box-page').remove();
            that._query(p);
            D.bottomAttr.resizeWindow();
        },
        _query : function(currentPageSize) {
            var urlStr = D.domain + this.url, that = this, content = $('div.edit-content'), catalogIds = '', keyword = $('#keyWords').val();
            var tag = $('#cellTag').val();
            catalogIds = $('#catalogIds').val();
            if(catalogIds && catalogIds.indexOf('-1') !== -1) {
                catalogIds = '';
            }
            $.ajax({
                url : urlStr,
                type : "POST",
                data : {
                    type : 'find',
                    currentPageSize : currentPageSize,
                    catalogIds : catalogIds,
                    keyword : keyword,
                    tag : tag
                },
                success : function(o) {
                    o = $.parseJSON(o);
                    $.use('web-sweet', function() {
                        content.empty();
                        $('div.dcms-box-page').remove();
                        content.append('<div class="nav-ret" id="nav-ret"><a href="#" id="ret" title="����"><--&nbsp;����</a></div>');
                        showMessage(o, content);
                        content.append('<input type="hidden" id="catalogIds" name="catalogIds" value="' + catalogIds + '">');
                        content.append('<input type="hidden" id="keyWords" name="keyWords" value="' + keyword + '">');
                        content.append('<input type="hidden" id="cellTag" name="cellTag" value="' + tag + '">');
                        that._page();
                    });
                },
                error : function() {
                    content.html("���ӳ�ʱ�����ԣ�");
                }
            });

        },
        _page : function() {
            var cuPage = 1, that = this;
            $('#ret').bind('click', function(e) {
                e.preventDefault();
                showCellFind();
            });

            $('#upPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage - 1);
                }

            });
            $('#downPage').bind('click', function() {//��һҳ
                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    cuPage = parseInt($(this).data('val'));
                    that.init(cuPage + 1);
                }
            });
        }
    };

    var showMessage = function(o, content) {
        var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
        template += '<div class="dcms-box-layoutcontent" data-eleminfo="<%=$data[i].eleminfo%>">';
        template += '<img class="dcms-box-right-image" src="<%= $data[i].imageUrl%>" draggable="false"  />';
        template += '<br><span><%= $data[i].name%></span>';
        template += '</div>';
        template += '<% } %>';
        var data = o['dataList'];
        var html = FE.util.sweet(template).applyData(data);
        var type = o['type'], pageNavStr = '', pageNav = $('#page_nav');
        var countPage = o['pageSize'];
        var $page = '';
        if(countPage > 1) {
            $page += '<div class="dcms-box-page dcms-box-clear"><ul class="">';
            if(o['currentPage'] === 1) {
                $page += '<li class="disabled"><a href="#" class="pre" data-val=' + o['currentPage'] + ' id="upPage">��һҳ</a></li>';
            }
            if(o['currentPage'] !== 1) {
                $page += '<li><a href="#" class="pre" data-val=' + o['currentPage'] + ' id="upPage">��һҳ</a></li>';
            }

            $page += '<li>' + o['currentPage'] + ' / ' + countPage + '</li>';
            if(o['currentPage'] !== countPage) {
                $page += '<li><a href="#" class="next" data-val=' + o['currentPage'] + '  id="downPage">��һҳ</a></li>';
            }
            if(o['currentPage'] === countPage) {
                $page += '<li class="disabled"><a href="#" class="next" data-val=' + o['currentPage'] + '  id="downPage">��һҳ</a></li>';
            }
            $page += '</ul></div>';

        }
        content.append(html);
        content.after($page);
        if (data&&data.length<=0){
            content.append('<div>��ѯ���Ϊ�գ�</div>');
        }
    };

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
    /**
     * @author roobin.lij
     * @userfor ��Ⱦҳ������Ҳ�layout���
     * @date 2012-01-07
     */
    D.getLayoutShowData = function(url, type, content, callback) {
        var urlStr = D.domain + url;
        $.ajax({
            url : urlStr,
            dataType : "jsonp",
            data : {
                type : type
            },
            success : function(o) {
                $.use('web-sweet,util-json', function() {
                    var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
                    template += '<div class="dcms-box-layoutcontent" data-eleminfo="<%=$data[i].eleminfo%>">';
                    template += ' <img class="dcms-box-right-image" src="<%= $data[i].imageUrl%>" draggable="false">';
                    template += ' <br><span><%= $data[i].name%></span>';
                    template += '  </div>';
                    template += '  <% } %>';
                    var data = o['dataList'];
                    var html = FE.util.sweet(template).applyData(data);
                    content.empty();
                    content.html(html);
                });
            },
            error : function() {
                content.html("���ӳ�ʱ�����ԣ�");
            }
        });
    };

    D.contentInit = function(type, kw) {
        var cuPage = 1, content = $('div.edit-content'), txt;
        if(type === 'find') {
            txt = {
                'key' : $('#keyWords').val(),
                'id' : kw.id
            };
        }
        if(kw.key === '��') {
            txt = {
                'key' : kw.key,
                'id' : kw.id
            };
        }
        $('#upPage').bind('click', function() {//��һҳ
            var self = $(this), selfParent = self.parent();
            if(!selfParent.hasClass('disabled')) {
                cuPage = parseInt($(this).data('val'));
                D.getCellShowData("/page/box/queryCellAjax.html?_input_charset=UTF8", type, content, cuPage - 1, txt);
            }

        });
        $('#downPage').bind('click', function() {//��һҳ
            var self = $(this), selfParent = self.parent();
            if(!selfParent.hasClass('disabled')) {
                cuPage = parseInt($(this).data('val'));
                D.getCellShowData("/page/box/queryCellAjax.html?_input_charset=UTF8", type, content, cuPage + 1, txt);
            }
        });

    };

    /**
     * @author roobin.lij
     * @userfor ��Ⱦҳ������Ҳ�cell���
     * @date 2012-01-07
     */
    D.getCellShowData = function(url, type, content, currentPageSize, keyword, callback) {
        var urlStr = D.domain + url, key, id;
        if(keyword && keyword.key) {
            key = keyword.key;
        }
        if(keyword && keyword.id) {
            id = keyword.id;
        }
        $.ajax({
            url : urlStr,
            // dataType: "jsonp",
            type : "POST",
            data : {
                type : type,
                currentPageSize : currentPageSize,
                keyword : key,
                catalogId : id
            },
            success : function(o) {
                o = $.parseJSON(o);
                $.use('web-sweet', function() {
                    var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>';
                    template += '<div class="dcms-box-layoutcontent" data-eleminfo="<%=$data[i].eleminfo%>">';
                    template += '<img class="dcms-box-right-image" src="<%= $data[i].imageUrl%>" draggable="false"  />';
                    template += '<br><span><%= $data[i].name%></span>';
                    template += '</div>';
                    template += '<% } %>';
                    var data = o['dataList'];
                    var html = FE.util.sweet(template).applyData(data);
                    var type = o['type'], pageNavStr = '', pageNav = $('#page_nav');
                    var countPage = o['pageSize'];
                    var $page = '';
                    if(countPage > 1) {
                        $page += '<div class="dcms-box-page dcms-box-clear"><ul class="">';
                        if(o['currentPage'] === 1) {
                            $page += '<li class="disabled"><a href="#" class="pre" data-val=' + o['currentPage'] + ' id="upPage">��һҳ</a></li>';
                        }
                        if(o['currentPage'] !== 1) {
                            $page += '<li><a href="#" class="pre" data-val=' + o['currentPage'] + ' id="upPage">��һҳ</a></li>';
                        }

                        $page += '<li>' + o['currentPage'] + ' / ' + countPage + '</li>';
                        if(o['currentPage'] !== countPage) {
                            $page += '<li><a href="#" class="next" data-val=' + o['currentPage'] + '  id="downPage">��һҳ</a></li>';
                        }
                        if(o['currentPage'] === countPage) {
                            $page += '<li class="disabled"><a href="#" class="next" data-val=' + o['currentPage'] + '  id="downPage">��һҳ</a></li>';
                        }
                        $page += '</ul></div>';

                    }
                    content.empty();

                    $('div.dcms-box-page').remove();
                    content.html(html);
                    content.after($page);
                    //if('��' === keyword) {
                    D.contentInit(type, keyword);
                    //} else {
                    // D.contentInit(type);
                    // }
                });
            },
            error : function() {
                content.html("���ӳ�ʱ�����ԣ�");
            }
        });
    };

     /**
     * @author roobin.lij   
     * @userfor ��ѯ���Դ
     * @date 2012-05-14
     */
    FE.dcms.getDssData = function(url,hiddenJson){
        $.ajax({
            url: url,
            type: "POST",
            data : {
                dsModuleData :encodeURIComponent( hiddenJson)
            },
            success: function(o){
             D.storage().setItem('dssJson' ,o);
            },
            error : function(){
            	return ;
            }
        });
    };
})(dcms, FE.dcms);
