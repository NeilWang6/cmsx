/**
 * @author shanshan.hongss
 * @usefor ��Ŀ - ��ѡ����ʽ����ÿ��һ����Ŀ�µ�����ĿΪ��ѡ�Ĭ����ʽ��
 * @date   2013.09.03
 * @rely   /static/intra/js/widget/tui-mult-choice.js  ��ѡ����ѡ�ؼ�
 */

;(function($, D) {
    D.CatalogBox = function(url, opts){
        this._init(url, opts);
    };
    
    D.CatalogBox.defConfig = {
        params: null,   //��������ʱ����Ĳ���
        container: null,
        valueInput: null,   //���module������Ŀ���������������ڲ�ֻ�����ʼ����ʱ�򣬲������ύ��ݣ������Ŀ��','�ָ�
        template: '<% var isFirst=true; for( var p in $data) {  if(isFirst===true){  isFirst=false;%>\
                    <dl class="item-form">\
                        <dt class="topic must-fill"><%= $data[p].name %>��</dt>\
                        <dd>\
                            <p class="tui-mult-choice">\
                                <% for(var i=0, l=$data[p]["children"].length; i<l; i++) {  %>\
                                <span class="item-choice" data-val="<%= $data[p]["children"][i].code %>"><%= $data[p]["children"][i].name %></span>\
                                <% } %>\
                            </p>\
                            <input type="hidden" data-valid="{required:true,cache:false,key:\'<%= $data[p].name %>\'}" id="catalog-<%= $data[p].code %>" class="catalog-ids" value="" />\
                            <span class="validator-tip">������ʾ</span>\
                        </dd>\
                    </dl> <% } } %>',
        isDefaultStyle: true,  //�Ƿ�ʹ��Ĭ����ʽ��
        success: null,  //��Ŀ�������ɹ���ص�
        multOpts: {}   //��ѡ��ؼ��������� tui-mult-choice.js
        
    };
    
    D.CatalogBox.prototype = {
        _init: function(url, opts){
            if (!url){ return; }
            
            var config = $.extend({}, D.CatalogBox.defConfig, opts);
            this._request(url, config);
        },
        _request: function(url, config){
            var self = this;
            
            $.ajax({
                url: url,
                data: config.params,
                dataType: 'jsonp',
                success: function(json){
                    if (json.status==='success' && json.data){
                        var containerEl = $(config.container),
                            data = self._getObjCatalog(json['data']),
                            strHtml = FE.util.sweet(config.template).applyData(data);
                        containerEl.html(strHtml);
                        
                        if (config.valueInput){
                            var valueInput = $(config.valueInput),
                                objValue = self._getObjValue(valueInput.val(), json['data']);
                                
                            for (var pre in objValue){
                                $('#catalog-'+pre, containerEl).val(objValue[pre].join());
                            }
                        }
                        
                        if (config.isDefaultStyle===true){
                            var itemEls = containerEl.find('.item-form');
                            itemEls.each(function(){
                                var itemEl = $(this);
                                
                                self._setMultChoice(itemEl, config.multOpts);
                            });
                        }
                        
                        if ($.type(config.success)==='function'){
                            config.success.call(this, json, containerEl);
                        }
                    }
                }
            });
        },
        /**
         * @methed _getObjCatalog ��ȡ��Ŀ��ݣ��˷���Ŀǰ֧��������Ŀ�����
         * @param data ���󷵻ص���Ŀ���
         * @return ��ݽṹ�� { cataId(��Ŀid����):{"level":"1","count":44,"name":"����","code":"14","parentCode":"0",children:[{}...]}, ...}
         */
        _getObjCatalog: function(data){
            var objCatalog = {};
            
            for (var i=0, l=data.length; i<l; i++){
                
                if (data[i].level==='1'){
                    var code = data[i].code;
                    if (!objCatalog[code]){
                        objCatalog[code] = data[i];
                    } else if (objCatalog[code]['children']){
                        var children = objCatalog[code]['children'];
                        objCatalog[code] = data[i];
                        objCatalog[code]['children'] = children;
                    }
                } else if(data[i].level==='2'){
                    var parentCode = data[i].parentCode;
                    if (!objCatalog[parentCode]){
                        objCatalog[parentCode] = {};
                    }
                    if (!objCatalog[parentCode]['children']){
                        objCatalog[parentCode]['children'] = [];
                    }
                    objCatalog[parentCode]['children'].push(data[i]);
                }
            }
            return objCatalog;
        },
        /**
         * @methed _getObjValue ��ȡ��Ӧ����id����Ŀid����
         * @param val ����������з��ص�ֵ
         * @param data ���󷵻ص���Ŀ���
         * @return ��ݽṹ�� { parentCode(������Ŀid����):[id,...] }
         */
        _getObjValue: function(val, data){
            var arrVal = val.split(','),
                objVal = {};
            
            for (var i=0, l=arrVal.length; i<l; i++){
                for (var n=0, len=data.length; n<len; n++){
                    if (arrVal[i]===data[n]['code']){
                        if (!objVal[data[n]['parentCode']]){
                            objVal[data[n]['parentCode']] = [];
                        }
                        objVal[data[n]['parentCode']].push(arrVal[i]);
                    }
                }
            }
            return objVal;
        },
        _setMultChoice: function(itemEl, multOpts){
            var config = {
                area: itemEl,
                valueInput: $('.catalog-ids', itemEl)
            };
            config = $.extend({}, config, multOpts);
            
            new FE.tools.MultChoice(config);
        }
    };
    
})(dcms, FE.dcms);