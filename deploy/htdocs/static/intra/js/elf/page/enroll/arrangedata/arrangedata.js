;(function($, T) {
	function getSyncClsName(classStr){
		//console.log("find in cls "+classStr);
		var i1 = classStr.indexOf("sync-");
		//console.log(i1);
		 if(i1>=0){
			 var i2 = classStr.indexOf(" ", i1);
			 //console.log(i2);
			 if(i2>=0){
				 return classStr.substring(i1,i2);
			 }else{
				 return classStr.substr(i1);
			 }
		 }else{
			 return "";
		 }
	}
	/*�����ƶ�*/
	function changeSort(first, second){
		first.before(second);
		 if(second.hasClass("last")){
			 second.removeClass("last");
			 first.addClass("last");
		 }else if(first.hasClass("last")){
			 first.removeClass("last");
			 second.addClass("last");
		 }
	}
	/*�ƶ�����һλ*/
	function changeSortFirst(first, second){
		var prev = second;
		do{
			if(prev.hasClass("last")){
				prev.removeClass("last");
				prev = prev.prev();
				if(prev.size()>0){
					prev.addClass("last");
				}else{
					break;
				}
			}
			prev = prev.prev();
		}while(prev!=null && prev.size()>0);

		first.before(second);
	}
	/*�ƶ����̿�*/
	function changeMemberSort(first, second){
		first.before(second);
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
	function changeImg(ele) {
		var url = jQuery.trim(ele.val());
		var oid = ele.attr('id');
		var newurl = praseImageUrl(url)
		if( url != '') {
			$('.js_img_'+oid).each(function(i,el){
				$(el).attr('src', newurl);
			});
		}else{
			$('.js_img_'+oid).each(function(i,el){
				$(el).attr('src', $(el).data("src"));
			});
		}
	}

	function showSaveSuccess(){
		$.use('ui-dialog', function(){
			//���ж�������㣬�����ID��class
			var dialog = $('#savemsg.dialog-basic').dialog({
				center: true,
				fixed:true,
				timeout: 1000,
				beforeClose: function(){}
			});
		});
	}
    
    function getCustomClassName(el, type){
        var className = el.attr('class'),
            regClass = new RegExp('js-custom-'+type+'-\\d+'),
            result = className.match(regClass);
        
        return result && result[0];
    }

	var readyFun = [
        function(){
            //��ʾ ͬ�� ��ť
            $('#prebox').on('focus', '.defined, .define-value', function(){
                var el = $(this);
                setTimeout(function(){
                    el.nextAll('.define-copy').addClass('show-a');
                }, 200);
            });
            //���� ͬ�� ��ť
            $('#prebox').on('blur', '.defined, .define-value', function(e){
                var el = $(this);
                setTimeout(function(){
                    el.nextAll('.define-copy').removeClass('show-a');
                }, 200);
                
            });
            
            $('#prebox').on('click', '.define-copy', function(e){
                e.preventDefault();
                if (confirm('��ȷ���Ƿ񽫸������ݸ��Ƶ�������Ʒ/��˾�ϣ�ͬһ��������Ч�� ��')){
                    var copyEl = $(this),
                        customNameEl = copyEl.prevAll('.defined'),
                        customNameVal = customNameEl.val(),
                        customUrlEl = copyEl.prevAll('.define-value'),
                        customUrlVal = customUrlEl.val(),
                        customNameClass = getCustomClassName(customNameEl, 'name'),
                        customUrlClass = getCustomClassName(customUrlEl, 'url'),
                        containerEl = copyEl.closest('.arrange-main');
                    customNameClass && containerEl.find('.'+customNameClass).val(customNameVal);
                    customUrlClass && containerEl.find('.'+customUrlClass).val(customUrlVal);
                }
            });
        },
	   	 //�¼���
	     function() {
	    	 //����������ť
	    	 $(".arrange-main .icon").bind("click",function(e){
	    		 var $this = $(this);
	    		 var thisarr = $this.closest(".arrange-main");
	    		 if(thisarr.hasClass("show-arrange")){
	    			 thisarr.removeClass("show-arrange").addClass("hide-arrange");
	    		 }else{
	    			 $(".show-arrange").each(function(e){
	    				 $(this).removeClass("show-arrange").addClass("hide-arrange");
	    			 });
	    			 thisarr.removeClass("hide-arrange").addClass("show-arrange");
	    		 }
	    		 $("html, body").animate({ scrollTop: 0 }, 120);
	    	 });
	    	 //���ڸ���
	    	 $('.arrange-main .icon-copy').bind('click',function(){
	    	 	var _this = this
	    	 	$('.dialog-basic').find('section').html('��ȷ���Ƿ񽫴ˡ�'+ $(this).parent().find('span').eq(1).text() +'���еĸ�Ԥ���ݸ��Ƶ�ͬһ������е�����������')
				$.use('ui-dialog', function(){
                    //���ж�������㣬�����ID��class
                    var dialog = $('.dialog-basic').dialog({
                        center: true,
                        fixed:true,
                        open: function(){
                        	$('.dialog-basic .btn-blue').unbind('click').bind('click',function(){
        			    	 	var newCopyData = {};
					    	 	var content = $(_this).closest('.arrange-main');
					    	 	//copy offiddata to newcopydata
					    	 	content.find('input[name=b_offerId]').each(function(){
					    	 		var offerId = $(this).val();
					    	 		var detialDom = {}
					    	 		$(this).closest('dl').find('dd input').each(function(i){
					    	 			//var name = $(this).attr('name');
					    	 			detialDom[i] = $(this).val();
					    	 		})
					    	 		newCopyData['offerId'+offerId] = detialDom;

					    	 	})
					    	 	//copy memberiddata tonewcopydata
					    	 	content.find('.js-memberId').each(function(){
					    	 		var memberId = $(this).val();
					    	 		var detialDom = {};
					    	 		$(this).closest('dl').find('input').each(function(i){
					    	 			//var name = $(this).attr('name');
					    	 			detialDom[i] = $(this).val();
					    	 		})
					    	 		newCopyData['memberId' + memberId] = detialDom;
					    	 	})

					    	 	//add data
					    	 	$('.arrange-main').find('input[name=b_offerId]').each(function(){
					    	 		var nowofferId = 'offerId' + $(this).val();
					    	 		var _this = this;
					    	 		for ( a in newCopyData){
					    	 			if( a === nowofferId ) {
					    	 				for ( b in newCopyData[a] ) {
					    	 					$(_this).closest('dl').find('dd input').eq(b).val(newCopyData[a][b]);
					    	 				}
					    	 			}
					    	 		}
					    	 	})

					    	 	//add memberId data
					    	 	$('.arrange-main').find('input[name=js-memberId]').each(function(){
					    	 		var nowmemberId = 'memberId' + $(this).val();
					    	 		var _this = this;
					    	 		for( a in newCopyData ){
					    	 			if( a === nowmemberId ) {
					    	 				for( b in newCopyData[a] ) {
					    	 					$(_this).closest('dl').find('input').eq(b).val(newCopyData[a][b]);
					    	 				}
					    	 			}
					    	 		}

					    	 	})
					    	 	$('.dialog-basic .btn-cancel, .dialog-basic .close').trigger('click');
                        	})
							//��ȷ��������¼���ֻ��domReady��ʱ��ִ�У����Բ������´������use��
							$('.dialog-basic .btn-cancel, .dialog-basic .close').unbind('click').click(function(){
								dialog.dialog('close');
							});
                        }
                    });

                });


	    	 })
	    	 //offer�ƶ���ť
	    	 $(".list-offers .first-icon").bind("click",function(e){
	    		 var cur = $(this).parent().parent();
	    		 if(cur.prev().size()>0){
		    		 var first = cur.parent().find(":first");
		    		 changeSortFirst(first,cur);
	    		 }
	    	 });
	    	 $(".list-offers .left-icon").bind("click",function(e){
	    		 var cur = $(this).parent().parent();
	    		 var prev = cur.prev();
	    		 if(prev.size()>0){
	    			 changeSort(prev,cur);
	    		 }

	    	 });
	    	 $(".list-offers .right-icon").bind("click",function(e){
	    		 var cur = $(this).parent().parent();
	    		 var next = cur.next();
	    		 if(next.size()>0){
	    			 changeSort(cur,next);
	    		 }
	    	 });
	    	 $(".p-complany-offer .first-icon").bind("click",function(e){
	    		 var cur = $(this).parent().parent();
	    		 if(cur.prev().size()>0){
		    		 var first = cur.parent().find(":first");
		    		 changeSortFirst(first,cur);
	    		 }
	    	 });
	    	 $(".p-complany-offer .left-icon").bind("click",function(e){
	    		 var cur = $(this).parent().parent();
	    		 var prev = cur.prev();
	    		 if(prev.size()>0){
	    			 changeSort(prev,cur);
	    		 }

	    	 });
	    	 $(".p-complany-offer .right-icon").bind("click",function(e){
	    		 var cur = $(this).parent().parent();
	    		 var next = cur.next();
	    		 if(next.size()>0){
	    			 changeSort(cur,next);
	    		 }
	    	 });
	    	 //member �ƶ���ť
	    	 $(".p-complany .up-icon").bind("click",function(e){
	    		 var cur = $(this).parent().parent().parent();
	    		 var prev = cur.prev();
	    		 if(prev.size()>0){
	    			 changeMemberSort(prev,cur);
	    		 }
	    	 });
	    	 $(".p-complany .down-icon").bind("click",function(e){
	    		 var cur = $(this).parent().parent().parent();
	    		 var next = cur.next();
	    		 if(next.size()>0){
	    			 changeMemberSort(cur,next);
	    		 }
	    	 });
	    	 var isChanged = false;
	    	 //��Ԥ����ͬ��
	    	 $("#prebox .container input").each(function(i, el){
	    		 $(el).bind("blur",function(e2){
	    			 var $this = $(this);
	    			 var classStr = $this.attr("class");
	    			 var val = $this.val();
	    			 isChanged = true;
	    			 if(classStr && classStr.length>0 && classStr.indexOf("sync-")>=0){
	    				 var syncClsname = getSyncClsName(classStr);
	    				 if(syncClsname.length>0){
	    					 //console.log("syncClsname=" + syncClsname);
	    					 $("."+syncClsname).each(function(i,se){
	    						 var $sameEl = $(se);
	    						 if($this.data("detailid")!=$sameEl.data("detailid")){
	    							 $sameEl.val(val);
	    							 //console.log("sync val success");
	    						 }else{
	    							 //console.log("skip");
	    						 }
	    					 });
    						 //����֪ͨ
							 if($this.hasClass("js-change-img")){
								 changeImg($this);
							 }
	    				 }
	    			 }else{
	    				//console.log($this.attr("name")+".class="+classStr);
	    			 }
	    		 });

	    	 });
	    	 $(window).bind('beforeunload', function(e){
	                if (isChanged){
	                	if ( /Firefox[\/\s](\d+)/.test(navigator.userAgent) && new Number(RegExp.$1) >= 4) {
	                	      if(confirm('����������δ���棬ȷ��Ҫ�뿪��ҳ��')){
	                	          history.go();
	                	      } else{
	                	          window.setTimeout(function() { window.stop(); }, 1);
	                	      }
	                	  } else{
	                	      return '����������δ���棬ȷ��Ҫ�뿪��ҳ��';
	                	  }
	                } else {
	                    return;
	                }
	         });
	 		 $("#audit-save").bind("click",function(e){
	 			$(this).attr("disabled",true);
	 			$(window).unbind('beforeunload');
	 			save();
	 			//$(this).attr("disabled",false);
	 		 });
	 		$("#audit-preview").bind("click",function(e){
	 			var pageid= $(this).data("pageid");
	 			if(pageid==""){
	 				alert("Ԥ��ǰ��Ҫ�ȹ���ҳ��");
	 			}else{
	 				window.open($("#previewUrl").attr("href"),"_blank");
	 			}
	 		 });
	 		 if($("#savemsg").size()>0){
	 			 showSaveSuccess();
	 		 }
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


	function save(){
		buildFormData();
		document.auditForm.submit();
	}
	function buildFormData() {
		//ƴ������
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
					if(pvalue!="" && value==""){
						value = "�Զ���"+custom_index;;
					}
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
				if(value!="" && name==""){
					 name="�Զ���"+custom_index;
				}
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
					if(spvalue!="" && value==""){
						value = "�Զ���"+custom_index;;
					}
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
				if(value!="" && name==""){
					 name="�Զ���"+custom_index;
				}
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

})(jQuery, FE.tools);