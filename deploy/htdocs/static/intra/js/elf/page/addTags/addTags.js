/**
 * @package FE.app.elf.tag.addoffer
 * @author: wangxiaojun
 * @Date: 2012-12-10
 */

;(function($, E){
	var error,
	pageCount = 50,
	tagIds = $('#tag_ids'),
	total = 0,
	readyFun = [
	            //�����¼����
	            function(){
	            	$(document).keydown(function(event){  //������Ӧ����
	            		event = event || window.event;  //���ݶ������
	            		if(event.keyCode==13){               //�����س���
	            			$('#isearch-button').trigger('click');
	            			if($('#isearch-text').val()!=''){
	            				return false;
	            			}
	            		}
	            	});
	            }, 
	            
	            //���ѡ�и�ѡ�����
	            function(){
	            	var select_attr = $('#selectAttr');
	            	$("#listbox").delegate("input:checkbox", "click",function(){
	            		var this_id = $(this).data('id'),
	            		this_content = $(this).data('content');
	            		//���ѡ���������ѡ����
	            		if($(this).prop("checked")){
	            			var s_html = "<span title='"+this_content+"' data-id='"+this_id+"'   class='attribute-one'><span  class='attribute'><strong>"+this_id+"</strong> "+this_content+"</span><a href='#' data-id="+this_id+"></a></span>";
	            			select_attr.append(s_html);
	            			tagIds.val(tagIds.val()+this_id+":");
	            			//���δѡ����ɾ����ѡ����
	            		}else{
	            			tagIds.val(tagIds.val().replace(this_id+':','')) ;
	            			select_attr.find('.attribute-one').each(function(){
	            				var data_id = $(this).data('id');
	            				if(data_id === this_id){
	            					$(this).remove();
	            				}
	            			});
	            		}
	            	});        			
	            },
	            
	            //��ѡ��ǩɾ������
	            function(){
	            	$("#tag-handle").delegate("a", "click",function(event){
	            		event.preventDefault();
	            		var idTxt = $(this).data('id');
	            		$(this).closest('.attribute-one').remove();
	            		//�����б��︴ѡ��ֵ
	            		$('#listbox li').each(function(){
	            			var obj_check = $(this).find('input:checkbox');
	            			var this_id = obj_check.data('id');
	            			if(this_id === idTxt && obj_check.prop('checked')){
	            				obj_check.prop('checked',false);
	            				tagIds.val(tagIds.val().replace(this_id+':','')) ;
	            			};
	            		});
	            	});
	            },
	            
	            //���������������ɫ�ı�
	            function(){
	            	$('#isearch-button').click(function(){
	            		var txt_val = $('#isearch-text').val().trim(),
	            		s_html = $('#listbox').html(),
	            		indexs = 0;
	            		if(txt_val.length==0){
	            			$('#isearch-result span').css('display','none');
	            			return;
	            		}
	            		//���֮ǰ����ɫ
	            		var n_html =  s_html.replace(/(\<span class="back-yellow"\>)([^\<]*)(\<\/span\>)/g, '$2');
	            		//����ƥ���ϵı���ɫ
	            		var keywordReg = new RegExp('(\<strong\>[^\<]*)('+txt_val+')([^\<]*)|(\<em\>[^\<]*)('+txt_val+')([^\<]*)', 'g');
	            		n_html = n_html.replace(keywordReg, function(a, b, c, d, e, f, g){
	            			if (b){
	            				return b+'<span class="back-yellow">'+c+'</span>'+d;
	            			}
	            			if (f){
	            				return e+'<span class="back-yellow">'+f+'</span>'+g;
	            			}
	            		});
	            		$('#listbox').html(n_html);
	            		//��������֮ǰ�Ѿ����ϵı�ǩ
	            		$('#listbox li').each(function(){
	            			var obj_check = $(this).find('input:checkbox'),
	            			this_id = obj_check.data('id'),
	            			this_name = obj_check.data('content');

	            			if(tagIds.val().indexOf(this_id)>=0){
	            				obj_check.prop('checked',true);
	            			}

	            			if(this_name.toString().indexOf(txt_val)>=0 || this_id.toString().indexOf(txt_val)>=0){
	            				indexs++;
	            			}
	            		});
	            		//��ʾ��ǰ��ѯ���
	            		$('#isearch-result label').text(txt_val);
	            		$('#isearch-result em').text(indexs);
	            		$('#isearch-result span').css('display','block');
	            	});
	            },

	            function(){
	            	var closes = $('header .close'),
	            	tagTitle = $('#tagTitle');
	            	//������
	            	$("#add").bind("click",function(e){
	            		closes.css('display','none');
	            		tagTitle.text('���ڴ��');
	            		tagStart('add');
	            	});

	            	//ȥ�����
	            	$("#remove").bind("click",function(e){
	            		closes.css('display','none');
	            		tagTitle.text('����ȥ��');
	            		tagStart('remove');
	            	});

	            	//����ر�
	            	$("header .close").bind('click',function(e){
	            		closeDialog();
	            	});
	            }
	      ];
	
	//��ʼ���׼��
	function tagStart(flag){
		var tagString = "",
		offerIds,
		message = $('#message'),
		error = "";
		//ȡ����������offer����memberֵ
		offerIds = $('#tagedOfferIds').attr('value').split('\n');
		if(offerIds.length<=1 && offerIds[0] === ''){
			message.text("������Ҫ������offerId����memberId��");
			message.css('display','block');
			$('#tagedOfferIds').focus();
			return;
		}
		//����ƴ��tagֵ
		$('#selectAttr .attribute-one').each(function(){
			tagString += $(this).data('id') + ";";
		});
		if(tagString.split(";").length<=1){
			message.text("��ѡ��Ҫ�����ı�ǩ��");
			message.css('display','block');
			$('#isearch-text').focus();
			return;
		}

		//�򿪸���
		openDialog(tagString,offerIds,flag);
	}

	//�������ݷ��ؽ����ʾ������
	function computeTotal(offerIds){
		if(offerIds[offerIds.length-1]===''){
			total = Math.ceil((offerIds.length-1)/pageCount);
		}else{
			total = Math.ceil(offerIds.length/pageCount);
		}
	}

	//�򿪸���
	function openDialog(tagString,offerIds,flag){
		$.use('ui-dialog', function(){
			$('.dialog-basic').dialog({
				fixed:true,
				center: true,
				open:function(){
					computeTotal(offerIds);
					//�򿪽�����
					openProgress(flag);
					doTag(tagString,offerIds,flag,0,0);
				}
			});
		});
	}
	
	//�򿪸��������
	function openProgress(flag){
		$("#progressbar").progressbar({
			value: 0,
			complete: function(event, ui){
				$("#progressbar").progressbar("disable");
				$('header .close').css('display','block');
				if($.trim(error) != ''){
					$('#tagTitle').text('����ʧ�ܣ���ر����ԣ�');
					return;
				}
				if(flag === 'add' ){
					$('#tagTitle').text('���ɹ���');
				}; 
				if(flag === 'remove'){
					$('#tagTitle').text('ȥ��ɹ���');
				}; 
			}
		});	
	}

	//��ʼ������ȥ��
	function doTag(tagString,offerIds,flag,count,index){
		var url = $('#ajaxUrl').val();
		if (index < total)
		{
			var idArr = new Array();
			for(var j=index*pageCount;j<(index+1)*pageCount;j++){
				var offerId = $.trim(offerIds[j]);
				if(offerId.length>0){
					idArr.push(offerIds[j]);
				}
			}
			
			$.ajax(url,{
				type: "POST",
				//async: false,
				data: {tags:tagString,targetIds:idArr.join(";"),flag:flag},
				dataType:"json",
				success:function(data){
					if(data.resultCode==1){
						error = "����ʧ�ܣ�";
					}else if((data.resultCode==2)||(data.resultCode==3)){
						error = "���벻��ȷ��";
					}else{
						//���㵱ǰ�ٷֱȣ���ʾʵʱ����
						var count = ((index+1)/total).toFixed(2)*100;
						//������ʵʱ����
						$("#progressbar").progressbar("value",count);	
						doTag(tagString,offerIds,flag,count,++index);
					}					
				}
			});
		}
	}

	//����ص���ʼ��
	function destroyProgress(){
		$("#progressbar").progressbar('destroy');	
	}
	
	//�رո���
	function closeDialog(){
		//��������ѡ��
		$('#tagedOfferIds').val('');
		$('#listbox input:checkbox').each(function(){
			if($(this).prop("checked")){
				$(this).removeAttr("checked");
			}
		});
		$('#selectAttr').find('.attribute-one').each(function(){
			$(this).remove();
		});
		$('.dialog-tag').dialog('close');
		tagIds.val('');
	}

	$(function(){
		for (var i=0, l=readyFun.length; i<l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});
})(jQuery, FE.elf);