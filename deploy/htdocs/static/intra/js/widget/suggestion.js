/**
 * @author shanshan.hongss
 * @usefor ���ߺ�̨��ʽͳһ ���� ��Ϣ��ȫ
 * @date   2012.09.13
 * @dependent web-sweet
 */

;(function($, T){
    T.Suggestion = function(inputEl, opts){
        this._init(inputEl, opts);
    };
    T.Suggestion.defConfig = {
        url: '',    //�ӿڵ�ַ
        data: {},   //����������ڵ�ֵ�����������
        paramName: '',   //���������ֵ�Ĳ���
        template: '<% for (var item in $data) { %>\
                       <li data-val="<%=item %>"><%=jQuery.util.escapeHTML($data[item], true) %></li>\
                   <% } %>',  //ģ�����,ģ�����ɵ����ݻᱻ�����ul��
        tempPrefix: '',   //ģ��ǰ׺�����硰ѡ�����С���<li data-val="">ѡ������</li>
        valInput: null,    //�洢��ѡ��Ϣvalue��input��
        delay: 300,    //�ӳ�ʱ��
        zIndex: null,   //�趨��ȫ��Ϣ���z-indexֵ
        isFocusShow: true,   //��inputEl��ý���ʱ�Ƿ���ʾ��Ϣ��ȫ����,Ĭ�ϲ�ȫ
        isDefaultItem: true,  //������������ʱ�Ƿ�Ĭ�ϱ�����һ�����ݱ�ѡ��,Ĭ��ѡ��һ��
        before: null,    //����ǰ�Ļص�����
        complete: null   //ѡ����ɺ�Ļص�����
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
            
            //ѡ��ĳ����ȫ����
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