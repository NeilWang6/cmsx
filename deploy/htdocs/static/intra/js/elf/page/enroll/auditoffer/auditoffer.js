/**
 * @author jiankai.xujk
 * @usefor 报名工具审核offer页面
 * @date   2012.09.11
 */
;(function($, T) {
    var readyFun = [
                    
    	//分页
    	function(){
    		var data = {
                curPage: $('input#curpage').val(),
                page: $('input#page_num').val(),//几页
                titlelist: $('input#titlelist').val(),//多少条
                leftContent: '<div class="js-fixed-bottom fixed-bottom fix-bottom-total">' + $('.fix-bottom-optbar').html() + '</div>' + '<div id="profile" class="fixed-bottom fd-hide fix-bottom-profile">' + $('#profile').html() + '</div>',
                rightContent: '',
                limit: 3,
                width: '1008px',
                left: '210px',
                curPageInput: $('input#curpage'),
                form: $('form[name=search_condition]'),
                param: $('#page')
            }
            $('.fix-bottom-optbar').remove()
            $('#profile').remove()
            var pagelistall = new T.pagelistall(data);
            pagelistall.bunnerFlow = function() {
            	var documentHeight = $('body').height();
				var fixBottom = $('#fixBottomPageList');
				$('body').css('position','relative')
				var top = $(document).scrollTop();
				fixBottom.css({'top': top + $(window).height() - 44 });
				$(document).scroll(function(){
					// var documentHeight = $(document).height() - 400;
					// if( top + $(window).height() - 50 > $(document).height()){return};
					var top = $(document).scrollTop();
					documentHeight = $('body').height()
					// if( top + 10 > documentHeight) { top = pretop };	
					if ( documentHeight <=  top + $(window).height() - 1)	{return}		
					fixBottom.css({'top': top + $(window).height() - 44 })
				})
			}
            pagelistall.bindEvnet= function(data){
    			var _self = this;
    			//点页码
    			$('li.pagination > a.pages').bind('click',function(){
    				var toPage = $(this).data('page');
    				document.search_condition.isExportData.value = 0;
    				data.param.val(toPage);
    				data.form.submit();
    			})
    			//点上下页
    			$('#offer-page-prev').bind('click',function(){
    				var toPage = parseInt(data.curPage) - 1;
    				if( toPage == 0 ) {return}
    				data.param.val(toPage);
    				document.search_condition.isExportData.value = 0;
    				data.form.submit();
    			})
    			$('#offer-page-next').bind('click',function(){
    				var toPage = parseInt(data.curPage) + 1;
    				if( toPage > data.page ) {return}
    				data.param.val(toPage);
    				document.search_condition.isExportData.value = 0;
    				data.form.submit();
    			})
    			//页码后点击确定按钮
    			$('.js-goto').click(function(){
                    var toPage = $('input.js-jump-page').val();
                    if( !isNaN(toPage) && parseInt(toPage) <= _self.data.page && parseInt(toPage) > 0 ) {
    	 				data.param.val(toPage);
    	 				document.search_condition.isExportData.value = 0;
    					data.form.submit();                    
                    }else{
                        alert('请输入1 ~ ' + _self.data.page);
                    }
                })
    			$(".js-jump-page").live('keypress', function(event) {
                    if(event.keyCode == '13') {
                        //var page = $(this).closest('.paging');
                        $('.js-goto').click();
                    }
                });

    		}
            pagelistall.init(data);

    	},
		
		//suggest
		function() {
			var seriesId=$('#seriesIdHide').val() || '';
            var topicSeriesJsonUrl=T.domain + '/enroll/v2012/topic_series.json';
			new FE.tools.Suggestion('#seriesName', {
                url: topicSeriesJsonUrl,
                data: {'type':'1'},
                paramName: 'seriesName',
                valInput: '#seriesIdHide',
				isDefaultItem : false,
                complete: function() {
					seriesId = $('#seriesIdHide').val();
                    sgs.setConfig({
                        data:{'type':'2', 'seriesId':seriesId}
                    });
                    
                    $('#seriesName').trigger('change');
                }
            });
			
            var sgs = new FE.tools.Suggestion('#topicName', {
                url: topicSeriesJsonUrl,
                data: {'type':'2', 'seriesId':seriesId},
                paramName: 'topicName',
                isDefaultItem : false,
                valInput: '#topicIdHide'
            });
			
			$('#seriesName').change(function(){
				$('#topicName').val('');
				$('#topicIdHide').val('');
                var el = $(this);
                if (el.val()){
                    el.removeClass('error');
                } else {
                    el.addClass('error');
                }
			});
		},
		//配置消息
		function() {
			$("#conf-message").live("click", function() {
				if( this.checked) {
					$("#profile").removeClass('fd-hide');
					$("#isProfile").val(true);
				} else {
					$("#profile").addClass('fd-hide');
					$("#isProfile").val(false);
				}
			});
		},
		function(){
			var buId = $("#buId").val();
			var urlPost = $('#domain_enrollModule').val() + '/market_bu_pinlei_cat.json?_input_charset=utf-8&id='+buId+'&depth=3&type=bu2pl';

				if(buId == ""){
					$('#pinleiId').empty();
					$("#pinleiId").prepend("<option value=''>请选择品类</option>");
					$('#categoryId').empty();
					$("#categoryId").prepend("<option value=''>请选择类目</option>");
					return;
				}
				jQuery.ajax({
					url : urlPost,
					type: "post",
					async: false,
					error: function(jqXHR, textStatus, errorThrown) {
						return;
					},
					success: function(_data){
						$('#pinleiId').empty();
						$("#pinleiId").prepend("<option value=''>请选择品类</option>");
						if(!_data.data){
							return ;
						}
						for(var e in _data.data){
						  if(_data.data[e].length!=2){
							 continue;
						  }
							var oOption = new Option(_data.data[e][1],_data.data[e][0]);
							if(_data.data[e][0] == $("#hidPinleiId").val()){
								oOption.selected = true;
							}
							$("#pinleiId").append(oOption);
						}
					}
				});	
		},
		function(){
			var pinleiId = $("#hidPinleiId").val();
				var urlPost = $('#domain_enrollModule').val() + '/market_bu_pinlei_cat.json?_input_charset=utf-8&id='+pinleiId+'&depth=4';
				if(pinleiId == ""){	
						$('#categoryId').empty();
						$("#categoryId").prepend("<option value=''>请选择类目</option>");
						return;
				}
				jQuery.ajax({
					url : urlPost,
					type: "post",
					async: false,
					error: function(jqXHR, textStatus, errorThrown) {
						return;
					},
					success: function(_data){
						$('#categoryId').empty();
						$("#categoryId").prepend("<option value=''>请选择类目</option>");
						if(!_data.data){
							return ;
						}
						for(var e in _data.data){
						  if(_data.data[e].length!=2){
							 continue;
						  }
							var oOption = new Option(_data.data[e][1],_data.data[e][0]);
							if(_data.data[e][0] == $("#hidCategoryId").val()){
								oOption.selected = true;
							}
							$("#categoryId").append(oOption);
						}
					}
				});	
		},
		//BU、品类、类目级联
		function(){
			$('#buId').change(function () {
				var buId = $(this).val();
				var urlPost = $('#domain_enrollModule').val() + '/market_bu_pinlei_cat.json?_input_charset=utf-8&id='+buId+'&depth=3&type=bu2pl';

				if(buId == ""){
					$('#pinleiId').empty();
					$("#pinleiId").prepend("<option value=''>请选择品类</option>");
					$('#categoryId').empty();
					$("#categoryId").prepend("<option value=''>请选择类目</option>");
					return;
				}
				jQuery.ajax({
					url : urlPost,
					type: "post",
					async: false,
					error: function(jqXHR, textStatus, errorThrown) {
						return;
					},
					success: function(_data){
						$('#pinleiId').empty();
						$("#pinleiId").prepend("<option value=''>请选择品类</option>");
						if(!_data.data){
							return ;
						}
						for(var e in _data.data){
						  if(_data.data[e].length!=2){
							 continue;
						  }
							var oOption = new Option(_data.data[e][1],_data.data[e][0]);
							if(_data.data[e][0] == "$!pinleiId"){
								oOption.selected = true;
							}
							$("#pinleiId").append(oOption);
						}
					}
				});	
			});
			
			$('#pinleiId').change(function () {
				var pinleiId = $(this).val();
				var urlPost = $('#domain_enrollModule').val() + '/market_bu_pinlei_cat.json?_input_charset=utf-8&id='+pinleiId+'&depth=4';
				if(pinleiId == ""){
					if("$!pinleiId" != ""){
						pinleiId = "$!pinleiId";
					}else{
						$('#categoryId').empty();
						$("#categoryId").prepend("<option value=''>请选择类目</option>");
						return;
					}
				}
				jQuery.ajax({
					url : urlPost,
					type: "post",
					async: false,
					error: function(jqXHR, textStatus, errorThrown) {
						return;
					},
					success: function(_data){
						$('#categoryId').empty();
						$("#categoryId").prepend("<option value=''>请选择类目</option>");
						if(!_data.data){
							return ;
						}
						for(var e in _data.data){
						  if(_data.data[e].length!=2){
							 continue;
						  }
							var oOption = new Option(_data.data[e][1],_data.data[e][0]);
							if(_data.data[e][0] == "$!categoryId"){
								oOption.selected = true;
							}
							$("#categoryId").append(oOption);
						}
					}
				});	
			});
		},
		
		function(){
			var province = $("#province").val();
			if(province == ""){
				$('#capitalId').empty();
				$("#capitalId").prepend("<option value=''>请选择地级市</option>");
				$('#cityId').empty();
				$("#cityId").prepend("<option value=''>请选择县级市（区）</option>");
				return;
			}
			
			var selected = $("#province").find('option:selected');
			var provinceId = selected.data('pid'); 
			var urlPost = $('#domain_enrollModule').val() + '/province_capital_city.json?_input_charset=utf-8&id='+provinceId+'&depth=2';			
			jQuery.ajax({
				url : urlPost,
				type: "post",
				async: false,
				error: function(jqXHR, textStatus, errorThrown) {
					return;
				},
				success: function(_data){
					$('#capitalId').empty();
					$("#capitalId").prepend("<option value=''>请选择地级市</option>");
					if(!_data.data){
						return ;
					}
					for(var e in _data.data){
						if(_data.data[e].length!=2){
							continue;
						}
						var oOption = new Option(_data.data[e][1],_data.data[e][0]);
						if(_data.data[e][0] == $("#hidCapitalId").val()){
							oOption.selected = true;
						}
						$("#capitalId").append(oOption);
					}
				}
			});	
		},
		function(){
			var capitalId = $("#hidCapitalId").val();
			if(capitalId == ""){	
				$('#cityId').empty();
				$("#cityId").prepend("<option value=''>请选择县级市（区）</option>");
				return;
			}
			var urlPost = $('#domain_enrollModule').val() + '/province_capital_city.json?_input_charset=utf-8&id='+capitalId+'&depth=3';
			jQuery.ajax({
				url : urlPost,
				type: "post",
				async: false,
				error: function(jqXHR, textStatus, errorThrown) {
					return;
				},
				success: function(_data){
					$('#cityId').empty();
					$("#cityId").prepend("<option value=''>请选择县级市（区）</option>");
					if(!_data.data){
						return ;
					}
					for(var e in _data.data){
					  if(_data.data[e].length!=2){
						 continue;
					  }
						var oOption = new Option(_data.data[e][1],_data.data[e][0]);
						if(_data.data[e][0] == $("#hidCityId").val()){
							oOption.selected = true;
						}
						$("#cityId").append(oOption);
					}
				}
			});	
		},
		function(){
			$('#province').change(function () {
				var province = $(this).val();
				if(province == ""){
					$('#capitalId').empty();
					$("#capitalId").prepend("<option value=''>请选择地级市</option>");
					$('#cityId').empty();
					$("#cityId").prepend("<option value=''>请选择县级市（区）</option>");
					return;
				}
				var selected = $(this).find('option:selected');
				var provinceId = selected.data('pid'); 
				var urlPost = $('#domain_enrollModule').val() + '/province_capital_city.json?_input_charset=utf-8&id='+provinceId+'&depth=2';
				jQuery.ajax({
					url : urlPost,
					type: "post",
					async: false,
					error: function(jqXHR, textStatus, errorThrown) {
						return;
					},
					success: function(_data){
						$('#capitalId').empty();
						$("#capitalId").prepend("<option value=''>请选择地级市</option>");
						$('#cityId').empty();
						$("#cityId").prepend("<option value=''>请选择县级市（区）</option>");
						if(!_data.data){
							return ;
						}
						for(var e in _data.data){
						  if(_data.data[e].length!=2){
							 continue;
						  }
							var oOption = new Option(_data.data[e][1],_data.data[e][0]);
							if(_data.data[e][0] == "$!capitalId"){
								oOption.selected = true;
							}
							$("#capitalId").append(oOption);
						}
					}
				});	
			});
			$('#capitalId').change(function () {
				var capitalId = $(this).val();
				if(capitalId == ""){
					if("$!capitalId" != ""){
						capitalId = "$!capitalId";
					}else{
						$('#cityId').empty();
						$("#cityId").prepend("<option value=''>请选择县级市（区）</option>");
						return;
					}
				}
				var urlPost = $('#domain_enrollModule').val() + '/province_capital_city.json?_input_charset=utf-8&id='+capitalId+'&depth=3';
				jQuery.ajax({
					url : urlPost,
					type: "post",
					async: false,
					error: function(jqXHR, textStatus, errorThrown) {
						return;
					},
					success: function(_data){
						$('#cityId').empty();
						$("#cityId").prepend("<option value=''>请选择县级市（区）</option>");
						if(!_data.data){
							return ;
						}
						for(var e in _data.data){
						  if(_data.data[e].length!=2){
							 continue;
						  }
							var oOption = new Option(_data.data[e][1],_data.data[e][0]);
							if(_data.data[e][0] == "$!cityId"){
								oOption.selected = true;
							}
							$("#cityId").append(oOption);
						}
					}
				});	
			});
		},
		//折扣范围
		function(){
			//去除非法字符，有小数的保留一位小数
			$('.lowestOfferDiscount').on("keyup",function(){
				var value = $('.lowestOfferDiscount').val().replace(/[^\d\.]/g,'');
				var pointIndex = value.indexOf('.');
				if (pointIndex != -1 && pointIndex + 2 < value.length){
					value = value.substring(0, value.length - 1);
				}
				$('.lowestOfferDiscount').val(value);
			});
			//小数点为最后一位，删除
			$('.lowestOfferDiscount').on("blur",function(){
				var value = $('.lowestOfferDiscount').val().replace(/[^\d\.]/g,'');
				var pointIndex = value.indexOf('.');
				if (pointIndex != -1 && pointIndex == value.length - 1){
					value = value.substring(0, value.length - 1);
				}
				$('.lowestOfferDiscount').val(value);
			});
			$('.highestOfferDiscount').on("keyup",function(){
				var value = $('.highestOfferDiscount').val().replace(/[^\d\.]/g,'');
				var pointIndex = value.indexOf('.');
				if (pointIndex != -1 && pointIndex + 2 < value.length){
					value = value.substring(0, value.length - 1);
				}
				$('.highestOfferDiscount').val(value);
			});
			$('.highestOfferDiscount').on("blur",function(){
				var value = $('.highestOfferDiscount').val().replace(/[^\d\.]/g,'');
				var pointIndex = value.indexOf('.');
				if (pointIndex != -1 && pointIndex == value.length - 1){
					value = value.substring(0, value.length - 1);
				}
				$('.highestOfferDiscount').val(value);
			});
		},
		function(){
			var auditOfferSortFields = $("#hidAuditOfferSortFields").val();
				auditOfferSortFields = auditOfferSortFields.substring(1,auditOfferSortFields.length-1);
			var arr = auditOfferSortFields.split(",");
			var sortFirst = $("#sortFirst").val();
			var sortSecond = $("#hidSortSecond").val();
			var sortThird = $("#hidSortThird").val();
			var sortSecondFields = "";
			
			var offerBuyerDateNum = $("#hidOfferBuyerDateNum").val();
			$('#offerBuyerDateNum').val(offerBuyerDateNum);
			
			var isNewOffer = $("#hidIsNewOffer").val();
			$('#isNewOffer').val(isNewOffer);
			//ump
			var ump = $("#hidUmp").val();
			$('#ump').val(ump);
			
			
			var qualityScoreType = $("#hidQualityScoreType").val();
			$('#qualityScoreType').val(qualityScoreType);
			
			
			if(sortFirst == ""){
				$('#sortSecond').empty();
				$("#sortSecond").prepend("<option value=''>请选择排序</option>");
				$('#sortThird').empty();
				$("#sortThird").prepend("<option value=''>请选择排序</option>");
				return;
			}
			
			$("#isShowMore").val("yes");
			$('#sortSecond').empty();
			$("#sortSecond").prepend("<option value=''>请选择排序</option>");
			$('#sortThird').empty();
			$("#sortThird").prepend("<option value=''>请选择排序</option>");

			for(var i =0; i<arr.length; i++){
				if(i%2==0 && (sortFirst == $.trim(arr[i]) || sortFirst == $.trim(arr[i+1]))){
					i++;
				}else{
					var oOption2 = new Option($.trim(arr[i]),$.trim(arr[i]));
					if(sortSecond != undefined && sortSecond != ""){
						if(sortSecond == $.trim(arr[i])){
							oOption2.selected = true;
						}
						if(i%2==0 && (sortSecond == $.trim(arr[i]) || sortSecond == $.trim(arr[i+1]))){
							$("#sortSecond").append(oOption2);
							sortSecondFields=sortSecondFields+$.trim(arr[i])+",";
							var oOption21 = new Option($.trim(arr[i+1]),$.trim(arr[i+1]));
							if(sortSecond == $.trim(arr[i+1])){
								oOption21.selected = true;
							}
							$("#sortSecond").append(oOption21);
							sortSecondFields=sortSecondFields+$.trim(arr[i+1])+",";
							i++;
						}else{
							$("#sortSecond").append(oOption2);
							sortSecondFields=sortSecondFields+$.trim(arr[i])+",";
							var oOption3 = new Option($.trim(arr[i]),$.trim(arr[i]));
							if(sortThird == $.trim(arr[i])){
								oOption3.selected = true;
							}
							$("#sortThird").append(oOption3);
						}
					}else{
						$("#sortSecond").append(oOption2);
						sortSecondFields=sortSecondFields+$.trim(arr[i])+",";
					}
				}
			}
			
			$("#hidSortSecondFields").val(sortSecondFields.substring(0,sortSecondFields.length-1));
		},
		
		//一级/二级/三级排序的级联
		function(){
			var auditOfferSortFields = $("#hidAuditOfferSortFields").val();
				auditOfferSortFields = auditOfferSortFields.substring(1,auditOfferSortFields.length-1);
			var arr = auditOfferSortFields.split(",");
			var sortFirst = $("#sortFirst").val();
			var sortSecond = $("#hidSortSecond").val();
			var sortThird = $("#hidSortThird").val();
			var sortSecondFields = $("#hidSortSecondFields").val();
			var newArr = sortSecondFields.split(",");
			
			$('#sortFirst').change(function () {
				newArr = new Array();
				var sortFirst = $(this).val();
				if(sortFirst == ""){
					$('#sortSecond').empty();
					$("#sortSecond").prepend("<option value=''>请选择排序</option>");
					$('#sortThird').empty();
					$("#sortThird").prepend("<option value=''>请选择排序</option>");
					return;
				}
				$('#sortSecond').empty();
				$("#sortSecond").prepend("<option value=''>请选择排序</option>");
				$('#sortThird').empty();
				$("#sortThird").prepend("<option value=''>请选择排序</option>");
				
				for(var i =0; i<arr.length; i++){
					if(i%2==0 && (sortFirst == $.trim(arr[i]) || sortFirst == $.trim(arr[i+1]))){
						i++;
					}else{
						var oOption = new Option($.trim(arr[i]),$.trim(arr[i]));
//						if(sortSecond == $.trim(arr[i])){
//							oOption.selected = true;
//						}
						$("#sortSecond").append(oOption);
						newArr.push($.trim(arr[i]));
					}
				}
				
				/**for(var i =0; i<newArr.length; i++){
					if(i%2==0 && (sortSecond == newArr[i] || sortSecond == newArr[i+1])){
						i++;
					}else{
						var oOption = new Option(newArr[i],newArr[i]);
//						if(sortThird == newArr[i]){
//							oOption.selected = true;
//						}
						$("#sortThird").append(oOption);
					}
				}**/
			});
			
			$('#sortSecond').change(function () {
				var sortSecond = $(this).val();
				if(sortSecond == ""){
					$('#sortThird').empty();
					$("#sortThird").prepend("<option value=''>请选择排序</option>");
					return;
				}
				$('#sortThird').empty();
				$("#sortThird").prepend("<option value=''>请选择排序</option>");
				
				for(var i =0; i<newArr.length; i++){
					if(i%2==0 && (sortSecond == newArr[i] || sortSecond == newArr[i+1])){
						i++;
					}else{
						var oOption = new Option(newArr[i],newArr[i]);
//						if(sortThird == newArr[i]){
//							oOption.selected = true;
//						}
						$("#sortThird").append(oOption);
					}
				}
			});
		},
		
		
		//日期控件
		function() {
			jQuery.use('ui-datepicker-time, util-date', function() {
				$('.js-select-date').datepicker({
					showTime : true,
					closable : true,
					select : function(e, ui) {
						var date = ui.date.format('yyyy-MM-dd');
						$(this).val(date);
					}
				});
			});
		},
		
		//查找
		function(){
			$(".js-search").bind("click", function() {
                var seriesInput = $('#seriesName');
                if (!seriesInput.val()){
                    seriesInput.addClass('error');
                    //seriesInput.focus();
                    return;
                }
				document.search_condition.page.value = 1;
				document.search_condition.isExportData.value = 0;
                $('#auditForm,.js-msg-warning,.js-fixed-bottom').addClass('display-none');
                $('.loading').removeClass('display-none');
				document.search_condition.submit();
			});
		},
		//分页
		function(){
			$("#offer-page a").bind("click", function() {
				var page = $(this).data('page');
				document.search_condition.page.value = page;
				document.search_condition.isExportData.value = 0;
				$('#auditForm,.js-msg-warning,.js-fixed-bottom').addClass('display-none');
                $('.loading').removeClass('display-none');
				document.search_condition.submit();
			});
			
			$("#jump-page").bind("click", function() {
				var page = $(".pnum").val();
				document.search_condition.page.value = page;
				document.search_condition.isExportData.value = 0;
				$('#auditForm,.js-msg-warning,.js-fixed-bottom').addClass('display-none');
                $('.loading').removeClass('display-none');
				document.search_condition.submit();
			});
		},
		//导出数据按钮
		function() {
			$("#audit-export").live("click", function() {
				document.search_condition.page.value = 1;
				document.search_condition.isExportData.value = 1;
				document.search_condition.submit();
			});
		},
		//导出所有数据按钮
		function() {
			$("#audit-all-export").live("click", function() {
				document.search_condition.page.value = 1;
				document.search_condition.isExportData.value = 2;
				document.search_condition.submit();
			});
		},
		function(){
			if ($('#allrejected').attr('checked')){
				$('.default-reason').removeClass('fd-hide');
			}
		},
		//保存
		function(){
			$("#audit-save").live("click", function() {
				if(!validAndSetOffercattag() || !validRejectMessage()){
					return;
				}
				document.auditForm.submit();
			});
			$("#audit-save-message").live("click", function() {
				if(!validAndSetOffercattag()  || !validRejectMessage()){
					return;
				}
				if($("#conf-message").val()){
					document.auditForm.topicTime.value = $("#message-topicTime").val();
					document.auditForm.topicUrl.value = $("#message-topicUrl").val();
					document.auditForm.reUrl.value = $("#message-reUrl").val();
					document.auditForm.content.value = $("#message-content").val();
				}
				document.auditForm.isSendMessage.value = true;
				document.auditForm.submit();
			});
			
		},

		//勾选审核
		function(){
			$(".approvedbox").bind("click", function() {
				if(this.checked) {
					$('#'+$(this).data('id')).addClass('fd-hide');
					$('#status_'+ $(this).data('id') + '_f').attr('checked',false);
					$('#' + $(this).data('id') + '  input[type|=checkbox]').each(function(){
						$(this).attr('checked',false);
					});
					$('#remarks_'+$(this).data('id')+'_t').removeClass('fd-hide');
					$('#remarks_'+$(this).data('id')).focus();
				}else{
					$('#remarks_'+$(this).data('id')+'_t').addClass('fd-hide');
				}
			});
			
			$(".rejectedbox").bind("click", function() {
				if(this.checked) {  //原来没选中的话
					$('#'+$(this).data('id')).removeClass('fd-hide');
					$('#status_'+ $(this).data('id') + '_t').attr('checked',false);
					$('#remarks_'+$(this).data('id')+'_t').addClass('fd-hide');
				}else{   //原来选中的话
					$('#' + $(this).data('id') + '  input[type|=checkbox]').each(function(){
						$(this).attr('checked',false);
					});
					$('#'+$(this).data('id')).addClass('fd-hide');
				}
			});
			//全选通过
			$(".allapproved").bind("click", function() {
				if(this.checked) {
					$(".allrejected").attr('checked',false);
					$('.default-reason').addClass('fd-hide');
					$('.yp-category').removeClass('fd-hide');
					$(".approvedbox").each(function(){
						$(this).attr('checked',true);
						$('#remarks_'+$(this).data('id')+'_t').removeClass('fd-hide');
					});
					$(".rejectedbox").each(function(){
						$(this).attr('checked',false);
						$('#' + $(this).data('id') + '  input[type|=checkbox]').each(function(){
							$(this).attr('checked',false);
						});
						$('#'+$(this).data('id')).addClass('fd-hide');
					});
				}else{
					$('.yp-category').addClass('fd-hide');
					$(".approvedbox").each(function(){
						$(this).attr('checked',false);
						$('#remarks_'+$(this).data('id')+'_t').addClass('fd-hide');
					});
				}
			});
			//全选不通过
			$(".allrejected").bind("click", function() {
				if(this.checked) {
					$('.allapproved').attr('checked',false);
					$('.yp-category').addClass('fd-hide');
					$('.default-reason').removeClass('fd-hide');
					$(".rejectedbox").each(function(){
						$(this).attr('checked',true);
						$('#'+$(this).data('id')).removeClass('fd-hide');
					});
					$(".approvedbox").each(function(){
						$(this).attr('checked',false);
						$('#remarks_'+$(this).data('id')+'_t').addClass('fd-hide');
					});
				}else{
					$('.default-reason').addClass('fd-hide');
					$(".rejectedbox").each(function(){
						$(this).attr('checked',false);
						$('#' + $(this).data('id') + '  input[type|=checkbox]').each(function(){
							$(this).attr('checked',false);
						});
						$('#'+$(this).data('id')).addClass('fd-hide');
					});
					$(".approvedbox").each(function(){
						$(this).attr('checked',false);
						$('#remarks_'+$(this).data('id')+'_t').addClass('fd-hide');
					});
				}
			});
		},
		
		//高级查询
		function() {
			if( $("#isShowMore").val() == "yes" ) {
				$('#condition-5').removeClass("fd-hide");
				$('#advanced-search-td').removeClass("search-arrow-up").addClass("search-arrow-down");
			}
			
			$("#advanced-search").bind("click", function(e) {
				e.preventDefault();
				if( $("#isShowMore").val() == "yes" ) {
					$('#condition-5').addClass("fd-hide");
					$('#advanced-search-td').removeClass("search-arrow-down").addClass("search-arrow-up");
					$("#isShowMore").val("no");
				} else{	
					$('#condition-5').removeClass("fd-hide");
					$('#advanced-search-td').removeClass("search-arrow-up").addClass("search-arrow-down");
					$("#isShowMore").val("yes");
				}
			});
			
		},
		
		function(){
			FE.tools.toTop('.fixed-right', {
				fixed: {offset:20, top:300},
				hashEls:'.offer-content'
			});
		},
		
		//alitalk
		function(){
			$.use('web-alitalk', function() {
				FE.util.alitalk($('a[data-alitalk]'), {
					onRemote: function(data) {
						var el = $(this);
						el.html(data.id);
						switch (data.online) {
							case 0:
							case 2:
							case 6:
							default: //不在线
								el.html('');
								break;
							case 1: //在线
								el.html('');
								break;
							case 4:
							case 5: //手机在线
								el.html('');
								break;
						}
						
					} 
				});
			});   
		},
		
			//alitaobao
		function(){
			$.use('web-alitalk', function() {
				FE.util.alitalk($('a[data-alitaobao]'), {
					attr: 'alitaobao',
					onRemote: function(data) {
						var el = $(this);
						el.html(data.id);
						switch (data.online) {
							case 0:
							case 2:
							case 6:
							default: //不在线
								el.html('');
								break;
							case 1: //在线
								el.html('');
								break;
							case 4:
							case 5: //手机在线
								el.html('');
								break;
						}
					} ,
					siteID : 'cntaobao'
				});
			});   
		}
		
    ];

    function validRejectMessage(){
    	if ($('#allrejected').attr('checked')){
    		var reg = /^\s*$/;
    		var value = $('#allrejected-reason').val();
    		if (reg.test(value) ){
    			alert('批量审核的不通过原因不能为空！');
    			return false;
    		}
    	}
    	return true;
    }
    
    function validAndSetOffercattag(){
    	var rs=true;
		$('.approvedbox:checked').each(function(){
			var jsNeedOffercattag = $(this).closest('.js-op-table').find('.js-need-offercattag');
			if(jsNeedOffercattag.length>0){
				if(jsNeedOffercattag.find('.js-offercattag:checked').length==0){
					if(rs==true){
						//第一个没勾选的
						var fisrtInvalid = $(jsNeedOffercattag.find('.js-offercattag').get(0)).prop('id');
						if(fisrtInvalid!=''){
							location.hash = '';
							location.hash = fisrtInvalid;
						}
					}
					rs = false;
				}
			}
		});
		if(!rs){
			alert('该专场审核通过需要勾选offer类目');
		}
		return rs;
    }
	
	

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
})(jQuery, FE.tools);