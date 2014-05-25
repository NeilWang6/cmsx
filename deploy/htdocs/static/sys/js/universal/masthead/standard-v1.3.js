/**
 * masthead js
 * @version 1.4.110602 // add search tab
 * @author  Edgar
 */


(function( $, S ){
    
    var _init = function( item ){
            item.init();
        },
        _load = function( name ){
            var path = 'http://{h}/{type}/sys/universal/masthead/{name}.{type}?v={v}',
                substitute = $.util.substitute;
            $.loadCSS( substitute( path, {
                h: $.styleDomain,
                name: name + '-v1.3',
                type: 'css',
                v: '1.3'
            } ) );
            $.getScript( substitute( path, {
                h: $.styleDomain,
                name: name + '-v1.3',
                type: 'js',
                v: '1.3'
            } ) );
        },
        //注册功能点
        register = function( name ){
            var _this = this;
            if ( 'string' === typeof name ){
                _load(name);
                return;
            }
            $.each( name, function( i, item ){
                $(document).ready(function(){
                    _init(item);
                });
            } );
        };
    
    S.masthead = {
        //搜索类型映射表
        SEARCH_TYPE_MAP: {
            combo: {
                'url': 'http://s.1688.com/combo/index.htm',
                'action': 'http://s.1688.com/search/smart_search.htm',
                'placeholder': '输入关键词'
            },
            product: {
                'url': 'http://page.1688.com/buy/index.html',
                'action': 'http://s.1688.com/search/offer_search.htm',
                'placeholder': '输入产品名称'
            },
            company: {
                'url': 'http://page.1688.com/cp/cp1.html',
                'action': 'http://s.1688.com/search/company_search.htm',
                'placeholder': '输入公司名称或关键词'
            },
            buy: {
                'url': 'http://page.1688.com/cp/cp8.html',
                'action': 'http://s.1688.com/search/search.htm',
                'placeholder': '输入产品名称'
            },
            baike: {
                'url': 'http://baike.1688.com/',
                'action': 'http://s.1688.com/search/wiki_answer_search.htm',
                'placeholder': '输入问题关键词'
            },
            pifa: {
                'url': 'http://pifa.1688.com/',
                'action': 'http://s.1688.com/search/business_search.htm',
                'placeholder': '输入产品名称'
            },
            trust: {
                'url': 'http://page.1688.com/trust/safeguard.html',
                'action': 'http://trust.china.alibaba.com/athena/trustsearch.html',
                'placeholder': '输入公司名称或关键词'
            },
            info: {
                'url': 'http://info.1688.com/',
                'action': 'http://s.1688.com/search/news_search.htm',
                'placeholder': '输入信息关键词'
            },
            club: {
                'url': 'http://club.1688.com/',
                'action': 'http://s.1688.com/search/forum_search.htm',
                'placeholder': '输入信息关键词'
            },
            blog: {
                'url': 'http://blog.1688.com/',
                'action': 'http://s.1688.com/search/blog_search.htm',
                'placeholder': '输入信息关键词'
            },
            video: {
                'url': 'http://video.1688.com/',
                'action': 'http://video.1688.com/video/search/search_list.html',
                'placeholder': '输入信息关键词'
            }
        }
    };
    
    
    
    /**
     * search bar
     * */
    var searchBar = {
        init: function(){
            this.$form = $('#alisearch-form');
            if(!this.$form.length){
                return;
            }
            this.$input = $('#alisearch-input');
            this.$suggest = $('#alisearch-container');
            this.$basicList = $('#alisearch-basic-list');
            this.$extList = $('#alisearch-ext-list');
            this.$extBox = $('#alisearch-form div.alisearch-ext');
            this.$current = $('#alisearch-basic-list .alisearch-current');
            this.$ext = null;
            
            //this.SEARCH_TYPE_MAP = S.masthead.SEARCH_TYPE_MAP;
            
            this.isFocus = 0;
            this.isExt = 0;
            
            this._placeholder();
            this._basicTypeSwitch();
            this._extTypeSwitch();
            this._checkSubmit();
            this._suggestion();
            
        },
        //判断是否支持placeholder
        _isPlaceholder: function(){
            return !!( 'placeholder' in document.createElement('input') );
        },
        //取得当前搜索类型
        _getCurrentType: function(){
            var $current = this.$current,
                type;
            if ( !$current.length ){
                $current = $('#alisearch-basic-list li:first');
                $current.addClass('alisearch-current');
                //$.log('请设置当前搜索类型！');
            }
            type = $current.attr('data-alisearch-type').trim();
            return type;
        },
        //添加input值
        _addInputValue: function( placeholder ){
            var $input = this.$input,
                placeholder = placeholder || S.masthead.SEARCH_TYPE_MAP[this._getCurrentType()]['placeholder'];
            $input.addClass('placeholder');
            $input.val( placeholder );
        },
        //支持placeholder
        _supportPlaceholder: function(){
            var _this = this,
                t;
            this.$input.bind( 'focus.placeholder', function(){
                clearTimeout(t);
                var $this = $(this);
                if ( $this.hasClass('placeholder') ){
                    $this.val('');
                    $this.removeClass('placeholder');
                }
                _this.isFocus = 1;
            } ).bind( 'blur.placeholder', function(){
                var $this = $(this);
                if ( $this.val().trim() === '' ){
                    _this._addInputValue();
                }
                t = setTimeout(function(){
                    _this.isFocus = 0;
                }, 200);
            } );
        },
        //placeholder初始化
        _placeholder: function(){
            var $input = this.$input,
                $form = this.$form,
                isPlaceholder = this._isPlaceholder(),//$.support.placeholder,
                type = this._getCurrentType(),
                current = S.masthead.SEARCH_TYPE_MAP[type];
            $form.attr( 'action', current['action'] );
            if ( this.isFocus ){
                $input.focus();
            } else {
                if ( isPlaceholder ){
                    $input.attr( 'placeholder', current['placeholder'] );
                } else {
                    this._addInputValue( current['placeholder'] );
                    this._supportPlaceholder();
                }
            }
        },
        //改变placeholder
        _changePlaceholder: function( type ){
            var current = S.masthead.SEARCH_TYPE_MAP[type],
                placeholder = current['placeholder'],
                $input = this.$input,
                $form = this.$form;
            $input.attr( 'placeholder', placeholder );
            $form.attr( 'action', current['action'] );
            if ( $input.hasClass('placeholder') ){
                $input.val(placeholder);
            }
            if ( this.isFocus ){
                $input.focus();
            }
        },
        //basic搜索类型切换
        _basicTypeSwitch: function(){
            var _this = this;
            this.$basicList.delegate( 'a', 'click.switch', function(e){
                e.preventDefault();
                var $li = $(this).closest('li'),
                    type = $li.attr('data-alisearch-type').trim();
                
                if ( $li[0] === _this.$current[0] ){
                    //$.log('click current');
                    return;
                }
                _this.$current.removeClass('alisearch-current');
                _this.$current = $li;
                _this.$current.addClass('alisearch-current');
                //$.log(_this.$current);
                _this._changePlaceholder(type);
            } );
        },
        //取得当前type是否为ext类
        _getIsExt: function(){
            if ( ['info','club','blog','vide'].indexOf(this._getCurrentType()) > -1 ){
                this.isExt = 1;
                this.$ext = this.$current;
            }
        },
        //ext类下拉处理
        _searchEnter: function(){
            var t1, t2;
            this.$extBox.bind( 'mouseenter.mast', function(){
                clearTimeout(t2);
                var $this = $(this);
                t1 = setTimeout(function(){
                    $this.addClass('alisearch-over');
                }, 200);
            } ).bind( 'mouseleave.mast', function(){
                clearTimeout(t1);
                var $this = $(this);
                t2 = setTimeout(function(){
                    $this.removeClass('alisearch-over');
                }, 200);
            } );
            $('#alisearch-more').click(function(e){
                e.preventDefault();
                return false;
            });
        },
        //ext搜索类型切换
        _extTypeSwitch: function(){
            var _this = this;
            this._searchEnter();
            this._getIsExt();
            this.$extList.delegate( 'a', 'click.switch', function(e){
                e.preventDefault();
                var $li = $(this).closest('li'),
                    type = $li.attr('data-alisearch-type').trim();
                if ( _this.isExt ){
                    _this.$current.removeClass('alisearch-current');
                    _this.$current = $li;
                    _this.$current.addClass('alisearch-current');
                    _this.$basicList.append( _this.$current );
                    _this.$ext.removeClass('alisearch-current');
                    _this.$extList.append( _this.$ext );
                    _this.$ext = $li;
                    //$.log(_this.$current);
                } else {
                    _this.$current.removeClass('alisearch-current');
                    _this.$current = $li;
                    _this.$current.addClass('alisearch-current');
                    _this.$basicList.append( _this.$current );
                    _this.$extBox.removeClass( 'alisearch-over' );
                    _this.$ext = $li;
                    _this.isExt = 1;
                    //$.log(_this.$current);
                }
                _this._changePlaceholder( type );
            } );
        },
        //submit验证
        _checkSubmit: function(){
            var _this = this;
            this.$form.bind( 'submit.mast', function(e){
                var kw = _this.$input.val().trim(),
                    current = S.masthead.SEARCH_TYPE_MAP[_this._getCurrentType()],
                    target = !!current['target'] ? current['target'] : '_blank';
                if ( ( kw !== '' ) && ( kw !== current['placeholder'] ) ){
                    $(this).attr( 'action', current['action'] );
                    $(this).attr( 'target', target );
                    if ( !!current['tracelog'] && 'undefined' !== typeof aliclick ){
                        aliclick( this, '?tracelog='+current['tracelog'] );
                    }
                } else {
                    e.preventDefault();
                    if ( current['url'] === window.location.href.split('?')[0] ){
                        _this.$input.focus();
                        return false;
                    }
                    FE.util.goTo( current['url'], target );
                    return false;
                }
            } );
        },
        //suggestion初始化
        _suggestion: function(){
            this.$input.one('focus.get', function(){
                register('suggestion'); //注册suggestion功能
            });
        }
    };
    
    
    //注册功能点
    register([searchBar]);
    
    
})( jQuery, FE.sys );



/**
 * Masthead 4.0
 * @version FDev4 4.0 2012.01.18
 * @author Denis
 * @update Denis 优化在无type情况下，初始化不支持placeholder浏览器的placeholder
 *               优化suggestion的动态载入逻辑
 */
if (!FE.sys.Masthead) {
    jQuery.namespace('FE.sys.Masthead');
    jQuery(function($){
        //noformat
        var masthead = $('#masthead-v4,#masthead-v5');
        if(!masthead.length){
            return;
        }
        var form = $('form', masthead),
            searchType = $('ul.alisearch-type-v4,ul.alisearch-type-v5', masthead),
            searchContainer = searchType.next(),
            searchCategory = $('>div.alisearch-category-v4,>div.alisearch-category-v5', searchContainer),
            keywords = $('input[name=keywords]', searchContainer),
            searchKeywords = keywords.parent(),
            submit = $('button:first', searchContainer),
            ie6 = $.util.ua.ie6,
            currentCfg,
            suggestion;
        //format
        var handlers = {
            /**
             * placeholder
             */
            placeholderInit: function(){
                if ($.support.placeholder) {
                    keywords.removeClass('empty');
                    return;
                }
                keywords.bind({
                    focus: focusHandler,
                    blur: blurHandler
                });
                function focusHandler(e){
                    if ($(this).hasClass('empty')) {
                        this.value = '';
                    }
                    $(this).removeClass('empty');
                }
                function blurHandler(e){
                    var value = this.value.trim();
                    if (value) {
                        $(this).val(value).removeClass('empty');
                    } else {
                        $(this).val($(this).attr('placeholder')).addClass('empty');
                    }
                }
            },
            /**
             * 类目切换
             */
            typeInit: function(){
                var categories = searchCategory.children(), currentLi = searchType.find('li.current').get(0);
                //主类目
                searchType.delegate('li', 'click', typeChangeHandler);
                $('a', searchType).click(function(e){
                    e.preventDefault();
                });
                //初始化搜索类目
                if (currentLi) {
                    typeChangeHandler.call(currentLi, $.Event('click'), true);
                } else if (!$.support.placeholder) {
                    keywords.triggerHandler('focus');
                    keywords.triggerHandler('blur');
                }
                //子类目
                categories.each(function(i, category){
                    var h3 = $(category).children('h3');
                    $(category).delegate('li', 'click', function(){
                        var config = $(category).data('config');
                        currentCfg = $.extend({}, config, eval('(' + ($(this).data('config') || '{}') + ')'));
                        $(category).removeClass('category-hover').find('li').removeClass('current');
                        h3.text($(this).addClass('current').text());
                        configChangeHandler(currentCfg);
                    });
                    if (ie6) {
                        $(category).delegate('li', 'mouseover', function(){
                            $(this).addClass('hover');
                        }).delegate('li', 'mouseout', function(){
                            $(this).removeClass('hover');
                        });
                    }
                });
                categories.hover(function(){
                    $(this).addClass('category-hover');
                }, function(){
                    $(this).removeClass('category-hover');
                });
                /**
                 * 搜索大类别切换处理函数
                 * @param {Object} e
                 * @param {Object} isinit
                 */
                function typeChangeHandler(e, isinit){
                    var li = $(this), type, config, category;
                    if (!isinit && li.hasClass('current')) {
                        return;
                    }
                    $('>li', searchType).removeClass('current current-next');
                    $(this).addClass('current').next().addClass('current-next');
                    type = li.data('type');
                    config = currentCfg = eval('(' + li.data('config') + ')');
                    category = categories.filter('.' + type);
                    if (!category.data('config')) {
                        category.data('config', config);
                    }
                    categories.hide();
                    //样式alisearch-extend是为子搜索类型而准备的
                    if (category.length) {
                        li = $('li.current', category);
                        if (!li.length) {
                            li = $('li:first', category);
                        }
                        //扩展子类目的配置
                        currentCfg = $.extend({}, config, eval('(' + li.data('config') + ')'));
                        category.children('h3').text(li.addClass('current').text()).end().show();
                        searchContainer.addClass('alisearch-extend');
                    } else {
                        searchContainer.removeClass('alisearch-extend');
                    }
                    configChangeHandler(currentCfg);
                }
            },
            /**
             * 关键字搜索建议
             */
            suggestionInit: function(){
                $.add('web-suggestion', {
                    requires: ['ui-autocomplete'],
                    js: ['suggestion.js']
                });
                keywords.bind('focus.suggestion', function(){
                    if (currentCfg && currentCfg.suggest) {
                        $.use('web-suggestion', function(){
                            suggestion = new FE.ui.Suggestion(keywords, {
                                appendTo: searchKeywords,
                                url: currentCfg.url,
                                type: currentCfg.type,
                                position: {
                                    my: 'left top',
                                    at: 'left bottom',
                                    offset: '-5 0'
                                },
                                widthfix: 8,
                                onSelected: function(e, ui){
                                    submit.click();
                                }
                            });
                        });
                        keywords.unbind('focus.suggestion');
                    }
                });
            },
            /**
             * 按钮区事件
             */
            actionInit: function(){
                $('button', searchContainer).hover(function(){
                    $(this).addClass('hover');
                }, function(){
                    $(this).removeClass('hover');
                });
            },
            /**
             * 重写表单onsubmit事件
             */
            submitInit: function(){
                form.get(0).onsubmit = function(){
                    if (!keywords.val() || (!$.support.placeholder && keywords.hasClass('empty'))) {
                        keywords.focus();
                        return false;
                    }
                    //$.log('search submit!');
                    return true;
                };
            },
            /**
             * IE6下主logo透明滤镜
             */
            iePNGFix: function(){
                if(ie6){
                    var pngImg = $('img.iepngfix', masthead);
                    if(pngImg.length){
                        pngImg.each(function(i, img){
                            $(img).css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + img.src + '",sizingMethod="scale");');
                            img.src = 'http://img.china.alibaba.com/images/common/util/1x1.gif';
                        });
                    }
                }
            }            
        };
        /**
         * 切换配置处理函数
         * @param {Object} o 配置
         */
        function configChangeHandler(o){
            //placeholder
            keywords.attr('placeholder', o.placeholder);
            if (!$.support.placeholder) {
                keywords.triggerHandler('focus');
                keywords.triggerHandler('blur');
            }
            //suggestion
            if (suggestion) {
                if (o.suggest) {
                    suggestion.setOptions({
                        url: o.url,
                        type: o.type
                    }).enable();
                } else {
                    suggestion.disable();
                }
            }
            //修改表单样式 切换表单action属性
            form.removeClass().addClass(o.cls).attr('action', o.action);
        }
        //判断HTML结构是否符合当前版本
        for (var p in handlers) {
            handlers[p]();
        }
    });
}


