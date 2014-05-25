/**
 * @package FD.sys.head.search
 * @version 1.0.101017.01
 * @version 1.1.101025.01
 * @version 1.2.101031.01
 * @version 1.2.101102.01
 * @version 1.3.101117.01
 * @author  Edgar
 */
FDEV.namespace('FD.sys.head');
(function( S ){
    S.search = {
        categoriesMap: {
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
            if ( ['info','club','blog'].indexOf(this.getCurrentType()) > -1 ){
                this.isExt = 1;
                this.nodes.ext = this.nodes.current;
            }
        },
        getCurrentType: function(){
            var category = this.nodes.current.getAttribute('data-type').trim();
            return category;
        },
        /**
         * @method  placeholder
         * @return  placeholder for not supported
        */
        placeholder: function(){
            var input = this.nodes.input,
                _this = this,
                isPlaceholder = this.isPlaceholder(),
                t;
            if ( this.isFocus ){
                input.focus();
            } else {
                isPlaceholder ? input.setAttribute( 'placeholder', _this.categoriesMap[_this.getCurrentType()]['placeholder'] ) : addValue( input );
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
            var placeholder = this.categoriesMap[type]['placeholder'],
                input = this.nodes.input;
            input.setAttribute( 'placeholder', placeholder );
            this.nodes.form.setAttribute( 'action', this.categoriesMap[type]['action'] );
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
                    type = li.getAttribute( 'data-type' ).trim();
                if ( li === nodes.current ){
                    return;
                }
                
                $D.removeClass( nodes.current, 'current' );
                nodes.current = li;
                $D.addClass( nodes.current, 'current' );
                _this.changePlaceholder( type );
            }, 'a' );
        },
        searchOver: function(){
            var ext = this.nodes.extBox, t1, t2;
            $E.addListener( ext, 'mouseover', function(){
                clearTimeout(t2);
                var _this = this;
                t1 = setTimeout( function(){
                    $D.addClass( _this, 'search-over' );
                }, 200 );
            } );
            $E.addListener( ext, 'mouseout', function(){
                clearTimeout(t1);
                var _this = this;
                t2 = setTimeout( function(){
                    $D.removeClass( _this, 'search-over' );
                }, 200 );
            } );
            $E.addListener( 'searchMore', 'click', function(e){
                $E.preventDefault(e);
            } );
        },
        extChangeCategory: function(){
            this.searchOver();
            this.getIsExt();
            var _this = this, nodes = this.nodes;
            $E.delegate( this.nodes.extList, 'click', function(e){
                $E.preventDefault(e);
                var li = this.parentNode.parentNode,
                    type = li.getAttribute( 'data-type' ).trim();
                if ( _this.isExt ){
                    $D.removeClass( nodes.current, 'current' );
                    nodes.current = li;
                    $D.addClass( nodes.current, 'current' );
                    $D.removeClass( nodes.ext, 'current' );
                    nodes.extList.appendChild( nodes.ext );
                    nodes.ext = li;
                    nodes.basicList.appendChild(li);
                } else {
                    $D.removeClass( nodes.current, 'current' );
                    nodes.current = li;
                    $D.addClass( nodes.current, 'current' );
                    nodes.ext = li;
                    nodes.basicList.appendChild( nodes.current );
                    $D.removeClass( nodes.extBox, 'search-over' );
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
                form: $('aliSearchForm'),
                input: $('aliSearchInput'),
                suggest: $('searchBodyContainer'),
                basicList: $('searchCategoriesList'),
                extList: $('moreSearchCategoriesList'),
                extBox: $$('.search-categories .search-ext')[0],
                current: $$('#searchCategoriesList .current')[0],
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
    
})( FD.sys.head );
