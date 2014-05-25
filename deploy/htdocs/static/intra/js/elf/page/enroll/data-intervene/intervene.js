/**
 * @package FE.app.elf.enroll.data-intervene
 * @author: xiaotong.huangxt
 * @Date: 2012-12-21
 */

;(function($, T) {
    var readyFun = [
		function() {
			//保存按钮事件绑定
			$(".js-save").bind("click",function(e){
				save();
			});
			
			//生成页面按钮事件绑定
			$(".js-save-and-preview").bind("click",function(e){
				saveAndPreview();
			});
			
			//返回数据分类按钮事件绑定-按品
			$(".js-back-enrolloffer").bind("click",function(e){
				toEnrollOffer();
			});
			
			//返回数据分类按钮事件绑定-按商
			$(".js-back-filterMemberOffer").bind("click",function(e){
				toFilterMemberOffer();
			});
			
			filterMemberOffer
			//url输入框焦点改变时
			$(".js-change-img").bind("blur",function(e){
				changeImg($(this));
			});
			
			//选择区块下拉框的监听
			$("#selectBlock").bind("change",function(e){
				var url = $('#currentUrl').val();
				var blockId=$(this).children('option:selected').val();
				window.location = url + '&blockid=' + blockId + $("#isFromArrange").val();
			});
			
			//下架按钮的事件绑定
			$(".js-offline").bind("click",function(e){
				$(this).attr('disabled', 'disabled');
				
				//点击某个offer下架时，将重新分类按钮也置为不可用以及隐藏着的下拉框也置为不可用
				$(this).siblings(".js-change-block").attr('disabled', 'disabled');
				$(this).siblings(".js-select-block").attr('is-select', 'false');
				$(this).siblings(".js-select-block").attr('disabled', 'disabled');
				
				var offType = $(this).attr('off-type'),
					ajaxUrl = $("#offLine").val() + '?',
					topicid = $(this).attr('topic-id'),
					blockid = $(this).attr('block-id'),
					offerid = $(this).attr('offer-id'),
					memberid = $(this).attr('member-id'),
					_this = $(this);
					
				if( offType == "member" ) {
					ajaxUrl = ajaxUrl + 'topicid=' + topicid + '&blockid=' + blockid + '&memberid=' + memberid + '&opttype=sp_member';
				} else if( offType == "offer" ) {
					ajaxUrl = ajaxUrl + 'blockid=' + blockid + '&offerid=' + offerid + '&opttype=pin';
				} else if( offType == "member-offer" ) {
					ajaxUrl = ajaxUrl + 'topicid=' + topicid + '&blockid=' + blockid + '&offerid=' + offerid + '&memberid=' + memberid + '&opttype=sp_offer';
				}
				
				jQuery.ajax(ajaxUrl, {
					type: "GET",
					async: true,
					cache: false,
					data: {},
					dataType: 'jsonp',
					success: function(dataR, textStatus){
						if(dataR['success'] == 'true') {
							_this.html('已下架');
						}
					}
				});
			});
			
			//重新分类按钮的事件绑定
			$(".js-change-block").bind("click",function(e){
				$(this).css('display', 'none');
				var _select = $(this).siblings(".js-select-block");
				_select.removeClass('fd-hide');
				_select.attr('is-select', 'true');
			});
		}
	];

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
	
	JSON.stringify = JSON.stringify || function (obj){
		var t = typeof (obj);
		if (t != "object" || obj === null){
			// simple data type
			if (t == "string")
			obj = '"'+obj+'"';
			return String(obj);
		} else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj){
				v = obj[n]; t = typeof(v);
				if (t == "string")
				v = '"'+v+'"';
				else
				if (t == "object" && v !== null)
				v = JSON.stringify(v);
				json.push((arr ? "" : '"' + n + '":') + String(v));
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	};
	
	function buildFormData() {
		//拼凑重新分类的数据字符串
		var offerItem = [];
		
		$('.js-select-block').each(function(index,obj){
			var _this = $(this);
			if( _this.attr('is-select') == 'true' ) {
				var item = {};
				item['offerId'] = _this.attr('offer-id');
				item['oldBolckId'] = _this.attr('block-id');
				item['newBlockId'] = _this.children('option:selected').val();
				offerItem.push(item);
			}
		});
		
		if( offerItem.length != 0 ) {
			var changeOfferBlock = {};
			changeOfferBlock['item'] = offerItem;
			$('[name="auditForm"]').append("<input type='hidden' name='changeOfferBlock' value='"+JSON.stringify(changeOfferBlock)+"'/>");
		}
		
		//拼凑其他的数据
		$('.cell-product-2st').each(function(index,obj){
			var custom_index = 1;
			var custom_json={};
			var offer={};
			var offerjson ={};
			
			$(obj).find(".subattr").each(function(index,inp){
				var _inp = $(inp);
				var name = _inp.attr('name');
				var value = jQuery.trim(_inp.attr('value'));
				if(value!=''){
					offerjson[name]=value;
				}	
			}).end().find("input:text[name^='insp-']").each(function(index,inp){
				var _inp = $(inp);
				var name = _inp.attr('name');
				var value = _inp.attr('value');
				var pvalue = _inp.next("[name='insp-url']").attr('value');
				if(name=='insp-name'){
					offerjson[name]=value;
					custom_json["tdf_key_1"] = value;
				}else{
					offerjson[name]=value;
					custom_json["tdf_value_1"] = value;
				}
			}).end().find("input:text[name='custom_name']").each(function(index,inp){
				custom_index++;
				var _inp = $(inp);
				var name = _inp.attr('value');
				var value= _inp.next("[name='custom_value']").attr('value');

				offerjson[name]=value;
				custom_json["tdf_key_"+custom_index] = name;
				custom_json["tdf_value_"+custom_index] = value;
			}).end().find("input[name^='b_']").each(function(index,inp){
				var _inp = $(inp);
				var name = _inp.attr('name');
				var value = _inp.attr('value');
				offer[name]=value;
			});
			
			offerjson['custom']=custom_json;
			offer['offerJson']=offerjson;
			$('[name="auditForm"]').append("<input type='hidden' name='offerList' value='"+JSON.stringify(offer)+"'/>");
		});
		
		$('.p-complany').each(function(index,obj){
			var custom_index = 1;
			var custom_json={};
			var member={};
			var memberJson={};
			
			$(obj).find("input:text[name^='insp-']").each(function(index,inp){
				var _inp = $(inp);
				var name = _inp.attr('name');
				var value = _inp.attr('value');
				var spvalue = _inp.next("[name='insp-url']").attr('value');
				if(name=='insp-name'){
					memberJson[name]=value;
					custom_json["tdf_key_1"] = value;
				}else{
					memberJson[name]=value;
					custom_json["tdf_value_1"] = value;
				}
			}).end().find("input:text[name='custom_name']").each(function(index,inp){
				custom_index++;
				var _inp = $(inp);
				var name = _inp.attr('value');
				var value= _inp.next("[name='custom_value']").attr('value');
				
				memberJson[name]=value;
				custom_json["tdf_key_"+custom_index] = name;
				custom_json["tdf_value_"+custom_index] = value;
			}).end().find("input[name^='b_']").each(function(index,inp){
				var _inp = $(inp);
				var name = _inp.attr('name');
				var value = _inp.attr('value');
				member[name]=value;
			}).end().find(".subattr").each(function(index,inp){
				var _inp = $(inp);
				var name = _inp.attr('name');
				var value = jQuery.trim(_inp.attr('value'));
				if(value!=''){
					memberJson[name]=value;
				}
			});
			
			memberJson["custom"]=custom_json;
			member["memberJson"]=memberJson;
			$('[name="auditForm"]').append("<input type='hidden' name='memberList' value='"+JSON.stringify(member)+"'/>");
		});
	}

	function save(){
		buildFormData();
		document.auditForm.preview.value=false;
		document.auditForm.submit();
	}

	function saveAndPreview(){
		buildFormData();
		document.auditForm.target="_blank";
		document.auditForm.preview.value=true;
		document.auditForm.submit();
	}

	function toEnrollOffer(){
		var url = $('#enrollOffer').val();
		window.location=url;
	}


	function toFilterMemberOffer(){
		var url = $('#filterMemberOffer').val();
		window.location=url;
	}
	
	
	function changeImg(ele) {
		var url = jQuery.trim(ele.val());
		var newurl = praseImageUrl(url)
		if( url != '') {
			var oid = ele.attr('id');
			$('#img'+oid).attr('src', newurl);
		}
//		else {
//			console.log(ele.data('oldimg'));
//			$('#img'+oid).attr('src', ele.data('oldimg'));
//		}
	}

	function praseImageUrl(url) {
		var li = url.lastIndexOf('.');
		var pre = url.substring(0,li);
		if(pre.substring(pre.length-6) == 'search') {
			return url;
		}
		var ext = url.substring(li,url.length);
		var newurl = pre+".search"+ext;
		return newurl;
	}
})(jQuery, FE.tools);
