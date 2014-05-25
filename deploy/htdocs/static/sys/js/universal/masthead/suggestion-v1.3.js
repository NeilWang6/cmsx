/**
 * masthead suggestion js
 * @author  Arcthur & Edgar
 * @date    2011-4-10
 * @version 1.6
 * 此js只在masthead.js中调用，禁止直接merge使用
 * @update 1.5 修复 "ui-complete" 被merge后产生的BUG ---- 陈屹
 * @update 1.6 增加对产品数据接口category的信息渲染 ---- Denis
 */
(function($) {
    $(function() {
        var ajax, type = 'offer', tracelogType = 'sale', enableWidge = true, $input = $('#alisearch-input'), $submit = $('#alisearch-submit'), $categoryId = $('#search-category');
        
        if ('undefined' === typeof baseClick) {
            $.getScript('http://' + $.styleDomain + '/js/sys/trace/aliclick-min.js');
        }
        
        $.use('ui-autocomplete', function() {
            $input.autocomplete({
                source: function(request, response) {
                    ajax && ajax.abort();
                    ajax = $.ajax({
                        url:  'http://suggest.1688.com/bin/suggest', //'http://10.20.137.26:8888/bin/suggest',
                        dataType: 'script',
                        data: $.paramSpecial({
                            type: function() {
                                return type;
                            },
                            q: request.term
                        }),
                        success: function() {
                            var data = window['_suggest_result_'], result = data.result || {}, category = data.category, i = 0, city, param, url;
                            
                            if (data.pCity) {
                                city = data.pCity[0][1] + data.pCity[0][2];
                                result.splice(0, 0, data.pCity[0]);
                            }
                            
                            // DW data collect (exposure)
                            
                            if ('undefined' !== typeof baseClick) {
                                param = '?sectionexp=' + tracelogType + '_' +
                                'search_suggest_show_' +
                                (!!(data.pCity) ? (encodeURIComponent(city)) + '_' : '') +
                                encodeURIComponent(request.term);
                                url = 'http://stat.1688.com/sectionexp.html';
                                baseClick(url, param);
                            }
                            var items = $.map(result, function(item) {
                                var itemTemp = item[0].replace('_', '<em>'), itemValue = item[0].replace('_', ''), itemDesc = !!item[2] ? (item[1] + item[2]) : item[1];
                                itemTemp = itemTemp.replace('%', '</em>');
                                itemValue = itemValue.replace('%', '');
                                
                                return {
                                    label: itemTemp,
                                    desc: itemDesc,
                                    value: itemValue,
                                    index: i++
                                };
                            });
                            if($categoryId.length && category){
                                $.each(category, function(i, ca){
                                   ca.category = true;
                                   ca.label = request.term,
                                   items.unshift(ca);
                                });
                            }
                            response(items);
                        }
                    });
                },
                select: function(event, ui) {
                    // DW data collect (click)
                    if ('undefined' !== typeof baseClick) {
                        var url = 'http://stat.1688.com/search/queryreport.html', param = '?' + tracelogType + '_suggest_' +
                        encodeURIComponent(this.value) +
                        '_' +
                        (/^\d+$/.test(ui.item.desc) ? (encodeURIComponent(ui.item.desc)) + '_' : '') +
                        encodeURIComponent(ui.item.value) +
                        '_' +
                        ui.item.index;
                        baseClick(url, param);
                    }
                    
                    if($categoryId.length && ui.item.category){
                        $categoryId.val(ui.item.id);
                    }else{
                        $categoryId.val('');
                    }
                    
                    // select the value to the input
                    //this.value = '';
                    this.value = ui.item.value;
                    $submit.click();
                    //$.log(this);
                },
                open: function(event, ui) {
                    // resize the width of menu
                    ui.menu.element.width(473);
                    //ui.menu.element.position('absolute');
                },
                change: function() {
                    return type;
                },
                minLength: 0,
                appendTo: '#alisearch-container',
                position: {
                    my: 'left top',
                    at: 'left bottom',
                    offset: '-30 6'
                }
            });
            
            
            //当搜索类型切换时，相关参数设定
            $input.bind('focus.suggestion', function() {
                var current = $('#alisearch-basic-list .alisearch-current').attr('data-alisearch-type');
                switch (current) {
                    case 'product':
                    case 'pifa':
                    case 'buy':
                        type = 'offer';
                        tracelogType = 'sale';
                        enableWidge = true;
                        break;
                    case 'company':
                        type = 'company';
                        tracelogType = 'company';
                        enableWidge = true;
                        break;
                    default:
                        enableWidge = false;
                }
                //$.log(enableWidge);
                //$.log(type+' '+tracelogType);
                $(this).autocomplete(enableWidge ? 'enable' : 'disable');
            }).triggerHandler('focus');
            
            
            //渲染取回的数据
            $input.data("autocomplete")._renderItem = function(ul, item) {
                return $('<li></li>').data("item.autocomplete", item).append(function() {
                    if ($categoryId.length && item.category) {
                        return '<a><span class="suggest-key">' + item.label + '</span><span class="suggest-category">在<em>“' + item.name + '”</em>下搜索</span></a>';
                    } else {
                        if (/^\d+$/.test(item.desc)) {
                            return '<a><span class="suggest-key">' + item.label + '</span><span class="suggest-result">约' + item.desc + "条结果</span></a>";
                        } else {
                            return '<a><span class="suggest-key">' + item.label + '</span><span class="suggest-city">在<em>“' + item.desc + '”</em>里找</span></a>';
                        }
                    }
                }).appendTo(ul);
            };
        });
    });
})(jQuery);
