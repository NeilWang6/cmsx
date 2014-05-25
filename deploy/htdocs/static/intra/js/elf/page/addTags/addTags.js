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
	            //键盘事件添加
	            function(){
	            	$(document).keydown(function(event){  //键盘响应函数
	            		event = event || window.event;  //兼容多浏览器
	            		if(event.keyCode==13){               //监听回车键
	            			$('#isearch-button').trigger('click');
	            			if($('#isearch-text').val()!=''){
	            				return false;
	            			}
	            		}
	            	});
	            }, 
	            
	            //点击选中复选框操作
	            function(){
	            	var select_attr = $('#selectAttr');
	            	$("#listbox").delegate("input:checkbox", "click",function(){
	            		var this_id = $(this).data('id'),
	            		this_content = $(this).data('content');
	            		//如果选择则添加已选择栏
	            		if($(this).prop("checked")){
	            			var s_html = "<span title='"+this_content+"' data-id='"+this_id+"'   class='attribute-one'><span  class='attribute'><strong>"+this_id+"</strong> "+this_content+"</span><a href='#' data-id="+this_id+"></a></span>";
	            			select_attr.append(s_html);
	            			tagIds.val(tagIds.val()+this_id+":");
	            			//如果未选择则删除已选择栏
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
	            
	            //已选标签删除操作
	            function(){
	            	$("#tag-handle").delegate("a", "click",function(event){
	            		event.preventDefault();
	            		var idTxt = $(this).data('id');
	            		$(this).closest('.attribute-one').remove();
	            		//遍历列表里复选框值
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
	            
	            //点击搜索操作背景色改变
	            function(){
	            	$('#isearch-button').click(function(){
	            		var txt_val = $('#isearch-text').val().trim(),
	            		s_html = $('#listbox').html(),
	            		indexs = 0;
	            		if(txt_val.length==0){
	            			$('#isearch-result span').css('display','none');
	            			return;
	            		}
	            		//清空之前背景色
	            		var n_html =  s_html.replace(/(\<span class="back-yellow"\>)([^\<]*)(\<\/span\>)/g, '$2');
	            		//加上匹配上的背景色
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
	            		//遍历打上之前已经打上的标签
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
	            		//显示当前查询结果
	            		$('#isearch-result label').text(txt_val);
	            		$('#isearch-result em').text(indexs);
	            		$('#isearch-result span').css('display','block');
	            	});
	            },

	            function(){
	            	var closes = $('header .close'),
	            	tagTitle = $('#tagTitle');
	            	//打标操作
	            	$("#add").bind("click",function(e){
	            		closes.css('display','none');
	            		tagTitle.text('正在打标');
	            		tagStart('add');
	            	});

	            	//去标操作
	            	$("#remove").bind("click",function(e){
	            		closes.css('display','none');
	            		tagTitle.text('正在去标');
	            		tagStart('remove');
	            	});

	            	//点击关闭
	            	$("header .close").bind('click',function(e){
	            		closeDialog();
	            	});
	            }
	      ];
	
	//开始打标准备
	function tagStart(flag){
		var tagString = "",
		offerIds,
		message = $('#message'),
		error = "";
		//取得所有输入offer或者member值
		offerIds = $('#tagedOfferIds').attr('value').split('\n');
		if(offerIds.length<=1 && offerIds[0] === ''){
			message.text("请输入要操作的offerId或者memberId！");
			message.css('display','block');
			$('#tagedOfferIds').focus();
			return;
		}
		//遍历拼凑tag值
		$('#selectAttr .attribute-one').each(function(){
			tagString += $(this).data('id') + ";";
		});
		if(tagString.split(";").length<=1){
			message.text("请选择要操作的标签！");
			message.css('display','block');
			$('#isearch-text').focus();
			return;
		}

		//打开浮层
		openDialog(tagString,offerIds,flag);
	}

	//根据数据返回结果显示进度条
	function computeTotal(offerIds){
		if(offerIds[offerIds.length-1]===''){
			total = Math.ceil((offerIds.length-1)/pageCount);
		}else{
			total = Math.ceil(offerIds.length/pageCount);
		}
	}

	//打开浮层
	function openDialog(tagString,offerIds,flag){
		$.use('ui-dialog', function(){
			$('.dialog-basic').dialog({
				fixed:true,
				center: true,
				open:function(){
					computeTotal(offerIds);
					//打开进度条
					openProgress(flag);
					doTag(tagString,offerIds,flag,0,0);
				}
			});
		});
	}
	
	//打开浮层进度条
	function openProgress(flag){
		$("#progressbar").progressbar({
			value: 0,
			complete: function(event, ui){
				$("#progressbar").progressbar("disable");
				$('header .close').css('display','block');
				if($.trim(error) != ''){
					$('#tagTitle').text('操作失败，请关闭重试！');
					return;
				}
				if(flag === 'add' ){
					$('#tagTitle').text('打标成功！');
				}; 
				if(flag === 'remove'){
					$('#tagTitle').text('去标成功！');
				}; 
			}
		});	
	}

	//开始打标或者去标
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
						error = "操作失败！";
					}else if((data.resultCode==2)||(data.resultCode==3)){
						error = "输入不正确！";
					}else{
						//计算当前百分比，显示实时进度
						var count = ((index+1)/total).toFixed(2)*100;
						//进度条实时进度
						$("#progressbar").progressbar("value",count);	
						doTag(tagString,offerIds,flag,count,++index);
					}					
				}
			});
		}
	}

	//浮层回到初始化
	function destroyProgress(){
		$("#progressbar").progressbar('destroy');	
	}
	
	//关闭浮层
	function closeDialog(){
		//清空输入框复选框
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