/**
 * @author lusheng.linls
 * @usefor �����ʾ�--���ƿؼ�-�Ա�����ƻ������Ƽ�
 * @dependency /static/intra/js/topic/module/survey.js
 * @date   2013.4.1
 */
 
;(function($, S){
    $.use('web-sweet', function(){
    AddDelMove = function(opts){
        this._init(opts);
    };
    AddDelMove.defConfig = {
        container:'.form', //����������ѡ����(selector)���������津����¼�����
        operateEl:'.item-operate', //�������󣬼������ӡ�ɾ���ƶ��������ѡ����(selector)�������Ӳ���������(����)��
        add:'.icon-add',  //���Ӵ����ѡ����(selector)
        del:'.icon-delete',  //ɾ����ѡ����(selector)
        moveup:'.icon-moveup',  //���ƴ����ѡ����(selector)
        movedown:'.icon-movedown',  //���ƴ����ѡ����(selector)
        maxCount: 5,
        afterAdd: null,  //�������Ӳ�����Ļص�����
        afterDel: null,  //����ɾ�������Ļص�����
        afterMoveup: null,  //�������Ʋ�����Ļص�����
        afterMovedown: null  //�������Ʋ�����Ļص�����
    };
    AddDelMove.prototype = {
        _init: function(opts){
            var self = this,
                config = $.extend({}, AddDelMove.defConfig, opts);
            
            self._setFirstAddLastStyle(config);
            //���Ӵ�����¼�
            $(config.container).delegate(config.operateEl+' '+config.add, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    cloneEl = operateEl.clone();
                
                operateEl.after(cloneEl);
                
                self._setFirstAddLastStyle(config);
                
                if (config.afterAdd){
                    config.afterAdd.call(this, cloneEl, el);
                }
                saveValue();
            });
            
            //ɾ�����¼�
            $(config.container).delegate(config.operateEl+' '+config.del, 'click', function(e){
                e.preventDefault();
                var el = $(this),
                    operateEl = el.closest(config.operateEl),
                    siblingEls = operateEl.siblings(config.operateEl);
                
                if (siblingEls.length>0){
                    operateEl.remove();
                }
                
                self._setFirstAddLastStyle(config);
                
                if (config.afterDel){
                	//add by 2013-02-18  pingchun.yupc �����ֵܽڵ����
                    config.afterDel.call(this, operateEl, el,siblingEls);
                }
                saveValue();
            });
        },
        _setFirstAddLastStyle: function(config){
            var items = $(config.operateEl, config.container),
                firstEl = items.eq(0),
                lastEl = items.eq(items.length-1);
            items.find(config.moveup).show();
            items.find(config.movedown).show();
            items.find(config.del).show();
            firstEl.find(config.moveup).hide();
            lastEl.find(config.movedown).hide();
            
            if (items.length===1){
                items.find(config.del).hide();
            }
            if (items.length===config.maxCount){
                items.find(config.add).hide();
            }else{
                items.find(config.add).show();
            }
        }
    }
	var item=S.formModelFindByItemId(716);
		var html='';
		if(!item.value){
	        html = '<dl class="item-form">\
				<dt></dt>\
				<dd class="item-title">\
				<span class="item-title1">��Ʒ����</span><span class="item-title2">�ҵı���</span>\
				</dd>\
	            <dd class="item-operate">\
	            	<input type="text" data-name="url" class="long-input baojia-input" value="" placeholder="��������Ҫ�Ƽ��Ĳ�Ʒ����" />\
	            	<span>�����۸�</span><input type="text" class="baojia-input" data-name="singlePrice" class="short-input" value="" /><span class="unit">Ԫ</span>\
	            	<span>��������</span><input type="text" class="baojia-input" data-name="minQuantity" class="short-input" value="" /><span class="unit">��</span>\
	                <a href="#" class="icon-admm icon-add">����</a>\
	                <a href="#" class="icon-admm icon-delete">ɾ��</a>\
	            </dd>\
	        </dl>';
            if(S.formModel.viewonly){
                html='';
            }
		}else{
            var htmlTpl = '<dl class="item-form">\
                <dt></dt>\
                <dd class="item-title">\
                <span class="item-title1">��Ʒ����</span><span class="item-title2">�ҵı���</span>\
                </dd>\
                <% for ( var i = 0; i < $data.length; i=i+1 ) { %>\
                <dd class="item-operate">\
                    <input <% if($data[i].viewonly){ %>disabled="true"<% } %> type="text" data-name="url" class="long-input baojia-input" value="<%=$data[i].url %>" placeholder="��������Ҫ�Ƽ��Ĳ�Ʒ����" />\
                    <span>�����۸�</span><input <% if($data[i].viewonly){ %>disabled="true"<% } %> type="text" class="baojia-input" data-name="singlePrice" class="short-input" value="<%=$data[i].price %>" data-value="<%=$data[i].price %>" /><span class="unit">Ԫ</span>\
                    <span>��������</span><input <% if($data[i].viewonly){ %>disabled="true"<% } %> type="text" class="baojia-input" data-name="minQuantity" class="short-input" value="<%=$data[i].quantity %>" data-value="<%=$data[i].quantity %>" /><span class="unit">��</span>\
                    <% if(!($data[i].viewonly)){ %>\
                    <a href="#" class="icon-admm icon-add">����</a>\
                    <a href="#" class="icon-admm icon-delete">ɾ��</a>\
                    <% }else{ %>\
                    <a <% if($data[i].url.indexOf("http://")==0 || $data[i].url.indexOf("https://")==0 ){ %> href="<%=$data[i].url %>" <% }else{ %> href="http://<%=$data[i].url %>" <% } %> target="_blank" >�鿴��Ʒ</a>\
                    <% } %>\
                </dd>\
                <% } %>\
            </dl>';
	        var htmlSweetInst = FE.util.sweet(htmlTpl);
            var data=$.parseJSON(item.value);
            if(!data){
                return ;
            }
            $.each(data,function(index,node){
                node.viewonly=S.formModel.viewonly;
            });
			html=htmlSweetInst.applyData(data);
		}
	    S.addToForm(item,'<div class="surm-'+item.base.id+'">'+html+'</div>');
        var hiddenItemNode=$('input[name="'+item.base.id+'"]');
        hiddenItemNode.val(item.value);
	    //�Ƽ����
		new AddDelMove({
					container:'.surm-716'
				});

        $('.surm-716').delegate('input.baojia-input', 'keyup', function(){
            var jqthis = $(this),
                preValue = jqthis.data('value')||'';
                value = jqthis.val();
            if(jqthis.data('name') === 'singlePrice'){
                if(window.isNaN(Number(value))){
                    jqthis.val(preValue);
                    return false;
                }else{
                    jqthis.data('value',value);
                }
            }else if(jqthis.data('name') === 'minQuantity'){
                var quantityReg = /[^0-9]/;
                if(quantityReg.test(value)){
                    jqthis.val(preValue);
                    return false;
                }else{
                    jqthis.data('value',value);
                }
            }
            saveValue();
        });

        function saveValue(){
            var a = [];
            var invalidMsg='';
            $('div.surm-716 dd.item-operate').each(function( index ){
                var el=$(this);
                var urlEl=el.find('input[data-name="url"]');
                var url=urlEl.val();
                var urlPlaceHolder=urlEl.attr('placeholder')
                var singlePrice=el.find('input[data-name="singlePrice"]').val();
                var minQuantity=el.find('input[data-name="minQuantity"]').val();
                if(urlPlaceHolder == url){
                    url='';
                }
                if(!singlePrice&&!minQuantity&&!url){
                    return;
                }
                if(!singlePrice||!minQuantity||!url){
                    invalidMsg='����д�����Ʒ���ӡ������۸���������';
                    return;
                }

                var safeUrl=/.*\.etao\.com|.*\.alibaba\.com|.*\.alibaba\.cn|.*\.www\.net\.cn|.*\.alibaba\.in|.*\.alibaba\.com\.cn|.*\.taobao\.com|.*\.taobao\.cn|.*\.taobao\.com\.cn|.*\.taobao\.net|.*\.tmall\.com|.*\.alipay\.com|.*\.alipay\.com\.cn|.*\.alipay\.net|.*\.zhifubao\.com|.*\.zhifu\.com|.*\.aliexpress\.com|.*\.1688\.com|.*\.1688\.com\.cn|.*\.1688\.cn|.*\.yahoo\.cn|.*\.yahoo\.com\.cn|.*\.alisoft\.com|.*\.alisoft\.cn|.*\.alisoft\.com\.cn|.*\.alimama\.com|.*\.alimama\.cn|.*\.alimama\.com\.cn|.*\.koubei\.com|.*\.koubei\.cn|.*\.aliimg\.com|.*\.aliimg\.net|.*\.alixueyuan\.net|.*\.alibado\.com|.*\.alibaba-inc\.com|.*\.aliloan\.com|.*\.ba\.hichina\.com/;

                if(!safeUrl.test(url)){
                    invalidMsg='���ӵ�ַ���ԣ������밢��Ͱͼ�����վ�����ӣ����Ա���';
                    return false;
                }

                a.push('{"id":"'+(index+1)+'","price":"'+Number(singlePrice)+'","quantity":"'+Number(minQuantity)+'","url":"'+url+'"}');
            });
            S.setModuleMsg(item,invalidMsg);
            if(!invalidMsg){
                hiddenItemNode.val(a.length ? '['+a.join(',')+']' : '');
            }
            
        }

    	//�����������
		S.Imfinish();
	});

})(jQuery,FE.survey);