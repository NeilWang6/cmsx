
/**
 * Masthead 4.0
 * @version FDev3 4.0 2012.01.30
 * @author Denis
 */
if (!FD.sys.Masthead) {
    FDEV.namespace('FD.sys.Masthead');
    FYE.onDOMReady(function(){
        var masthead = FYG('masthead-v4')||FYG('masthead-v5');
        if (!masthead) {
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
                    if ($D.hasClass(this, 'empty') || $D.getStyle(this, 'color') === 'gray') {
                        this.value = '';
                    }
                    $D.removeClass(this, 'empty');
                    $D.setStyle(this, 'color', '');
                }
                function blurHandler(e){
                    var value = this.value.trim();
                    if (value) {
                        $D.setStyle(this, 'color', '');
                        this.value = value;
                    } else {
                        $D.setStyle(this, 'color', 'gray');
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
                        if (!li) {
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
                    if (!keywords.value || (!placeholder && ($D.hasClass(keywords, 'empty') || $D.getStyle(keywords, 'color') === 'gray'))) {
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
                if (ie6) {
                    var pngImg = FYS('img.iepngfix', masthead);
                    if (pngImg.length) {
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
                if (!keywords.value.trim()) {
                    $D.addClass(keywords, 'empty');
                }
                if ($D.hasClass(keywords, 'empty')) {
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
