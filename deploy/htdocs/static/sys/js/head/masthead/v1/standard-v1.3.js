/**
 * @package FD.sys.head.search
 * @version 1.0.101017.01
 * @version 1.1.101025.01
 * @version 1.2.101031.01
 * @version 1.2.101102.01
 * @version 1.3.101117.01
 * @version 1.3.101214.01
 * @version 1.3.110113 // change className & id for search
 * @author  Edgar
 */
FDEV.namespace('FD.sys.head');
(function( win, S ){
    S.search = {
        categoriesMap: {
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
            },
            end: 0
        },
        isFocus: 0,
        isExt: 0,
        isSuggest: 0,
        isPlaceholder: function(){
            return !!( 'placeholder' in document.createElement('input') );
        },
        getIsExt: function(){
            if ( ['info','club','blog','video'].indexOf(this.getCurrentType()) > -1 ){
                this.isExt = 1;
                this.nodes.ext = this.nodes.current;
            }
        },
        getCurrentType: function(){
            var category = this.nodes.current.getAttribute('data-alisearch-type').trim();
            return category;
        },
        /**
         * @method  placeholder
         * @return  placeholder for not supported
        */
        placeholder: function(){
            var input = this.nodes.input,
                form = this.nodes.form,
                _this = this,
                isPlaceholder = this.isPlaceholder(),
                type = _this.getCurrentType(),
                t;
            form.setAttribute( 'action', _this.categoriesMap[type]['action'] );
            if ( this.isFocus ){
                input.focus();
            } else {
                isPlaceholder ? input.setAttribute( 'placeholder', _this.categoriesMap[type]['placeholder'] ) : addValue( input );
            }
            if ( isPlaceholder ){
                return;
            }
            $E.addListener( input, 'focus', function(){
                clearTimeout(t);
                if ( $D.hasClass( this, 'placeholder' )){
                    this.value = '';
                    $D.removeClass( this, 'placeholder' );
                }
                _this.isFocus = 1;
            });
            $E.addListener( input, 'blur', function(){
                if ( this.value.trim() === '' ){
                    addValue( this );
                }
                t = setTimeout( function(){
                    _this.isFocus = 0;
                }, 200 );
            });
            
            function addValue( that ){
                $D.addClass( that, 'placeholder' );
                that.value = _this.categoriesMap[_this.getCurrentType()]['placeholder'];
            }
        },
        changePlaceholder: function( type ){
            var category = this.categoriesMap[type],
                placeholder = category['placeholder'],
                input = this.nodes.input;
            input.setAttribute( 'placeholder', placeholder );
            this.nodes.form.setAttribute( 'action', category['action'] );
            //this.nodes.form.setAttribute( 'target', target );
            /* for not supported the placeholder */
            if ( $D.hasClass( input, 'placeholder' ) ){
                input.value = placeholder;
            }
            if ( this.isFocus ){
                input.focus();
            }
        },
        basicChangeCategory: function(){
            var _this = this, nodes = this.nodes;
            $E.delegate( this.nodes.basicList, 'click', function(e){
                $E.preventDefault(e);
                var li = this.parentNode.parentNode,
                    type = li.getAttribute( 'data-alisearch-type' ).trim();
                if ( li === nodes.current ){
                    return;
                }
                
                $D.removeClass( nodes.current, 'alisearch-current' );
                nodes.current = li;
                $D.addClass( nodes.current, 'alisearch-current' );
                _this.changePlaceholder( type );
            }, 'a' );
        },
        searchOver: function(){
            var ext = this.nodes.extBox, t1, t2;
            $E.addListener( ext, 'mouseover', function(){
                clearTimeout(t2);
                var _this = this;
                t1 = setTimeout( function(){
                    $D.addClass( _this, 'alisearch-over' );
                }, 200 );
            } );
            $E.addListener( ext, 'mouseout', function(){
                clearTimeout(t1);
                var _this = this;
                t2 = setTimeout( function(){
                    $D.removeClass( _this, 'alisearch-over' );
                }, 200 );
            } );
            $E.addListener( 'alisearch-more', 'click', function(e){
                $E.preventDefault(e);
                return false;
            } );
        },
        extChangeCategory: function(){
            this.searchOver();
            this.getIsExt();
            var _this = this, nodes = this.nodes;
            $E.delegate( nodes.extList, 'click', function(e){
                $E.preventDefault(e);
                var li = this.parentNode.parentNode,
                    type = li.getAttribute( 'data-alisearch-type' ).trim();
                if ( _this.isExt ){
                    $D.removeClass( nodes.current, 'alisearch-current' );
                    nodes.current = li;
                    $D.addClass( nodes.current, 'alisearch-current' );
                    $D.removeClass( nodes.ext, 'alisearch-current' );
                    nodes.extList.appendChild( nodes.ext );
                    nodes.ext = li;
                    nodes.basicList.appendChild(li);
                } else {
                    $D.removeClass( nodes.current, 'alisearch-current' );
                    nodes.current = li;
                    $D.addClass( nodes.current, 'alisearch-current' );
                    nodes.ext = li;
                    nodes.basicList.appendChild( nodes.current );
                    $D.removeClass( nodes.extBox, 'alisearch-over' );
                    _this.isExt = 1;
                }
                _this.changePlaceholder( type );
            }, 'a' );
        },
        checkSubmit: function(){
            var _this = this, nodes = this.nodes;
            $E.addListener( nodes.form, 'submit', function(e){
                var kw = nodes.input.value.trim(),
                    category = _this.categoriesMap[_this.getCurrentType()],
                    target = !!category['target'] ? category['target'] : '_blank';
                if ( ( kw !== '' ) && ( kw !== category['placeholder'] ) ){
                    //this.setAttribute( 'action', category['action'] );
                    this.setAttribute( 'target', target );
                    if ( !!category['tracelog'] ){
                        aliclick( this, '?tracelog='+category['tracelog'] );
                    }
                } else {
                    $E.preventDefault(e);
                    if ( category['url'] === win.location.href.split('?')[0] ){
                        nodes.input.focus();
                        return false;
                    };
                    FD.common.goTo( category['url'], target );
                    return false;
                }
            } );
        },
        initSuggest: function(){
            var _this = this, t;
            $E.addListener( this.nodes.input, 'focus', function(){
                if ( !_this.isSuggest ){
                    $Y.Get.css('http://style.c.aliimg.com/css/sys/head/autocomplete.css');
                    if ( typeof FD.widget.AutoComplete === 'undefined' ){
                        var jsSuggest = 'http://style.c.aliimg.com/js/fdevlib/widget/autocomplete/fdev-autocomplete-min.js',
                            configs = {
                                onSuccess: function(o){
                                    t = setTimeout( autoComplete, 200 );
                                }
                            },
                            suggest = FD.common.request('jsonp',[jsSuggest],configs);
                    } else {
                        autoComplete();
                    }
                    _this.isSuggest = 1;
                }
                function autoComplete(){
                    FD.widget.AutoComplete.init( _this.nodes.suggest, {
                        charset: 'gb2312',
                        pX:4,
                        pY:17,
                        pW:35,
                        formName: 'alisearch',
                        isAnim: false,
                        isShowShut: false
                    });
                }
            } );
        },
        init: function(){
            this.nodes = {
                form: $('alisearch-form'),
                input: $('alisearch-input'),
                suggest: $('alisearch-container'),
                basicList: $('alisearch-basic-list'),
                extList: $('alisearch-ext-list'),
                extBox: $$('.alisearch-types .alisearch-ext')[0],
                current: $$('#alisearch-basic-list .alisearch-current')[0],
                ext: null
            };
            
            this.placeholder();
            this.basicChangeCategory();
            this.extChangeCategory();
            this.checkSubmit();
            this.initSuggest();
        },
        end:0
    };
    $E.onDOMReady(function(){
        S.search.init();
    });
    
})( window, FD.sys.head );
/**
 * Masthead 4.0
 * @version FDev3 4.0 2012.01.30
 * @author Denis
 */
if (!FD.sys.Masthead) {
    FDEV.namespace('FD.sys.Masthead');
    FYE.onDOMReady(function(){
        var masthead = FYG('masthead-v4')||FYG('masthead-v5');
        if(!masthead){
            return;
        }
        //noformat
        var $D = FYD,
            $E = FYE,
            placeholder = 'placeholder' in document.createElement('input'),
            form = FYS('form', masthead, true),
            searchType = FYS('ul.alisearch-type-v4', masthead, true)||FYS('ul.alisearch-type-v5', masthead, true),
            searchContainer = $D.getNextSibling(searchType),
            searchCategory = FYS('>div.alisearch-category-v4', searchContainer, true)||FYS('>div.alisearch-category-v5', searchContainer, true),
            keywords = FYS('input[name=keywords]', searchContainer, true),
            searchKeywords = keywords.parentNode,
            button = FYS('button', searchContainer, true),
            oldIE = FDEV.env.ua.ie < 9,
            ie6 = FDEV.env.ua.ie === 6,
            currentCfg,
            suggestion;
        //format
        var handlers = {
            /**
             * placeholder
             */
            placeholderInit: function(){
                if (placeholder) {
                    FYD.removeClass(keywords, 'empty');
                    return;
                }
                $E.on(keywords, 'focus', focusHandler);
                $E.on(keywords, 'blur', blurHandler);
                function focusHandler(e){
                    if ($D.hasClass(this, 'empty')) {
                        this.value = '';
                    }
                    $D.removeClass(this, 'empty');
                }
                function blurHandler(e){
                    var value = this.value.trim();
                    if (value) {
                        $D.removeClass(this, 'empty');
                        this.value = value;
                    } else {
                        $D.addClass(this, 'empty');
                        this.value = $D.getAttribute(this, 'placeholder');
                    }
                }
            },
            /**
             * 类目切换
             */
            typeInit: function(){
                var categories = FD.common.toArray(searchCategory.children), links = FYS('a', searchType), currentLi = FYS('li.current', searchType, true);
                //主类目
                $E.delegate(searchType, 'click', typeChangeHandler, 'li');
                FYE.on(links, 'click', function(e){
                    FYE.preventDefault(e);
                });
                //初始化搜索类目
                if (currentLi) {
                    typeChangeHandler.call(FYS('li.current', searchType, true), undefined, true);
                } else if (!placeholder) {
                    keywords.focus();
                    keywords.blur();
                } 
                //子类目
                categories.forEach(function(category, i){
                    var h3 = FYS('>h3', category, true);
                    $E.delegate(category, 'click', function(){
                        var attr = $D.getAttribute(category, 'dataconfig'), config = eval('(' + (attr || '{}') + ')');
                        currentCfg = config;
                        FD.common.apply(currentCfg, eval('(' + ($D.getAttribute(this, 'data-config') || '{}') + ')'));
                        $D.removeClass(category, 'category-hover');
                        $D.removeClass(FYS('li', category), 'current');
                        $D.addClass(this, 'current');
                        h3.innerHTML = this.innerHTML.trim();
                        configChangeHandler(currentCfg);
                    }, 'li');
                    if (ie6) {
                        $E.delegate(category, 'mouseover', function(){
                            $D.addClass(this, 'hover');
                        }, 'li');
                        $E.delegate(category, 'mouseout', function(){
                            $D.removeClass(this, 'hover');
                        }, 'li');
                    }
                });
                $E.on(categories, 'mouseenter', function(){
                    $D.addClass(this, 'category-hover');
                });
                $E.on(categories, 'mouseleave', function(){
                    $D.removeClass(this, 'category-hover');
                });
                /**
                 * 搜索大类别切换处理函数
                 * @param {Object} e
                 * @param {Object} isinit
                 */
                function typeChangeHandler(e, isinit){
                    var li = this, lis, type, attr, config, category;
                    if (!isinit && $D.hasClass(li, 'current')) {
                        return;
                    }
                    lis = FYS('>li', searchType);
                    $D.removeClass(lis, 'current');
                    $D.removeClass(lis, 'current-next');
                    $D.addClass(this, 'current');
                    $D.addClass($D.getNextSibling(this), 'current-next');
                    type = $D.getAttribute(li, 'data-type');
                    attr = $D.getAttribute(li, 'data-config');
                    config = currentCfg = eval('(' + attr + ')');
                    category = FYS('.' + type, searchCategory, true);
                    if (!$D.getAttribute(category, 'dataconfig')) {
                        $D.setAttribute(category, 'dataconfig', attr);
                    }
                    $D.setStyle(categories, 'display', 'none');
                    //样式alisearch-extend是为子搜索类型而准备的
                    if (category) {
                        li = FYS('li.current', category, true);
                        if(!li){
                            li = FYS('li', category, true);
                        }
                        //扩展子类目的配置
                        currentCfg = config || {};
                        FD.common.apply(currentCfg, eval('(' + ($D.getAttribute(li, 'data-config') || '{}') + ')'));
                        $D.addClass(li, 'current');
                        FYS('h3', category, true).innerHTML = li.innerHTML.trim();
                        $D.setStyle(category, 'display', 'block');
                        $D.addClass(searchContainer, 'alisearch-extend');
                    } else {
                        $D.removeClass(searchContainer, 'alisearch-extend');
                    }
                    configChangeHandler(currentCfg);
                }
            },
            /**
             * 关键字搜索建议
             */
            suggestionInit: function(){
            },
            /**
             * 按钮区事件
             */
            actionInit: function(){
                var actions = FYS('button', searchContainer);
                FYE.on(actions, 'mouseover', function(){
                    FYD.addClass(this, 'hover');
                });
                FYE.on(actions, 'mouseout', function(){
                    FYD.removeClass(this, 'hover');
                });
            },
            /**
             * 重写表单onsubmit事件
             */
            submitInit: function(){
                form.onsubmit = function(){
                    if (!keywords.value || (!placeholder && $D.hasClass(keywords, 'empty'))) {
                        keywords.focus();
                        return false;
                    }
                    return true;
                };
            },
            /**
             * IE6下主logo透明滤镜
             */
            iePNGFix: function(){
                if(ie6){
                    var pngImg = FYS('img.iepngfix', masthead);
                    if(pngImg.length){
                        pngImg.forEach(function(img, i){
                            FYD.setStyle(img, 'filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + img.src + '",sizingMethod="scale");');
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
            $D.setAttribute(keywords, 'placeholder', o.placeholder);
            if (!placeholder) {
                if(!keywords.value.trim()){
                    $D.addClass(keywords, 'empty');
                }
                if($D.hasClass(keywords, 'empty')){
                    keywords.value = $D.getAttribute(keywords, 'placeholder');
                }
            }
            //            //suggestion
            //            if (suggestion) {
            //                if (o.suggest) {
            //                    suggestion.setOptions({
            //                        url: o.url,
            //                        type: o.type
            //                    }).enable();
            //                } else {
            //                    suggestion.disable();
            //                }
            //            }
            //切换表单action属性
            form.setAttribute('action', o.action);
            form.className = o.cls || '';
        }
        //判断HTML结构是否符合当前版本
        for (var p in handlers) {
            handlers[p]();
        }
    });
}
