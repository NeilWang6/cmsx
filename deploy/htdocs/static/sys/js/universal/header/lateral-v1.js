/*
 * @Author      changbin.wangcb
 * @Date        2012.11.20
 * @Description 行业应用/横向产品头部，迁移自 http://static.c.aliimg.com/sys/js/universal/header/industry-v5.js
 * !!cmd:compress=true
 */
(function($){

	$(function(){
        //noformat
        var masthead = $('#ali-masthead-5h');
        if(!masthead.length){
            return;
        }
        var form = $('form', masthead),
            searchType = $('div.alisearch-type ul', masthead),
            searchContainer = $('div.alisearch-container', masthead),
            keywords = $('input[name=keywords]', searchContainer),
            from = $('input[name=from]', searchContainer),
            industryFlag = $('input[name=industryFlag]', searchContainer),
            searchKeywords = keywords.parent(),
            searchMarket = $('button.market', searchContainer),
            submit = searchMarket,
            ie6 = $.util.ua.ie6,
            currentType,
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
                var currentLi = searchType.find('li.current').get(0);
                searchType.on('mouseenter',function(){$(this).addClass('hover');}).on('mouseleave',function(){$(this).removeClass('hover');});
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
                /**
                 * 搜索大类别切换处理函数
                 * @param {Object} e
                 * @param {Object} isinit
                 */
                function typeChangeHandler(e, isinit){
                    var li = $(this), type, config;
                    if (!isinit && li.hasClass('current')) {
                        return;
                    }
                    $('>li', searchType).removeClass('current');
                    searchType.removeClass('hover');
                    li.addClass('current');
                    searchType.prepend(li);
                    type = li.data('type');
                    config = currentCfg = eval('(' + li.data('config') + ')');
                    configChangeHandler(currentCfg);
                    currentType = type;
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
                //搜索本市场和搜索全站逻辑不同
                $('button.market', searchContainer).click(function(){
                    if(currentType==="alisearch-product"){
                        from.val('industrySearch');
                    }
                    else{
                        from.val('');
                    }
                    form.trigger('submit');
                });
                $('button.global', searchContainer).click(function(){
                    if(currentType==="alisearch-product"){
                        from.val('marketSearch');
                    }
                    else{
                        from.val('');
                    }
                    form.trigger('submit');
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
            },
            /**
             * 类目收缩展开事件
             */
            categoryInit: function(){
                var category = $('#ali-nav-5h div.ali-nav-category'),
                    catTitle = category.find('div.cat-title'),
                    catContent = category.find('div.cat-content'),
                    config = category.data('config'),
                    enterTimer,
                    leaveTimer;

                if(!config){
                    return;
                }
                config = eval('(' + config + ')');

                if(config.showcategory){
                    category.css('cursor', 'pointer');
                    catTitle.find('span.dropdown').show();
                    category.on('mouseenter', function(){
                        leaveTimer && clearTimeout(leaveTimer);
                        enterTimer = setTimeout(function(){
                            category.addClass('hover');
                        }, 200);
                    })
                    .on('mouseleave', function(){
                        enterTimer && clearTimeout(enterTimer);
                        leaveTimer = setTimeout(function(){
                            category.removeClass('hover');
                        }, 200);
                    });
                }
            },
            /**
             * 导航初始化
             */
            navInit: function(){
                var nav = $('#ali-nav-5h div.ali-nav-list');

                nav.find('ul>li:eq(0)').addClass('first-child');
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

        for (var p in handlers) {
            handlers[p]();
        }
    });

})(jQuery);