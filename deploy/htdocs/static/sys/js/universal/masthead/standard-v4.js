
/**
 * Masthead 4.0
 * @version FDev4 4.0 2012.01.18
 * @author Denis
 * @update Denis �Ż�����type����£���ʼ����֧��placeholder�������placeholder
 *               �Ż�suggestion�Ķ�̬�����߼�
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
             * ��Ŀ�л�
             */
            typeInit: function(){
                var categories = searchCategory.children(), currentLi = searchType.find('li.current').get(0);
                //����Ŀ
                searchType.delegate('li', 'click', typeChangeHandler);
                $('a', searchType).click(function(e){
                    e.preventDefault();
                });
                //��ʼ��������Ŀ
                if (currentLi) {
                    typeChangeHandler.call(currentLi, $.Event('click'), true);
                } else if (!$.support.placeholder) {
                    keywords.triggerHandler('focus');
                    keywords.triggerHandler('blur');
                }
                //����Ŀ
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
                 * ����������л�������
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
                    //��ʽalisearch-extend��Ϊ���������Ͷ�׼����
                    if (category.length) {
                        li = $('li.current', category);
                        if (!li.length) {
                            li = $('li:first', category);
                        }
                        //��չ����Ŀ������
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
             * �ؼ�����������
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
             * ��ť���¼�
             */
            actionInit: function(){
                $('button', searchContainer).hover(function(){
                    $(this).addClass('hover');
                }, function(){
                    $(this).removeClass('hover');
                });
            },
            /**
             * ��д��onsubmit�¼�
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
             * IE6����logo͸���˾�
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
         * �л����ô�����
         * @param {Object} o ����
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
            //�޸ı���ʽ �л���action����
            form.removeClass().addClass(o.cls).attr('action', o.action);
        }
        //�ж�HTML�ṹ�Ƿ���ϵ�ǰ�汾
        for (var p in handlers) {
            handlers[p]();
        }
    });
}

