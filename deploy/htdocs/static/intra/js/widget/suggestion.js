/**
 * @author shanshan.hongss
 * @usefor 工具后台样式统一 —— 信息补全
 * @date   2012.09.13
 * @dependent web-sweet
 */

;(function($, T){
    T.Suggestion = function(inputEl, opts){
        this._init(inputEl, opts);
    };
    T.Suggestion.defConfig = {
        url: '',    //接口地址
        data: {},   //除了输入框内的值外的其他参数
        paramName: '',   //传递输入框值的参数
        template: '<% for (var item in $data) { %>\
                       <li data-val="<%=item %>"><%=jQuery.util.escapeHTML($data[item], true) %></li>\
                   <% } %>',  //模板代码,模板生成的内容会被存放在ul中
        tempPrefix: '',   //模板前缀，比如“选择所有”：<li data-val="">选择所有</li>
        valInput: null,    //存储所选信息value的input框
        delay: 300,    //延迟时间
        zIndex: null,   //设定补全信息框的z-index值
        isFocusShow: true,   //当inputEl获得焦点时是否显示信息补全内容,默认补全
        isDefaultItem: true,  //在有内容输入时是否默认必须有一条内容被选择,默认选中一条
        before: null,    //请求前的回调函数
        complete: null   //选择完成后的回调函数
    };
    T.Suggestion.prototype = {
        _init: function(inputEl, opts){
            var inputEl = $(inputEl),
                config = $.extend({}, T.Suggestion.defConfig, opts),
                ul = $('<ul class="tui-suggestion"></ul>'),
                timeId, self = this;
            
            inputEl.after(ul);
            ul.position(inputEl.position());
            if (config.zIndex){
                ul.css('zIndex', config.zIndex);
            }
            this.ul = ul;
            this.config = config;
            
            if (config.isFocusShow===true){
                inputEl.bind('focus', function(e){
                    self._requestData(inputEl, ul, inputEl.val());
                });
            }
            
            inputEl.bind('input', function(e){
                if (timeId){ 
                    window.clearTimeout(timeId); 
                    timeId = null;
                }
                
                timeId = window.setTimeout(function(){
                    var val = inputEl.val();
                    self._requestData(inputEl, ul, val);
                } , config.delay);
            });
            
            //选择某条补全内容
            ul.delegate('li', 'click', function(){
                var li = $(this);
                ul.children().removeClass('selected');
                li.addClass('selected');
                
                self._hideUl(inputEl, ul, li);
            });
            
            $(document).click(function(e){
                var target = $(e.target);
                if (target.closest(ul).length===0 && target.closest(inputEl).length===0 
                        && ul.css('display')==='block'){
                    var li = $('li.selected', ul);
                    self._hideUl(inputEl, ul, li);
                }
            });
        },
        _requestData: function(inputEl, ul, val){
            var config = this.config,
                data = config.data;
            
            if (config.before){
                config.before.apply(this, config);
            }
            
            val = val || '';
            data[config.paramName] = val;
            $.ajax(config.url+'?'+$.paramSpecial(data), {
                dataType: 'jsonp',
                success: function(data){
                    $.use('web-sweet', function(){
                        var strHtml = FE.util.sweet(config.template).applyData(data);
                        
                        if (config.tempPrefix){
                            strHtml = config.tempPrefix+strHtml;
                        }
                        ul.html(strHtml);
                        if (strHtml){
                            ul.show();
                        }
                        
                        var isSelected = false;
                        var inputVal = inputEl.val();
                        $('li', ul).each(function(i, el){
                            var el = $(el);
                            if (el.text()===inputVal && isSelected===false){
                                el.addClass('selected');
                                isSelected = true;
                            }
                        });
                        
                        if (isSelected===false && config.isDefaultItem){
                            $(':first-child', ul).addClass('selected');
                        }
                    });
                }
            });
        },
        _hideUl: function(inputEl, ul, li){
            var config = this.config;
            inputEl.val(li.text());
            
            if (config.valInput){
                $(config.valInput).val(li.data('val'));
            }
            ul.hide();
            
            if (config.complete){
                config.complete.apply(this, config, li, ul);
            }
        },
        select: function(){
            return $('li.selected', this.ul);
        },
        setConfig: function(config){
            this.config = $.extend({}, this.config, config);
        }
    }
})(jQuery, FE.tools);