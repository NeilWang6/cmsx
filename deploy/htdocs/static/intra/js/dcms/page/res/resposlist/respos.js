/**
 * 资源位管理：列表搜索页面，新增/编辑，查找相关页面，设置数据
 * 
 * @author: wb-zhangchunyi
 * @Date: 2014-01-29
 */
;(function($, D) {

	var readyFun = [
	  function() {
			FE.dcms.doPage();
	  },
	  function(){
		    if ($(".action-success").val() == "true"){
		    	$.use('ui-dialog', function(){
		            $(".operate-success .msg").html($(".operate-name").val());
	                $(".operate-success").dialog({
	                    fadeIn: 200,
	                    fadeOut: 200,
	                    timeout: 500,
	                    center: true
	                });
		    	});
		    }
		
		    if ($(".error-code").val() != ""){
		        $.use('ui-dialog', function(){
		            $(".operate-fail .msg").html($(".error-code").val());
		            $(".operate-fail").dialog({
                        fadeIn: 200,
                        fadeOut: 200,
                        timeout: 500,
                        center: true
                    });
		        });
		    }
	  },
	  
	  // 新增资源位
      function(){
          $(".search-body-list").on("click",".js-add",function(){
        	  	 $("#resId").val("");
          		 $("#resName").val("");
          		 $("#resType").val("");
                 $.use('ui-dialog,ui-draggable', function(){
                         var dialog = $('.dialog-add-res').dialog({
                             center: true,
                             fixed:true,
                             modal: true,
                             shim: true,
                             draggable: {
                              	 handle: 'header.add-res-draggable-area',
                              	 containment: 'body'
                             }
                         });

                         $(".dialog-add-res .btn-ok").click(function(){
                        	 	$("#pageNum").val(1);
                                $(".save-res-pos-form").submit();
                         });                 
                                          
                         $('.dialog-add-res .btn-cancel, .dialog-add-res .close').click(function(){
                             	dialog.dialog('close');
                         });
                 });

             });
        }, 
        
        // 编辑资源位
        function(){
            $(".search-body-list").on("click",".js-edit",function(){
            	var resId 	= $(this).parent().find('.res-id').val(),
                	resName = $(this).parent().find('.res-name').val(),
                	resType = $(this).parent().find('.res-type').val();
            	$("#resId").val(resId);
            	$("#resName").val(resName);
            	$("#resType").val(resType);
            	// 已有是资源位的类型有大小写问题，直接如上写，部分无法匹配到。事实上，大写的都是垃圾数据，应该都是小写，无需按照以下方式处理
            	// if(resType=="MEMBER" || resType=="member"){
            	// $("#resType").val('member');
            	// }else if(resType=="OFFER" || resType=="offer"){
            	// $("#resType").val('offer');
            	// }
            	$('.dialog-add-res h5').html("编辑资源位");
                $.use('ui-dialog,ui-draggable', function(){
                        var dialog = $('.dialog-add-res').dialog({
                            center: true,
                            fixed:true,
                            modal: true,
                            shim: true,
                            draggable: {
                             	 handle: 'header.add-res-draggable-area',
                             	 containment: 'body'
                            }
                        });

                        $(".dialog-add-res .btn-ok").click(function(){
                                $(".save-res-pos-form").submit();
                        });                 
                                         
                        $('.dialog-add-res .btn-cancel, .dialog-add-res .close').click(function(){
                            dialog.dialog('close');
                        });
                });

            });
       },
       
       // 查找资源位相关页面
       function(){
           $(".search-body-list").on("click",".js-searcg-page",function(){
        	   var resId 	= $(this).parent().find('.res-id').val(),
           		   resName = $(this).parent().find('.res-name').val(),
           		   resType = $(this).parent().find('.res-type').val();
        	   $('.dialog-search-pages h5').html(resName+'资源位的相关页面');
        	   $.ajax({ 
                   type: "post",
                   url: "res_pages.htm",
                   data: {resPosId: resId },
                   dataType: "html",
                   complete: function(){
                   },
                   success: function(data){
	                   $(".dialog-search-pages .dialog-content").html($(data).find(".search-res-pages"));
	                   $('.dialog-search-pages .dialog-content .res-id').html(resId);
	            	   $('.dialog-search-pages .dialog-content .res-name').html(resName);
	            	   $('.dialog-search-pages .dialog-content .res-type').html(resType);
	                   $.use('ui-dialog,ui-draggable', function(){
	                           var dialog = $('.dialog-search-pages').dialog({
	                               center: true,
	                               fixed:true,
	                               modal: true,
	                               shim: true,
	                               draggable: {
	                              	 handle: 'header.relative-page-draggable-area',
	                              	 containment: 'body'
	                               }
	                           });
	
	                           // 请确保下面的事件绑定只在domReady的时候执行，可以不将以下代码放在use内
	                           $('.dialog-search-pages .btn-cancel, .dialog-search-pages .close').click(function(){
	                               dialog.dialog('close');
	                           });
	                   });

                   },
                   error:function(textStatus){
                   }
               });
           });
      },
      //设置数据
      function(){
    	  //
    	  $('.js-data-list').delegate('.js-set-data','click',function(event){
    		event.preventDefault();
    		var that = this,$self = $(that),config = $self.data('config');
    		var isYunYing = false;
    		D.box.datasource.Panel&&D.box.datasource.Panel.init($self,isYunYing,config.siteId);
    		$('.btn-submit','.js-dialog').data('type','res');
    	  });
      }
      
    ];
	

	$(function() {
		for (var i = 0, l = readyFun.length; i < l; i++) {
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
})(dcms, FE.dcms);
