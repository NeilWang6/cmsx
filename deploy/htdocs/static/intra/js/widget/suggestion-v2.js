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
        template: '<dl class="list-sugg">\
                    <% for (var item in $data) { %>\
                    <dt class="series-type-name"><%=$data[item].seriesTypeName %></dt>\
                    <% var list=$data[item]["list"];\
                    for (var i=0,l=list.length; i<l; i++) { %>\
                    <dd class="series-name<% if (i===l-1){%> last<%}%>" data-val="<%=list[i].id %>" data-name="<%=jQuery.util.escapeHTML(list[i].name, true) %>"><span class="txt"><%=jQuery.util.escapeHTML(list[i].name, true).replace(keyword, \'<i class="key-word">\'+keyword+\'</i>\') %></span></dd>\
                    <% } } %>\
                </dl>',  //ģ�����,ģ�����ɵ����ݻᱻ�����ul��
        //tempPrefix: '',   //ģ��ǰ׺�����硰ѡ�����С���<li data-val="">ѡ������</li>
        valInput: null,    //�洢��ѡ��Ϣvalue��input��
        selectEl: 'dd',    //�ж���ѡ���Ԫ��selector
        delay: 300,    //�ӳ�ʱ��
        css: null,   //�Զ��岹ȫ��Ϣ���css��ʽ
        isFocusShow: true,   //��inputEl��ý���ʱ�Ƿ���ʾ��Ϣ��ȫ����,Ĭ�ϲ�ȫ
        isDefaultItem: true,  //������������ʱ�Ƿ�Ĭ�ϱ�����һ�����ݱ�ѡ��,Ĭ��ѡ��һ��
        before: null,    //����ǰ�Ļص�����
        complete: null   //ѡ����ɺ�Ļص�����
    };
    T.Suggestion.prototype = {
        _init: function(inputEl, opts){
            var inputEl = $(inputEl);
            if (!inputEl[0]){ return; }
            
            var config = $.extend({}, T.Suggestion.defConfig, opts),
                //ul = $('<ul class="tui-suggestion"></ul>'),
                timeId, self = this,
                ui = this._insertUi(inputEl, config.css);;
            
            this.ui = ui;
            this.config = config;
            
            if (config.isFocusShow===true){
                inputEl.bind('focus', function(e){
                    e.preventDefault();
                    self._requestData(inputEl, ui, inputEl.val());
                });
            }
            
            inputEl.bind('input', function(e){
                if (timeId){ 
                    window.clearTimeout(timeId); 
                    timeId = null;
                }
                
                timeId = window.setTimeout(function(){
                    var val = inputEl.val();
                    self._requestData(inputEl, ui, val);
                } , config.delay);
            });
            
            //ѡ��ĳ����ȫ����
            ui.delegate(config.selectEl, 'click', function(){
                var selectEl = $(this),
                    selectEls = self._getSelectEls(ui, config.selectEl);
                selectEls.removeClass('selected');
                selectEl.addClass('selected');
                
                self._hideUl(inputEl, ui, selectEl);
            });
            
            //�󶨰����¼�
            self._bindKeydown(inputEl, ui, config.selectEl);
            
            
            $(document).click(function(e){
                var target = $(e.target);
                if (target.closest(ui).length===0 && target.closest(inputEl).length===0 
                        && ui.css('display')==='block'){
                    var selected = $(config.selectEl+'.selected', ui);
                    
                    if (!inputEl.val()){
                        selected = $();
                    }
                    self._hideUl(inputEl, ui, selected);
                }
            });
        },
        _insertUi: function(inputEl, css){
            var ui = $('<div class="tui-suggestion"></div>');
            inputEl.after(ui);
            this._setUiStyle(ui, inputEl, css);
            return ui;
        },
        _setUiStyle: function(ui, inputEl, css){
            var inputOffset = inputEl.position(),
                offset = {'top':parseInt(inputOffset['top'])+inputEl.outerHeight()-1, 'left':parseInt(inputOffset['left'])};
            ui.attr('style', '');
            ui.offset(offset);
            if (css){
                ui.css(css);
            }
        },
        _requestData: function(inputEl, ui, val){
            var config = this.config,
                data = config.data,
                self = this;
            
            if (config.before){
                config.before.apply(this, config);
            }
            
            val = val || '';
            data[config.paramName] = val;
            $.ajax(config.url+'?'+$.paramSpecial(data), {
                dataType: 'jsonp',
                success: function(o){
                    if (o['isSuccess']===true){
                        var data = o['data'];
                        $.use('web-sweet', function(){
                            var template = (val) ? '<% var keyword="'+val+'"; %>'+config.template : '<% var keyword=null; %>'+config.template;
                                strHtml = FE.util.sweet(template).applyData(data);
                            
                            /*if (config.tempPrefix){
                                strHtml = config.tempPrefix+strHtml;
                            }*/
                            ui.html(strHtml);
                            if (strHtml){
                                var uiDisplayStateOld = ui.css('display');
                                self._setUiStyle(ui, inputEl, config.css);
                                ui.show(0,function(){
                                    if(uiDisplayStateOld !== 'block'){
                                        inputEl.select();
                                    }
                                });
                                
                            }
                            
                            var isSelected = false,
                                inputVal = (config.valInput) ? $(config.valInput).val() : inputEl.val();
                            
                            $(config.selectEl, ui).each(function(i, el){
                                var el = $(el),
                                    selectVal = (config.valInput) ? el.data('val') : el.text();
                                
                                if (String(selectVal)===inputVal && isSelected===false){
                                    el.addClass('selected');
                                    isSelected = true;
                                }
                            });
                            
                            if (isSelected===false && config.isDefaultItem){
                                $(':first-child', ui).addClass('selected');
                            }
                        });
                    }
                }
            });
        },
        /**
         * ʹ�ð�����������ѡ��
         */
        _bindKeydown: function(inputEl, ui, selectEl){
            var self = this;
            ui.delegate(selectEl, 'mouseenter', function(){
                $(this).addClass('hover');
            });
            ui.delegate(selectEl, 'mouseleave', function(){
                $(this).removeClass('hover');
            });
            
            inputEl.keydown(function(e){
                //�������ϼ�
                if (e.keyCode===38){
                    self._selectNext(ui, 'up', selectEl);
                } else if (e.keyCode===40){  //�������¼�
                    self._selectNext(ui, 'down', selectEl);
                } else if (e.keyCode===13){  //���»س���
                    var currentEl = self._getCurrentEl(ui, selectEl),
                        selectEls = self._getSelectEls(ui, selectEl);
                    
                    selectEls.removeClass('selected');
                    currentEl.addClass('selected');
                    self._hideUl(inputEl, ui, currentEl);
                }
            });
        },
        _selectNext: function(ui, direction, selectEl){
            var selectEls = this._getSelectEls(ui, selectEl),
                currentIndex = this._getCurrentIndex(ui, selectEl, selectEls),
                nextIndex = this._getNextIndex(currentIndex, direction, selectEls),
                currentEl = selectEls.eq(nextIndex);
            
            selectEls.removeClass('hover');
            currentEl.addClass('hover');
            
            //������Ч��
            if (currentEl[0]){
                var currentElTop = currentEl.offset()['top'],
                    child = ui.children().eq(0),
                    cTop = child.offset()['top'],
                    distance = currentElTop - cTop,
                    scrollTop = ui.scrollTop(),
                    uiHeight = ui.height();
                
                if (distance>=scrollTop+uiHeight || distance<scrollTop){
                    ui.scrollTop(distance);
                }
            }
        },
        _getNextIndex:function(currentIndex, direction, selectEls){
            var index = currentIndex;
            switch(direction){
                case 'up':
                    if (currentIndex===-1){
                        index = selectEls.length-1;
                    } else {
                        index = index-1;
                    }
                    break;
                case 'down':
                    if (currentIndex===-1){
                        index = 0;
                    } else {
                        index = index+1;
                    }
                    break;
            }
            return index;
        },
        _getCurrentIndex: function(ui, selectEl, selectEls){
            selectEls = selectEls || this._getSelectEls(ui, selectEl);
            var selectedEl = this._getCurrentEl(ui, selectEl),
                i = selectEls.index(selectedEl);
            return i;
        },
        _getSelectEls: function(ui, selectEl){
            return $(selectEl, ui);
        },
        _getCurrentEl: function(ui, selectEl){
            return $(selectEl+'.hover', ui);
        },
        _hideUl: function(inputEl, ui, selected){
            var config = this.config,
                dataName = selected.data('name')
                name = (dataName) ? dataName : selected.text();
            inputEl.val(name);
            
            if (config.valInput){
                $(config.valInput).val(selected.data('val'));
            }
            ui.hide();
            
            if (config.complete){
                config.complete.apply(this, config, selected, ui);
            }
        },
        select: function(){
            return $(this.config.selectEl+'.selected', this.ui);
        },
        setConfig: function(config){
            this.config = $.extend({}, this.config, config);
        }
    }
})(jQuery, FE.tools);