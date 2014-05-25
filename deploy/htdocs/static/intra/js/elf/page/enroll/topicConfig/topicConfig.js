/**
 * @author: lusheng.linls
 * @Date: 2012-11-30
 */

;(function($, T) {
	var enrollConfig;

    var readyFun = [
    	/** 初始化 */
    	function() {
    		jQuery('.qrcodeTable').qrcode({
    			render : "table",
    			width : 150, //宽度      
    			height : 150, //高度
    			text : $('#topicUrl').val()
    		});
    		jQuery('.dimen-close').click(function(){
    			jQuery('.qrcodeTable').hide();
    			jQuery('.dimen-open').show();
    			jQuery('.dimen-close').hide();
    		});
    		jQuery('.dimen-open').click(function(){
    			jQuery('.qrcodeTable').show();
    			jQuery('.dimen-open').hide();
    			jQuery('.dimen-close').show();
    		});
    	},
        function() {
        	var insId = $('#insId');
        	var isCopy = $('#isCopy');
        	var configUrl = T.domain + '/enroll/enroll_config.htm?type=topic';
        	if(insId.val()){
	        	configUrl = configUrl + '&id='+insId.val();
			}
        	if(isCopy.val() == 1){
		    	configUrl = configUrl + '&isCopy=1';
		    }
			loadSeries(configUrl);
        },
        /** 绑定 */
        function() {
        	//选择系列
	        var selectSeriesId=$('#selectSeriesId');
	        var beforeChange=selectSeriesId.val();

        	new FE.tools.Suggestion('#js-select-series', {
	            url : T.domain + '/enroll/v2012/topic_series.json',
	            data : {
	                'type' : '1'
	            },
	            paramName : 'seriesName',
	            valInput : '#selectSeriesId',
	            isDefaultItem : false,
	            complete:function(){
	            	if(selectSeriesId.val() && beforeChange !==selectSeriesId.val()){
	            		window.location.href=T.domain +'/enroll/v2012/topic_config.htm?selectSeriesId='+selectSeriesId.val();
	            	}
	            }
	        });
			
			//选择前置专场
			var jsSelectTopic2 = new FE.tools.Suggestion('#js-select-topic-2',{
				url : T.domain + '/enroll/v2012/topic_series.json',
	            data : {
	                'type' : '2'
	            },
	            paramName : 'topicName',
	            valInput : '#js-select-topic-id-2',
	            isDefaultItem : false
			});
			
			
	        //选择专场范围
	        $('#marketBuPinleiCatSelect1').change(function(){getMarketBuPinleiCatSelect('marketBuPinleiCatSelect1', 3)});
	        //产品属性
	        $('#categorySelect1').change(function(){getSubCategories("categorySelect1", 2)});
	        $('#categorySelect2').change(function(){getSubCategories("categorySelect2", 3)});
	        
	        //询价单
	        $('#inquiryCategorySelect1').change(function(){getSubCategories("inquiryCategorySelect1", 2)});
	        $('#inquiryCategorySelect2').change(function(){getSubCategories("inquiryCategorySelect2", 3)});
	        
	        //主营行业
	        $('#buCategorySelect1').change(function(){getBuSubCategories("buCategorySelect1", 2)});
	        //已上传资质证书
	        $('#certificateSelect1').change(function(){getCertificateSelect("certificateSelect1", 2)});
	        //行业类目
	        $('#postCategorySelect1').change(function(){getSubCategories("postCategorySelect1", 2)});
	        $('#postCategorySelect2').change(function(){getSubCategories("postCategorySelect2", 3)});

	        //显示提示信息
	        $('.backcolor1').live('mouseover mouseout',function(event){
	        	var el=$(this);
	        	if(event.type == 'mouseover'){
	        		el.find('.tips').addClass('tips-hover');
	        	}else{
	        		el.find('.tips').removeClass('tips-hover');
	        	}
	        });

	        //根据专场的展示设备的值，初始化专场条件的disbale
	        $('input[item]').live('initWirelessItemStyle',function(event,data){
	        	var selectVal = $(this).val();
	        	var el = $('.un-support-wireless').next('td');
	        	if (selectVal==0){
	        		el.find('input, textarea, select').prop('disabled',false);
	        		//el.find('.tips').removeClass('fd-hide');
	        	}else{
	        		el.find('input, textarea, select').prop('disabled',true);
	        		//隐藏hover时候控件的提示信息
	        		//el.find('.tips').addClass('fd-hide');
	        	}
	        });	
	        
	        $('input[item]').live('initNeedUser',function(event,data){
	        	var showDeviceEl = $('input[item=2701]');
	        	if(showDeviceEl.val() && showDeviceEl.val() != 0){
	        		var value = $(this).val();
					var isNeedUserTd=$(this).parent();
					if($('input[item=2701]').val() && $('input[item=2701]').val()!=0 && value =='n'){//用户报名选择“否”，需要提示不支持
						isNeedUserTd.find('.tips').addClass('fd-hide');
						isNeedUserTd.find('.un-sup-msg').remove();
						isNeedUserTd.append('<p class="un-sup-msg" style="color:red;">该条件暂不支持在无线端展示报名</p>');
					}
	        	}
	        });
	        
	        //根据专场的展示设备的值，初始化上传文件的disable
	        $('input[item]').live('initCertUpload',function(event,data){
	        	var showDeviceEl = $('input[item=2701]');
	        	if(showDeviceEl.val() && showDeviceEl.val()!=0){
	        		$(this).next().find('input[type=checkbox]').prop('disabled',true);
	        	}
	        });	
	        //展示设备的变更，对各控件的控制-added by wb-zhangchunyi 
	        $('input[item]').live('changeStyleForWireless',function(event,data){
	        	var selectVal = $(this).val(),
	        	 	el = $('.un-support-wireless').next('td'),
	        	 	isNeedOfferEl=$('input[item=533]'),
	        	 	isNeedUserEl=$('input[item=531]'),
	        	 	isNeedOfferTd=isNeedOfferEl.parent().parent(),
	        	 	isNeedUserTd=isNeedUserEl.parent(),
	        	 	noNeedCertUploadEl=$('input[item=2800]'),
	        	 	noNeedCertUploadInput=noNeedCertUploadEl.next().find('input[type=checkbox]');
	        	if (selectVal==0){
	        		el.find('input, textarea, select').prop('disabled',false);
	        		el.find('.tips').removeClass('fd-hide');
	        		//删除已有的提示信息，不删除是为了明显看出设置了哪些不支持的条件，根据红色文案
	        		//el.find('.un-sup-msg').remove();
	        		
	        		//上传文件2800-"不需要上传文件"去掉disable
	        		//noNeedCertUploadInput.prop('checked',false);
	        		noNeedCertUploadInput.prop('disabled',false);
	        		//noNeedCertUploadEl.val('');
	        		
	        		//“是否offer报名”条件的控制
	        		isNeedOfferTd.find('.tips').removeClass('fd-hide');
	        		//不删除是为了明显看出设置了哪些不支持的条件，根据红色文案
	        		isNeedOfferTd.find('.un-sup-msg').remove();
	        		isNeedUserTd.find('.tips').removeClass('fd-hide');
	        		isNeedUserTd.find('.un-sup-msg').remove();
	        	}else{
	        		el.find('input, textarea, select').prop('disabled',true);
	        		//隐藏hover时候控件的提示信息
	        		el.find('.tips').addClass('fd-hide');
	        		
	        		//上传文件2800-"不需要上传文件"勾选上并且disable掉
	        		noNeedCertUploadInput.prop('checked',true);
	        		noNeedCertUploadInput.prop('disabled',true);
	        		noNeedCertUploadEl.val('n,');
	        		
	        		//不支持无线的条件填了值的项后面加提示。先删除后面已有的提示信息，再添加，不然每触发一次，都会增加
	        		$('.un-support-wireless').each(function(){
	    				var td = $(this).next('td'),
	    					input = td.find('[item]'),
	    					val = input.val();
	    				
	    				//若有值，且提示信息不存在，添加提示-为了今后新增一个选项“手机”后，在“全部”切换到“手机”后不再重复添加提示。注意有offer备注和起批数量的特殊处理
	    				if (val && !td.find('.un-sup-msg')[0] && ((input.attr('item')!=657 && input.attr('item')!=703) || (input.attr('item')==657 && val.indexOf('Y')==0) || (input.attr('item')==703 && val!='-1:-1'))){
	    					td.append('<p class="un-sup-msg" style="color:red;">该条件暂不支持在无线端展示报名</p>');
	    				}else if(!val && td.find('.un-sup-msg')[0]){//当切换回PC删除不支持条件，再切换回手机后，移除提示信息
	    					td.find('.un-sup-msg').remove();
	    				}else if(val && td.find('.un-sup-msg')[0] && ((input.attr('item')==657 && val.indexOf('Y')!=0) || (input.attr('item')==703 && val=='-1:-1'))){//offer备注与起批数量的特殊处理
	    					td.find('.un-sup-msg').remove();
	    				}
	    			});
	        		
	        		//“是否offer报名”条件的控制，当选择“是”或者“询价单”时候，需要提示不支持
	        		if(isNeedOfferEl.val() && isNeedOfferEl.val()!='n' && !isNeedOfferTd.find('.un-sup-msg')[0]){
	        			isNeedOfferTd.find('.tips').addClass('fd-hide');
	        			isNeedOfferTd.append('<p class="un-sup-msg" style="color:red;">该条件暂不支持在无线端展示报名</p>');
	        		}
	        		
	        		//是否用户报名
	        		if(isNeedUserEl.val() && isNeedUserEl.val() == 'n' && !isNeedUserTd.find('.un-sup-msg')[0]){
	        			isNeedUserTd.find('.tips').addClass('fd-hide');
	        			isNeedUserTd.append('<p class="un-sup-msg" style="color:red;">该条件暂不支持在无线端展示报名</p>');
	        		}
	        	}
	        });
	        
	        // 显示设置价格
	        $('input[item=700]').live('changePriceValue',function(event){
	        	var el=$(this);
	        	var price=el.closest('td').find('.js-set-price');
	        	if(el.val()){
	        		price.slideDown('fast');
	        	}else{
	        		price.slideUp('fast');
	        	}
	        });

	        /**
	        	data={
	        			"init" : true,	//是否初始化中，if true 不会显示保留过渡效果
	        			"type" : "hide"	//操作类型
	        			"itemId" : "111"	//关联的itemId,多个值用,分隔
	        			"curValue" : "111"	//当前itemId对应的值是n或空，则XX，否则YY
	        			"after":null //完成后的动作
	        		}
	        */
	        
	        //根据offer报名的三种状态，进行控件的显示和隐藏
	        $('input[item]').live('changeOfferValue',function(event,data){
	        	var el=$(this);
	        	var jsonData=data;
	        	if(!jsonData.curValue || jsonData.curValue === 'n'){
	        		//允许用户申请退出
	        		if(jsonData.userItemId){
	        			var itemIds=jsonData.userItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.show();
	        					}else{
	        						target.fadeIn();
	        					}
	        				}
	        			}
	        		}
	        		//offer对应的栏目隐藏
	        		if(jsonData.offerItemId){
	        			var itemIds=jsonData.offerItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.hide();
	        					}else{
	        						target.fadeOut();
	        					}
	        				}
	        			}
	        		}
	        		//询价单对应的栏目隐藏
	        		if(jsonData.inquiryItemId){
	        			var itemIds=jsonData.inquiryItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.hide();
	        					}else{
	        						target.fadeOut();
	        					}
	        				}
	        			}
	        		}
	        	}else if ( jsonData.curValue === 'y'){
	        		//不允许用户申请退出
	        		if(jsonData.userItemId){
	        			var itemIds=jsonData.userItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.hide();
	        					}else{
	        						target.fadeOut();
	        					}
	        				}
	        			}
	        		}
	        		//offer对应的栏目显示
	        		if(jsonData.offerItemId){
	        			var itemIds=jsonData.offerItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						if (itemIds[k] != 721 && itemIds[k] != 717 && itemIds[k] != 725 && itemIds[k] != 726 && itemIds[k] != 556  && itemIds[k] != 10101 && itemIds[k] != 10094){
		        						target.show();
	        						}
	        					}else{
	        						target.fadeIn();
	        					}
	        				}
	        			}
	        			var itemIdEl = $('input[item=713]');
	        			itemIdEl.trigger('changeValue',{
	    					"type":"hide",
	    					"itemId":"717,721,725,726,10101,556,10094",
	    					"curValue":itemIdEl.val()
	    				});
	        		}
	        		//询价单对应的栏目隐藏
	        		if(jsonData.inquiryItemId){
	        			var itemIds=jsonData.inquiryItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.hide();
	        					}else{
	        						target.fadeOut();
	        					}
	        				}
	        			}
	        		}
	        	}else if ( jsonData.curValue === 'xunjia'){
	        		//不允许用户申请退出
	        		if(jsonData.userItemId){
	        			var itemIds=jsonData.userItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.hide();
	        					}else{
	        						target.fadeOut();
	        					}
	        				}
	        			}
	        		}
	        		//offer对应的栏目隐藏
	        		if(jsonData.offerItemId){
	        			var itemIds=jsonData.offerItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
		        				if(jsonData.init===true){
	        						target.hide();
	        					}else{
	        						target.fadeOut();
	        					}
	        				}
	        			}
	        		}
	        		//询价单对应的栏目显示
	        		if(jsonData.inquiryItemId){
	        			var itemIds=jsonData.inquiryItemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr');
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.show();
	        					}else{
	        						target.fadeIn();
	        					}
	        				}
	        			}
	        		}
	        	}
	        });
	        
	        // 表单值变化后的动作
	        $('input[item]').live('changeValue',function(event,data){
	        	var el=$(this);
	        	var jsonData=data;
	        	if(!jsonData.curValue || jsonData.curValue === 'n'){
	        		if(jsonData.itemId){
	        			var itemIds=jsonData.itemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr')
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.hide();
	        					}else{
	        						target.fadeOut();
	        						//target.hide();
	        					}
	        				}
	        			}
	        		}
	        	}else{
					if(jsonData.itemId){
	        			var itemIds=jsonData.itemId.split(',');
	        			for(var k=0;k<itemIds.length;k++){
	        				var target = $('input[item='+itemIds[k]+']').closest('tr')
	        				if(jsonData.type==='hide'){
	        					if(jsonData.init===true){
	        						target.show();
	        					}else{
	        						target.fadeIn();
	        						//target.show();
	        					}
	        				}
	        			}
	        		}
	        	}
	        	if(jsonData.after){
	        		jsonData.after.call();
	        	}
	        });

        },
    function() {}];

	function initItemState(item) {
		/** 显示被隐藏的控件 */

		//601：会员范围 629：红名单自定义文案
		var item_601 = $(item+'-601');
		item_601.trigger('changeValue',{
			"init":true,
			"type":"hide",
			"itemId":"629",
			"curValue":((item_601.val()&&-1!=item_601.val().indexOf('redListRequired'))?'y':'n')
		});

		//704：是否寄样要求 705：寄样要求
		var item_704 = $(item+'-704');
		item_704.trigger('changeValue',{
			"init":true,
			"type":"hide",
			"itemId":"705",
			"curValue":(item_704.val()?'y':'n')
		});
		//10088：限定用户 10089：限定用户
		var item_10088 = $(item+'-10088');
		item_10088.trigger('changeValue',{
			"init":true,
			"type":"hide",
			"itemId":"10089",
			"curValue":(item_10088.val()?'y':'')
		});

		//531: 是否用户报名 2800:资质文件  509:资质文件要求
		var item_531 = $(item+'-531');
		item_531.trigger('changeValue',{
			"init":true,
			"type":"hide",
			"itemId":"2800,509",
			"curValue":item_531.val()
		});

		//713: 是否允许卖家修改offer报名信息 717:offer报名信息
		var item_713 = $(item+'-713');
		item_713.trigger('changeValue',{
			"init":true,
			"type":"hide",
			"itemId":"717,721,725,726,10101,556,10094",
			"curValue":item_713.val()
		});
		
		//533:是否offer报名 542:是否允许用户申请退出
		var item_533 = $(item+'-533');
		item_533.trigger('changeOfferValue',{
			"init":true,
			"type":"hide",
			"userItemId":"542",
			"offerItemId":"619,620,621,700,701,718,702,703,710,711,713,628,720,652,657,717,721,725,726,910,10101,10100,556,10102,10091,10092,10094,10084",
			"inquiryItemId":"800",
			"curValue":item_533.val()
		});

		
		//2701: 专场报名显示设备
		var item_2701 = $(item+'-2701');
		item_2701.trigger('initWirelessItemStyle');
		if(item_2701.val() && item_2701.val() == 2){
			$('.two-dimension-code').show();
		}

		//2800: 上传文件checkbox disable
		var item_2800 = $(item+'-2800');
		item_2800.trigger('initCertUpload');
		
		//531: 是否用户报名
		var item_531 = $(item+'-531');
		item_531.trigger('initNeedUser');
	}
/**创建表单*/
function createForm(page) {
    //遍历每个页面
	jQuery(enrollConfig).find(page).each(function(){
	     var pageId = jQuery(this).attr('id');
	  	 var divId = jQuery('#topic-config-detail');
		 var isConfigBlank = true;
	 	//遍历块
	 	jQuery(this).find('fieldset').each(function(){
    	    var fieldsetLabel = jQuery(this).attr('label');
    		var fieldsetLayout = jQuery(this).attr('layout');
    		var table = jQuery('<table width="100%" border="0"  cellspacing="1"></table>');
    		table.appendTo(divId);
			var tr =jQuery('<tr></tr>');
			jQuery('<td class="f10" colspan="2"><h5>'+fieldsetLabel +'</h5></td>').appendTo(tr);
			tr.appendTo(table);
    		//遍历控件
    		jQuery(this).find('control').each(function(){
				isConfigBlank = false;
    			T.createControl(pageId,jQuery(this),table);
			});
		});
	 	
	 	var defaultTopicValue = $('#item-topic-1-510').val();
		
	 	//创建提交按钮
		
	 	var fixedBottom = jQuery('<div class="js-fixed-bottom fixed-bottom fix-bottom-total"></div>');
		fixedBottom.appendTo(divId);

		//var opRow=jQuery('<tr></tr>');
		//opRow.appendTo(opTable);
		//jQuery('<td class="backcolor" align="right"> </td>').appendTo(opRow);
		//var opTd=jQuery('<td class="backcolor1"></td>');
		//opTd.appendTo(opRow);

		
		var decorate = jQuery('<div class="decorate"></div>');
		decorate.appendTo(fixedBottom);
		var left = jQuery('<i class="arrow-left"></i>');
		left.appendTo(decorate);
		var right = jQuery('<i class="arrow-right"></i>');
		right.appendTo(decorate);
		

		var fixedBody = jQuery('<div class="fixed-body fixed-body-total"></div>');
		fixedBody.appendTo(fixedBottom);
		
		if(isConfigBlank) {
			jQuery('<span>未配置相关信息</span>').appendTo(fixedBottom);
		} else {
			//jQuery('<input style="width:100px;height:50px;font-weight:bold;" type="button" id="bt-save-' + pageId +'" value="保&nbsp;存">').appendTo(opTd);
			var barDiv = jQuery('<div class="barDiv"></div>');
			barDiv.appendTo(fixedBody);
			jQuery('<button type="button" class="btn-basic btn-blue " id="bt-save-' + pageId +'"> 保 存 </button>').appendTo(barDiv);
			jQuery('<span style="float:right;margin-right:20px">输入会员loginId：<input type="text" id="check_memberId"/><button type="button" id="check_member" class="btn-basic btn-blue "> 校 验 </button></span>').appendTo(barDiv);
			jQuery('#check_member').live("click",
			function() {
				if(window.confirm("请先保存后再进行校验，确认保存过了？")) {
        			if($('#check_memberId').val()) {
        				window.open("/tools/trouble_shoot_enroll_info.htm?topicId=" + $('#insId').val() + "&memberId=" + $('#check_memberId').val())
        			} else {
    					alert("请填写memberId！");
    				}
				}
			});
			jQuery('#bt-save-' + pageId).live("click",
			function() {
				var thisEl = $(this);
				thisEl.attr('disabled',true);
				thisEl.text(' 保 存 中 ...');
				//var beg=new Date()
				if(phoneValid() && validForm(pageId, defaultTopicValue)) {
					//console.log(new Date()-beg);
					submitForm(pageId);
				}else{
					thisEl.removeAttr('disabled');
					thisEl.text(' 保 存 ');
				}
			});
			
		}
	});
	
	/**时间控件，展示时间*/
	jQuery(function($){
		var fromDateItem = $('.from-date-item');
		var toDateItem = $('.to-date-item');
		var singleDateItem = $('.single-date-item');
		fromDateItem.each(function(i){
			jQuery.use('ui-datepicker-time,util-date', function(){ //日期选择控件
				var now = new Date();
				val = fromDateItem.eq(i).val();
				
				if(val){
					now = Date.parseDate(val);
				}
				fromDateItem.eq(i).datepicker({
					triggerType: 'focus',
					showTime: true,
					date:now,
					closable:true, //选择事件触发后是否自动关闭日历
					select: function(e, ui){
						var el = $(this);
						var date=ui.date.format('yyyy-MM-dd hh:mm:ss');
						el.val(date);
						dateRangeChange(el,fromDateItem.eq(i),toDateItem.eq(i));
					},
					timeSelect: function(e, ui){
						var el = $(this);
						var date=ui.date.format('yyyy-MM-dd hh:mm:ss');
						el.val(date);
						dateRangeChange(el,fromDateItem.eq(i),toDateItem.eq(i));
					}
				});
			});
		});

		fromDateItem.each(function(i){
			jQuery.use('ui-datepicker-time,util-date', function(){ //日期选择控件
				var now = new Date();
				val = toDateItem.eq(i).val();
				if(val){
					now = Date.parseDate(val);
				}
				toDateItem.eq(i).datepicker({
					triggerType: 'focus',
					showTime: true,
					date:now,
					closable:true, //选择事件触发后是否自动关闭日历
					select: function(e, ui){
						var el = $(this);
						var date=ui.date.format('yyyy-MM-dd hh:mm:ss');
						el.val(date);
						dateRangeChange(el,fromDateItem.eq(i),toDateItem.eq(i));
					},
					timeSelect: function(e, ui){
						var el = $(this);
						var date=ui.date.format('yyyy-MM-dd hh:mm:ss');
						el.val(date);
						dateRangeChange(el,fromDateItem.eq(i),toDateItem.eq(i));
					}
				});
			});
		});
		
		
		jQuery.use('ui-datepicker-time,util-date', function(){ //日期选择控件
			var now = new Date();
			val = singleDateItem.val();
			if(val){
                now = Date.parseDate(val);
            }
			singleDateItem.datepicker({
				triggerType: 'focus',
				showTime: true,
				date:now,
				closable:true, //选择事件触发后是否自动关闭日历
				select: function(e, ui){
					var el = $(this);
					var date=ui.date.format('yyyy-MM-dd hh:mm:ss');
					el.val(date);
					dateRangeChangeSingle(el,singleDateItem);
				},
				timeSelect: function(e, ui){
					var el = $(this);
					var date=ui.date.format('yyyy-MM-dd hh:mm:ss');
					el.val(date);
					dateRangeChangeSingle(el,singleDateItem);
				}
			});
		}); 		
	});
}
	function dateRangeChange(el,fromDateItem,toDateItem){
		var start = fromDateItem.val();
		var end = toDateItem.val();
		var itemId = fromDateItem.attr('item');
		var hiddenDate=jQuery('#item-' + itemId);
		if('' == start || '' == end) {
			hiddenDate.val('');
		}else{
			hiddenDate.val(start + '|' + end);
		}
		var time = hiddenDate.val();
		var startTime = '';
		var endTime = '';
		if(time != '')  {
			var rangValue = time.split("|");
			if(rangValue.length >= 2) {
				if(rangValue[0] != '') {
					startTime = new Date(Date.parse(rangValue[0].replace(/\-/g, "\/")));
				}
				if(rangValue[1] != '') {
					endTime = new Date(Date.parse(rangValue[1].replace(/\-/g, "\/")));
				}
			}
			if(startTime>endTime){
				alert('结束日期必须大于开始日期!!!');
				el.val('');
			}
		}
	}
	
	function dateRangeChangeSingle(el,singleDateItem){
		var single = singleDateItem.val();
		var itemId = singleDateItem.attr('item');
		var hiddenDate=jQuery('#item-' + itemId);
		hiddenDate.val(single);
		var time = hiddenDate.val();
		var singleTime = '';
		if(time != '')  {
			startTime = new Date(Date.parse(time.replace(/\-/g, "\/")));
		}
	}
	
	/**表单无线支持条件的校验,如果当前选择的显示设备不是‘PC’，那么检查每个不支持无线条件的item，检查到第一个不支持无线的item有输入值，就返回-added by wb-zhangchunyi*/
	function phoneValid(){
		var isPass = true,
			showDevice = $('#topic-config-detail input[item=2701]');
		if(showDevice.val() && showDevice.val()!=0){
			//“是否offer报名”条件的控制,当选择“是”或者“询价单”时候，需要提示不支持
    		if($('input[item=533]').val()!='n'){
    			isPass = false;
    		}else{
				$('.un-support-wireless').each(function(){
					var td = $(this).next('td'),
						el = td.find('[item]'),
						val = el.val();
					
					if (val){
						//657-offer备注的值是Y开头才表示真正有值；703-起批数量的值不是-1:-1才表示真正有值；
						if((el.attr('item')!=657 && el.attr('item')!=703) || (el.attr('item')==657 && val.indexOf('Y')==0) || (el.attr('item')==703 && val!='-1:-1')){
							isPass = false;
//							alert($(this).text());
							return;
						}
					}
				});
    		}
			if (isPass===false){
				alert('无法保存！您设置的条件中包含不支持无线的条件(红色文案提示的项)，请把[专场报名展示设备]选项改为"PC和手机"，再保存，或清除不支持无线的条件后再保存。\n注意：若设置了offer条件或者询价单条件，请先把"是否offer报名"选到对应的项，清除offer条件或者询价单条件后，再修改为“否”。\n如果找不到红色文案提示，可能是关联条件影响它隐藏咯\n');
			}
		}
		return isPass;
	}
	
/**校验表单*/
function validForm(pageId, oldName) {
	var isSucced =  true;
	var errorMsg = '';
	jQuery('#topic-config-detail input[item]').each(function(){
		var controlId = jQuery(this).attr('item');
		var value = jQuery(this).val();
		if(controlId==501){
			tinyMCE.triggerSave();
			value = jQuery('#mce_editor_0').val();
		}
		
		//自定义offer备注不能有:分隔符
		if(controlId==657){
			var notes = value.split(':');
			if (notes.length > 3){
				errorMsg += '[offer备注提示消息]不能含有“:” \n';
				isSucced = false;
			}
		}
		
		if (controlId==531){
			var showDevice = $('#topic-config-detail input[item=2701]');
			if(showDevice.val() && showDevice.val() != 0){
	    		if(value == 'n'){
	    			errorMsg += '[是否用户报名]必须选择“是” \n';
	    			isSucced = false;
	    		}
			}
		}
		
		//offer折扣要求
		if(controlId==721){
			if (jQuery('#check-offer-discount').attr('checked') == 'checked'){
				var discount = value.split(':')[1];
				var reg=/^\d+[\.]?\d{0,2}$/g;
				if (!reg.test(discount)) {
					errorMsg += '[折扣要求]请输入0-10之间的值，保留两位小数！\n';
					isSucced = false;
				}else{
					if (discount >= 10){
						errorMsg += '[折扣要求]折扣超过10折！\n';
						isSucced = false;
					}
				}
			}
		}
		
		//是否允许offer重复报名
		if(controlId==628){
			if (jQuery('#check-offer-muti-allow').attr('checked') == 'checked'){
				var dateNum = value.split(':')[1];
				if (isNotNumber(dateNum)){
					errorMsg += '[是否允许offer重复报名]允许的天数，请填写整数！\n';
					isSucced = false;
				}
			}
		}
		
		//是否需要合同校验
		if(controlId==658){
			//需要合同时校验
			if (jQuery('#check-sign-contract-need').attr('checked')){
				var reg = /.*[“”‘’'"]+.*/;
				var regEmpty = /^\s*$/;
				var url = jQuery('#contract-template-url').val();
				if (regEmpty.test(url)){
					errorMsg += '[合同模板url]不能为空！\n';
					isSucced = false;
				}
				if (url.length > 500){
					errorMsg += '[合同模板url]的长度大于500！\n';
					isSucced = false;
				}
				if (reg.test(url)){
					errorMsg += '[合同模板url]中含有非法字符【“ ” ‘ ’ \'  \"】！\n';
					isSucced = false;
				}
				url = jQuery('#extra-content-url').val();
				if (regEmpty.test(url)){
					errorMsg += '[附加内容url]不能为空！\n';
					isSucced = false;
				}
				if (url.length > 500){
					errorMsg += '[附加内容url]的长度大于500！\n';
					isSucced = false;
				}
				if (reg.test(url)){
					errorMsg += '[附加内容url]中含有非法字符【“ ” ‘ ’ \'  \"】！\n';
					isSucced = false;
				}
			}
		}

		var isNeed = getControlAttrValue(pageId,controlId,'isNeed');
		var ctrlName = getControlAttrValue(pageId,controlId,'name');
		var format = getControlAttrValue(pageId,controlId,'format');
		var maxLen = getControlAttrValue(pageId,controlId,'maxLen');
		
		//校验
		if('' == value && 'Y' == isNeed ) {
			errorMsg += '请填写[' + ctrlName  + ']\n';
			isSucced = false;
		} 
		//检查正则表达式
		if(format && format != "" && '' != value) {
			var regStr = format.split("|||");
			if(regStr.length >= 2 ) {
    			var reg =eval(regStr[0]);
    			if (!reg.test(value)) {
					errorMsg += '[' +ctrlName + ']' + regStr[1] + '\n';
    				isSucced = false;
    			}
			}
		}
		
		//检查长度
		if(maxLen && maxLen != "") {
			var len = Number(maxLen);
			if(value.length > len) {
				errorMsg += '[' + ctrlName  + ']长度不能超过' + len +  '\n';
				isSucced = false;
			}
		}
		
		//特殊控件特殊处理
		if(controlId==609){
		    if(value.search('market')===-1){
		        errorMsg += '[' + ctrlName  + ']专业市场是必填项哦，请补充下。\n';
		        isSucced = false;
		    }
		    if(value){
		        if(value.charAt(0)!==';'){
		            value=';'+value;
		        }
		        if(value.charAt(value.length-1)!==';'){
                    value=value+';';
                }
		    }
		    
		}
		
		if(controlId == 903) {
		    if( jQuery('#itemRange-topic-8-2609') ) {
				var dayede = parseInt(value) * 10;
				
				var item1f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item1f').val() );
				var item2f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item2f').val() );
				var item3f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item3f').val() );
				
				if( item1f && (dayede < (item1f * 4)) ) {
					errorMsg += '[' + ctrlName  + ']返利模板的数字*4 <= 行业扣点比例。\n';
					isSucced = false;
				} else if( item2f && (dayede < (item2f * 4)) ) {
					errorMsg += '[' + ctrlName  + ']返利模板的数字*4 <= 行业扣点比例。\n';
					isSucced = false;
				} else if( item3f && (dayede < (item3f * 4)) ) {
					errorMsg += '[' + ctrlName  + ']返利模板的数字*4 <= 行业扣点比例。\n';
					isSucced = false;
				}
			}
		} else if(controlId == 2609) {
			if( jQuery('#itemRange-topic-8-2609') ) {
				var item1b1 = jQuery('#itemRange-topic-8-2609').find('#item1b').val();
				var item1e1 = jQuery('#itemRange-topic-8-2609').find('#item1e').val();
				var item1f1 = jQuery('#itemRange-topic-8-2609').find('#item1f').val();
				
				var item2b1 = jQuery('#itemRange-topic-8-2609').find('#item2b').val();
				var item2e1 = jQuery('#itemRange-topic-8-2609').find('#item2e').val();
				var item2f1 = jQuery('#itemRange-topic-8-2609').find('#item2f').val();
				
				var item3b1 = jQuery('#itemRange-topic-8-2609').find('#item3b').val();
				var item3e1 = jQuery('#itemRange-topic-8-2609').find('#item3e').val();
				var item3f1 = jQuery('#itemRange-topic-8-2609').find('#item3f').val();
				
				var isInt = /^\d{1,5}$/;
				if ( item1b1 && !isInt.test(item1b1) ){
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item1e1 && !isInt.test(item1e1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item1f1 && !isInt.test(item1f1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item2b1 && !isInt.test(item2b1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item2e1 && !isInt.test(item2e1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item2f1 && !isInt.test(item2f1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item3b1 && !isInt.test(item3b1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item3e1 && !isInt.test(item3e1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				} else if( item3f1 && !isInt.test(item3f1) ) {
					errorMsg += '[' + ctrlName  + ']必须是正整数。\n';
					isSucced = false;
				}
				
				var item1b = parseInt( jQuery('#itemRange-topic-8-2609').find('#item1b').val() );
				var item1e = parseInt( jQuery('#itemRange-topic-8-2609').find('#item1e').val() );
				var item1f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item1f').val() );
				
				var item2b = parseInt( jQuery('#itemRange-topic-8-2609').find('#item2b').val() );
				var item2e = parseInt( jQuery('#itemRange-topic-8-2609').find('#item2e').val() );
				var item2f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item2f').val() );
				
				var item3b = parseInt( jQuery('#itemRange-topic-8-2609').find('#item3b').val() );
				var item3e = parseInt( jQuery('#itemRange-topic-8-2609').find('#item3e').val() );
				var item3f = parseInt( jQuery('#itemRange-topic-8-2609').find('#item3f').val() );
			
				if( item1e && item2b && (item1e != item2b - 1) ) {
					errorMsg += '[' + ctrlName  + ']区间必须连续。\n';
					isSucced = false;
				} else if( item2e && item3b && (item2e != item3b - 1) ) {
					errorMsg += '[' + ctrlName  + ']区间必须连续。\n';
					isSucced = false;
				} else if( item2b && !item1e ) {
					errorMsg += '[' + ctrlName  + ']区间必须连续!\n';
					isSucced = false;
				} else if( item3b && !item2e ) {
					errorMsg += '[' + ctrlName  + ']区间必须连续!\n';
					isSucced = false;
				}
				
				if( item2b && !item2f ) {
					errorMsg += '[' + ctrlName  + ']填写不合法。\n';
					isSucced = false;
				} else if( item3b && !item3f ) {
					errorMsg += '[' + ctrlName  + ']填写不合法。\n';
					isSucced = false;
				}
				
				if( !item2b && item1e ) {
					errorMsg += '[' + ctrlName  + ']最后一级区间不应当设置上限!\n';
					isSucced = false;
				} else if( !item3b && item2e ) {
					errorMsg += '[' + ctrlName  + ']最后一级区间不应当设置上限!\n';
					isSucced = false;
				} else if( item3e ) {
					errorMsg += '[' + ctrlName  + ']最后一级区间不应当设置上限!\n';
					isSucced = false;
				}
				
				//行业报名的最小库存 > 返利模板最后一个区间的最小值
				var minQuantity = parseInt( jQuery('#item-topic-8-2608').val() );
				var lastLeft = 1;
				
				if( !item1e ) {
					lastLeft = item1b;
				} else if( !item2e ) {
					lastLeft = item2b;
				} else if( !item3e ) {
					lastLeft = item3b;
				}
				
				if( lastLeft >= minQuantity ) {
					errorMsg += '[行业报名最小库存]行业最小库存必须 > 返利模板最后一个区间的最小值!\n';
					isSucced = false;
				}
			}
		}else if(controlId == 510){
			var newName=$('#item-topic-1-510').val();
			if(newName!='' && (oldName=='' || oldName!=newName)){
				//isExistTopicName(newName,errorMsg,isSucced)
				$.ajax({
					url : T.domain + '/enroll/v2012/topic_series.json' + '?_input_charset=UTF-8',
					type: "POST",
					data : {'type' : '2', 'topicName': newName},
					async: false,
					success: function(data){
						if(data.isSuccess == true && jQuery.isPlainObject(data.data)) {//如何判断data.data没有数据，是一个空的Object{}
							//不只看普通专场,循环后台传回的大map-系列类型为Key
							for(var key=1; key<=10; key++){
							//for(var key in data.data){
								if(data.data[key]!=undefined){//当data.data没有数据，是一个空的Object{}
									var topicList=data.data[key].list;//data.data是一个map，1为key，表示普通专场类型, list存放的也是map(key-系列id，v-系列名称)
									if(topicList && topicList.length>0){
										for(var k=0;k<topicList.length;k++){
										//for(var k in topicList){ 
											var topicMap=topicList[k];
											if(newName==topicMap['name']){//list中的map都有两对K-V(id和name)
												errorMsg += '[' + ctrlName + ']不可同名\n';
												isSucced = false;
												return;
											}
										}
									}
								}
							}
							/*if(data.data[1]!=undefined){//当data.data没有数据，是一个空的Object{}
								var topicList=data.data[1].list;//data.data是一个map，1为key，表示普通专场类型, list存放的也是map(key-系列id，v-系列名称)
								if(topicList && topicList.length>0){
									for(var k=0;k<topicList.length;k++){
									//for(var i in topicList){ 
										var topicMap=topicList[k];
										if(newName==topicMap['name']){//list中的map都有两对K-V(id和name)
											errorMsg += '专场名称不可重复';
											isSucced = false;
											break;
										}
									}
								}
							}*/
						}
					}
				});	
			}
		}
    	//设置值
		if(isSucced) {
    		setControlValue(pageId,controlId,value);
		}
		
 	});
	
	if(!isSucced) {
		alert(errorMsg);
		return isSucced;
	}
	
	//设置选中的专场值
	var value = jQuery('#selectSeriesId').val();
	if('' == value) {
		alert('请先选择专场!');
		return false;
	}
	jQuery(enrollConfig).find('page[id=' + pageId +']:first').attr('seriesId',value);
	jQuery(enrollConfig).find('page[id=' + pageId +']:first').attr('selected','true');
	return true;
}

function getXml() {
	//处理浏览器兼容问题
	if(jQuery.browser.msie) {
		return enrollConfig.xml;
	} else {
		return (new XMLSerializer()).serializeToString(enrollConfig);
	}
}

function setControlValue(pageId,controlId,value) {
	jQuery(enrollConfig).find('page[id=' + pageId +']:first control[id='+controlId+']:first').attr('value',jQuery.trim(value));
}


function getControlValue(pageId,controlId) {
	return jQuery(enrollConfig).find('page[id=' + pageId +']:first * control[id='+ controlId +']:first').attr('value');
}


function getControlAttrValue(pageId,controlId,attr) {
	return jQuery(enrollConfig).find('page[id=' + pageId +']:first control[id='+ controlId +']:first').attr(attr);
}

function setControlAttrValue(pageId,controlId,attr,value) {
	jQuery(enrollConfig).find('page[id=' + pageId +']:first * control[id='+controlId+']:first').attr(attr,value);
}

function loadSeries(configUrl) {
        var jqXHR = jQuery.ajax(configUrl, {
        type: "GET",
        async: true,
        contentType: 'application/x-www-form-urlencoded',
        cache: false,
        data: {},
        dataType: 'xml',
        success: function(data, textStatus, jqXHR){
            enrollConfig = data;
            //var seriesTopic = 'topic-1';
            var selectSeriesId = jQuery('#selectSeriesId').val();
            var selectSeriesType = jQuery('#selectSeriesType').val();
			
            createForm('#topic-'+selectSeriesType);
            initTinyMCE();
            initItemState('#item-topic-'+selectSeriesType);
            jQuery('#topic-config-detail').removeClass("hiddenDiv").addClass("showDiv");
        }
    });
	
}
function submitForm(pageId) {
 	var xmlValue = getXml();
    var thisEl=$('#bt-save-' + pageId);
	if(confirm("确定要保存吗？保存后将出现在前台列表中！")){
		jQuery.ajax(T.domain + '/enroll/save_topic.htm?_input_charset=utf-8', {
            type: "POST",
            processData: true,
    		contentType: 'application/x-www-form-urlencoded',
            data:  {xmlkey:xmlValue},
            dataType: 'text',
            error : function(jqXHR, textStatus, errorThrown) {
            	alert('保存失败,请刷新重试！');
                thisEl.removeAttr('disabled');
				thisEl.text(' 保 存 ');
                return;
            },
        	success: function(data, textStatus, jqXHR){
        		if(data.split("-")[0] == 'ok') {
					window.location.href = T.domain +'/enroll/v2012/topic_config.htm?topicId=' + data.split("-")[1];
        		} else {
    				alert('保存失败');
    				thisEl.removeAttr('disabled');
					thisEl.text(' 保 存 ');
    			}
            }
    	});
	}else{
		thisEl.removeAttr('disabled');
		thisEl.text(' 保 存 ');
	}
}

function isNotNumber(value) {
	var reg =eval('/^(0|[1-9][0-9]*)$/');
	if (reg.test(value)) {
		return false;
	}
	return true;
}

function getMarketBuPinleiCatSelect(elementid, depth){

	var value = $('#' + elementid + ' option:selected').val();
	var url = T.domain + "/enroll/market_bu_pinlei_cat.json?_input_charset=utf-8&id="+value+"&depth="+depth + "&timed="+new Date().getTime();
	if(depth == 3){
		$("#marketBuPinleiCatSelect3").empty();
	}
	$.getJSON(url,function(data) {
		var sel = $('#marketBuPinleiCatSelect' + depth)[0];
		jQuery(data.data).each(function(index,content) {
			 var newopt = document.createElement('option');
			 newopt.text=content[1];
			 newopt.value=content[0];
			 newopt.id=content[0];
			 sel.options[sel.options.length] = newopt; 
		});
	});
}
function getSubCategories(elementid, depth){
	var element = elementid.substring(0,elementid.length-1);
	var value = jQuery('#' + elementid + ' option:selected').val();
	var url = T.domain + "/topic/s_t_get_category.htm?_input_charset=utf-8&id="+value+"&depth="+depth + "&timed="+new Date();
	if(depth == 2){
		jQuery('#'+element+'2').empty();
		jQuery('#'+element+'3').empty();
	}
	if(depth == 3){
		jQuery('#'+element+'3').empty();
	}
	jQuery.getJSON(url,function(data) {
		if(data.success == 'true') {
			var sel = jQuery('#' + element + depth)[0];
			jQuery(data.data).each(function(index,content) {
				//IE不兼容
				//jQuery('<option></option>').val(content[0]).html(content[1]).appendTo(sel);
				 var newopt = document.createElement('option');
				 newopt.text=content[1];
				 newopt.value=content[0];
				 newopt.id=content[0];
				 sel.options[sel.options.length] = newopt; 
			});
		}
	});
}
function getCertificateSelect(elementid, depth){
	var element = elementid.substring(0,elementid.length-1);
	var value = $('#' + elementid + ' option:selected').val();
	var url = T.domain + "/enroll/v2012/get_certificate_type.json?_input_charset=utf-8&id="+value+"&depth="+depth + "&timed="+new Date().getTime();
	if(depth == 2){
		$('#' + element + depth).empty();
	}
	$.getJSON(url,function(data) {
		var sel = jQuery('#' + element + depth)[0];
		jQuery(data.data).each(function(index,content) {
			 var newopt = document.createElement('option');
			 newopt.text=content[1];
			 newopt.value=content[0];
			 newopt.id=content[0];
			 sel.options[sel.options.length] = newopt; 
		});
	});

}
function getBuSubCategories(elementid, depth){

	var value = jQuery('#' + elementid + ' option:selected').val();
	var url = T.domain + "/topic/s_t_get_category.htm?_input_charset=utf-8&id="+value+"&depth="+depth + "&timed="+new Date();
	if(depth == 2){
		jQuery("#buCategorySelect2").empty();
	}
	jQuery.getJSON(url,function(data) {
		if(data.success == 'true') {
			var sel = jQuery('#buCategorySelect2')[0];
			jQuery(data.data).each(function(index,content) {
				//IE不兼容
				//jQuery('<option></option>').val(content[0]).html(content[1]).appendTo(sel);
				 var newopt = document.createElement('option');
				 newopt.text=content[1];
				 newopt.value=content[0];
				 newopt.id='bu'+content[0];
				 sel.options[sel.options.length] = newopt; 
			});
		}
	});
}


function loadingBox() {
//jQuery.use('ui-dialog', function(){
	jQuery('#alert-savelog').dialog( {
		modalCss: {
			backgroundColor: '#FFF'
		},
		draggable: {
			handle: 'div.header'
		},
		shim : true,
		center : true,
		fixed:	true
	});
				
//});	 
}
			
 function loadingBoxClose() {
	 jQuery('#alert-savelog').closest('#alert-savelog').dialog('close');
	 	 
}

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
            	//console.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery, FE.tools);

