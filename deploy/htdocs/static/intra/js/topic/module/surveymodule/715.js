/**
 * @author lusheng.linls
 * @usefor �����ʾ�--���ƿؼ�-�Ա�����ƻ�
 * @dependency /static/intra/js/topic/module/survey.js
 * @date   2013.3.15
 */
;(function( jq,S ){
	var $=jq;
	var item=S.formModelFindByItemId(715);
	$.use('web-sweet', function(){
        var htmlTpl = '<div class="surm-offercustommade">\
			<div class="offer-list">\
				<% for ( var i = 0; i < $data.length; i=i+4 ) { %>\
			    <ul class="offer-list-row" <% if($data[i].viewonly){ %>style="padding-bottom:40px;"<% } %> >\
			    	<% for ( var j = 0; j < 4 && i+j< $data.length; j++ ) { %>\
				    <li>\
					    <div class="offer-content <% if($data[i+j].viewonly){ %>offer-hover<% } %>" data-id="<%=$data[i+j].id %>">\
							<div class="offer-item">\
        						<div class="image">\
									<a target="_blank" title="<%=$data[i+j].title %>" href="<%=$data[i+j].url %>"><img width="160" height="160" src="<%=$data[i+j].img %>" alt="<%=$data[i+j].title %>"/></a>\
						    	</div>\
								<div class="title">\
									<a target="_blank" title="" href="<%=$data[i+j].url %>"><%=$data[i+j].title %></a>\
        						</div>\
								<div class="add-label">\
							    </div>\
							</div>\
							<% if($data[i+j].openPrice == "N" || $data[i+j].openPrice == "n"){ %>\
				        	<% if($data[i+j].viewonly){ %>\
				        		<div class="offer-black-view"></div>\
								<div class="offer-over-view"></div>\
					        	<div class="offer-operate">\
								<div>\
									<% if(!($data[i+j].viewonly)){ %>\
					                <a class="close-icon" href="#"></a>\
					                <% } %>\
								</div>\
								<div class="op-price">\
									<div class="item"><span class="mg-l14">�����۸�</span><input <% if($data[i+j].viewonly){ %>disabled="true"<% } %> type="text" class="baojia-input" value="<%=$data[i+j].surm_price %>" data-name="singlePrice"/><span>Ԫ</span></div>\
									<div class="item"><span>��������</span><input <% if($data[i+j].viewonly){ %>disabled="true"<% } %> type="text" class="baojia-input" value="<%=$data[i+j].surm_quantity %>" data-name="minQuantity"/><span>��</span></div>\
									<% if(!($data[i+j].viewonly)){ %>\
									<div class="op-submit"><a href="#" class="baojia-submit"></a></div>\
									<% } %>\
								</div>\
        						<% }else{ %>\
								<div class="offer-black"></div>\
								<div class="offer-over"></div>\
        						<% }%>\
							<% }else{ %>\
				        	<div class="offer-operate">\
							<div>\
								<% if(!($data[i+j].viewonly)){ %>\
				                <a class="close-icon" href="#"></a>\
				                <% } %>\
							</div>\
        					<div class="op-price">\
								<div class="item"><span class="mg-l14">�����۸�</span><input <% if($data[i+j].viewonly){ %>disabled="true"<% } %> type="text" class="baojia-input" value="<%=$data[i+j].surm_price %>" data-name="singlePrice"/><span>Ԫ</span></div>\
								<div class="item"><span>��������</span><input <% if($data[i+j].viewonly){ %>disabled="true"<% } %> type="text" class="baojia-input" value="<%=$data[i+j].surm_quantity %>" data-name="minQuantity"/><span>��</span></div>\
								<% if(!($data[i+j].viewonly)){ %>\
								<div class="op-submit"><a href="#" class="baojia-submit"></a></div>\
								<% } %>\
        					</div>\
					</div>\
		        	<% }%>\
					</div>\
				</li>\
				<% } %>\
			</ul>\
			<% } %>\
		</div>\
	</div>';
        var htmlSweetInst = FE.util.sweet(htmlTpl);
        var data=$.parseJSON(item.conf.defaultValue);
        if(!data){
        	return ;
        }
        if(item.value){
        	var lastValuesObj={};
	        $.each($.parseJSON(item.value),function(index,node){
	        	lastValuesObj[node.id]=node;
	        });
	        $.each(data,function(index,node){
	            if(lastValuesObj&&lastValuesObj[index+1]){
	                node.surm_price=lastValuesObj[index+1].price;
	                node.surm_quantity=lastValuesObj[index+1].quantity;
	            }
	        });
	    }
	    $.each(data,function(index,node){
            node.viewonly=S.formModel.viewonly;
        });
		S.addToForm(item,htmlSweetInst.applyData(data));

	    var storeData = {};
		var jqdatastoreNode = jq('input[name="'+item.base.id+'"]');
		jqdatastoreNode.val(item.value);
		var convertJson = function(){
			var a = [];					
			jq.each( storeData, function( idx,node){
				var itemId = node["id"];
				var url = jq('div.surm-offercustommade div.offer-content[data-id="'+itemId+'"] .title a').attr('href');
				a.push('{"id":"'+node["id"]+'","price":"'+node["price"]+'","quantity":"'+node["quantity"]+'","url":"'+url+'"}');
			});
			return a.length ? '['+a.join(',')+']' : '';
		};
		//��ʼ����� ������������click
		var initDefaultValue = function(){
			jq.each( $.parseJSON(item.value), function( idx,node){
				storeData[node.id] = node;
				var jqcontentNode=$('div.offer-content[data-id="'+node.id+'"]');
				if(!jqcontentNode.hasClass("offer-baojia")){
				    jqcontentNode.addClass("offer-baojia");
				}
			});
		};
		var bind = function(){
		jq('div.surm-offercustommade').delegate( 'div.offer-content','mouseenter', function(){
		    var jqthis = jq(this), 
			    timer = jqthis.data("timer");
			timer && clearTimeout( timer );
		    jqthis.data("timer", setTimeout( function(){
			    itemId = jqthis.data("id"),
				jqinputNode = jqthis.find('div.offer-operate').find('input.baojia-input');
				if(storeData[itemId] === undefined){
					jqinputNode.eq(0).val('');
					jqinputNode.eq(1).val('');
				}else{
					jqinputNode.eq(0).val(storeData[itemId]["price"]);
					jqinputNode.eq(1).val(storeData[itemId]["quantity"]);
				}
				if(jqthis.hasClass("offer-baojia")){
					jqthis.addClass("offer-hover");
				}else{
					jqthis.addClass("offer-firsthover");
				}			
			}, 200 ));
										                    								
		}).delegate('div.offer-content', 'mouseleave', function(){
		    var jqthis = jq(this),
			    timer = jqthis.data("timer");
			timer && clearTimeout( timer );
		    jqthis.removeClass("offer-hover");
			jqthis.removeClass("offer-firsthover");
		}).delegate('div.offer-operate a.close-icon', 'click', function(e){
		    e.preventDefault();
			var jqinputNode = jq(this).closest('div.offer-operate').find('input.baojia-input'),
			    jqcontentNode = jq(this).closest('div.offer-content'),
			    itemId = jqcontentNode.data("id");
		    delete storeData[itemId];
			jqdatastoreNode.val(convertJson());	
			jqinputNode.eq(0).val('');
			jqinputNode.eq(1).val('');
		    jqcontentNode.removeClass("offer-baojia").addClass("offer-firsthover").removeClass("offer-hover");
			
		}).delegate('a.baojia-submit', 'click', function(e){
		    e.preventDefault();
			var jqinputNode = jq(this).closest('div.op-price').find('input.baojia-input'),
	            jqcontentNode = jq(this).closest('div.offer-content'),				
			    price = jqinputNode.eq(0).val(),
			    quantity = jqinputNode.eq(1).val(),
				itemId = jqcontentNode.data("id");
			if(price === '' || quantity === ''){
			    return false;
			}
			if(!jqcontentNode.hasClass("offer-baojia")){
			    jqcontentNode.addClass("offer-baojia").addClass("offer-hover").removeClass("offer-firsthover");
			}					
			storeData[itemId] = {
				id: itemId,
				price: Number(price),
				quantity: Number(quantity)
	        };
			jqdatastoreNode.val(convertJson());
		}).delegate('input.baojia-input', 'keyup', function(){
		    var jqthis = jq(this),
			    preValue = jqthis.data('value')||'';
			    value = jqthis.val();
			if(jqthis.data('name') === 'singlePrice'){  //����У��
			    if(value === '' || window.isNaN(Number(value))){
				    jqthis.val(preValue);
					return false;
				}else{
				    jqthis.data('value',value);
				}
			}else if(jqthis.data('name') === 'minQuantity'){  //����У��
			    var quantityReg = /[^0-9]/;
				if(value === '' || quantityReg.test(value)){
				    jqthis.val(preValue);
					return false;
				}else{
				    jqthis.data('value',value);
				}
			}
		});
		};
		if(item.value){
			initDefaultValue();
		}
		jq(function(){
			if(!S.formModel.viewonly){
				bind();
			}
		});
		S.Imfinish();
    });

})(jQuery,FE.survey);