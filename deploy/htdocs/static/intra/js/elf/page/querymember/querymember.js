/**
 * @package FE.app.elf.tools.querymember
 * @Date: 2013-08-19
 */

;(function($, E,T){
	var formValid,
		handlers ={
			init: function(){
				this.validInit();
			},
			validInit: function(){
				var validEls = $('.need-valid');
				$.use('web-valid', function(){
					formValid = new FE.ui.Valid(validEls, {
						onValid: function(res, o){
							var tip = $(this).closest('.dpl-a-l').find('.validator-tip'), msg = '';
							if (tip.length>1){
	                            for (var i=0, l=tip.length-1; i<l; i++){
	                                tip.eq(i).remove();
	                            }
	                        }
	                        if (res==='pass') {
	                        	tip.removeClass('validator-error');
	                        	msg='';
	                        	tip.text(msg);
	                        } else {
								switch (res){
									case 'required':
										msg = '请填写该字段';
										break;
									case 'float' :
										msg = '请填写数字';
										break;
									case 'int' :
										msg = '请填写整数';
										break;
									case 'min' :
										msg = '不能小于0';
										break;
									case 'max' :
										msg = '超出最大值';
										break;
									case 'fun' :
										msg = o.msg;
										break;
									default:
										msg = '输入错误';
										break;
								}
								tip.text(msg);
								tip.addClass('validator-error');
	                        }
						}
					});
				});
			}
		},
		readyFun = [
			//分页
			function() {
				var data = {
	                curPage: $('input#curpage').val(),
	                page: $('input#page_num').val(),//几页
	                titlelist: $('input#titlelist').val(),//多少条
	                leftContent: '',
	                rightContent: '',
	                limit: 3,
	                width: $('.data-table table').width() + 'px',
	                left: $('.data-table table').offset().left + 'px',
	                curPageInput: $('input#curpage'),
	                form: $('form[name=queryMemberInfos]'),
	                param: $($('form[name=queryMemberInfos]')[0].page)
	            }
	            var pagelistall = new T.pagelistall(data);
	            pagelistall.init(data);   

			},

			
			function() {
			
				var offerId = $("#offerId").val();
				var period = $("#period").val();
				var enInsId = $("#enInsId").val();
				var quantityBegin =$("#quantityBegin").val();
				var category = $("#category").val();
				var expression = "";
				var expressionParam = "";
				
				if( $("#isShowMore").val() == "yes" ) {
					$('.multisearch').removeClass("fd-hide");
					$('#advanced-search-td').removeClass("search-arrow-up").addClass("search-arrow-down");
					$(this).addClass("adv-search");
				}else{
					$('.multisearch').addClass("fd-hide");
					$(this).removeClass("adv-search");
				}
			
				//分页跳转按钮的事件绑定
				$('#jumpPageButton').click(function(){
					var page  =  $('#jumpPageInput').val();
					if(!(/(^[1-9]\d*$)/.test(page))) {
						alert('请输入合法数字');
						return;
					}
					document.queryMemberInfos.page.value = page;
					document.queryMemberInfos.submit();
				});
				
				//查询按钮的事件绑定
				$('#search').click(function(){
					var startFlag = 0;
					var memberId = "";
					$(".multisearch td").each(function(){
						if($(this).find("input").val()){
							if( $(this).data('page')=="string"){
								if(startFlag==0){
									expression += $(this).find("input").attr('name') + $(this).find("select:last").find("option:selected").val() +'"' + $.trim($(this).find("input").val()) + '" ';
								}else{
									expression += $(this).find("select:first").find("option:selected").val() + ' ' + $(this).find("input").attr('name') + $(this).find("select:last").find("option:selected").val() +'"' + $.trim($(this).find("input").val()) + '" ';
								}								
							}else{
								if(startFlag==0){
									expression += $(this).find("input").attr('name') + $(this).find("select:last").find("option:selected").val() + $.trim($(this).find("input").val()) + ' ';
								}else{
									expression += $(this).find("select:first").find("option:selected").val() + ' ' + $(this).find("input").attr('name') + $(this).find("select:last").find("option:selected").val() + $.trim($(this).find("input").val()) + ' ';
								}								
							}	
							startFlag++;
							expressionParam += $(this).find("input").attr('name') + '##' + $.trim($(this).find("input").val()) + '--'; 
							expressionParam += $(this).find("select:first").attr('id') + '##' + $(this).find("select:first").find("option:selected").val() + '--';
							expressionParam += $(this).find("select:last").attr('id') + '##' + $(this).find("select:last").find("option:selected").val() + '--';
						}						
					});
					
					if($('#memberIdValue').val()){
						if(expression){
							expression += ' & ' +$('#memberIdValue').attr('name') + '="' + $.trim($('#memberIdValue').val())  + '"';
						}else{
							expression += $('#memberIdValue').attr('name') + '="' + $.trim($('#memberIdValue').val())  + '"';
						}
						
						expressionParam += $('#memberIdValue').attr('name') + '##' + $.trim($('#memberIdValue').val()) + '--';
						memberId = $.trim($('#memberIdValue').val());
					}
					document.queryMemberInfos.requestFlag.value = 'Y';
					
					document.queryMemberInfos.expression.value = expression;
					document.queryMemberInfos.cbm.value = $('input[name="_cbm"]').filter(':checked').val();
					document.queryMemberInfos.expressionParam.value = expressionParam;
					document.queryMemberInfos.memberId.value = memberId;
					if(formValid.valid()){
						document.queryMemberInfos.submit();
					}else{
						return false;
					}
					
				});
				
				//具体页码a标签的事件绑定
				$('#link-multisearch').click(function(){
					if ($(this).hasClass("adv-search")) {
						$('.multisearch').addClass("fd-hide");
						$(this).removeClass("adv-search");
						$('#advanced-search-td').removeClass("search-arrow-up").addClass("search-arrow-down");
						$("#isShowMore").val("no");						
					} else{	
						$('.multisearch').removeClass("fd-hide");
						$(this).addClass("adv-search");
						$('#advanced-search-td').removeClass("search-arrow-up").addClass("search-arrow-down");
						$("#isShowMore").val("yes");						
					}
				});		
				
				 //日期控件
	            $.use('ui-datepicker-time, util-date', function() {
	                $('.js-select-date').datepicker({
	                    zIndex: 3000,
	                    showTime: true,
	                    closable: true,
	                    select: function(e, ui) {
	                        var date = ui.date.format('yyyy-MM-dd');
	                        $(this).val(date);
	                    }
	                });
	            });
			}
		];
	
	handlers.init();
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
})(jQuery, FE.elf, FE.tools);