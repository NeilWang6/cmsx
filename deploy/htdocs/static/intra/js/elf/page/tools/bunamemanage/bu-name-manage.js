;(function($,T){
	var readyFun = [

                        function(){
                            if ($(".action-success").val() == "Y"){
                                      $.use('ui-dialog', function(){
                                        if ( $(".operate-name").val() == "ADD"){
                                            var msg = "添加 成功!"
                                        }else if ( $(".operate-name").val() == "MODIFY"){
                                            var msg = "修改 成功!"
                                        }else if ( $(".operate-name").val() == "DELETE"){
                                            var msg = "删除 成功!"
                                        }
                                       $(".operate-success .msg").html(msg );
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
                                    if ( $(".error-code").val() == "NAME_IS_EXISTED"){
                                        var msg = "操作失败 : 名字存在!"
                                    }else if ( $(".error-code").val() == "NAME_IS_REQUIRED"){
                                        var msg = "操作失败 : 名字为空!"
                                    }
                                    $(".operate-fail .msg").html(msg);
                                    $(".operate-fail").dialog({
                                                fadeIn: 200,
                                                fadeOut: 200,
                                                timeout: 500,
                                                center: true
                                            });
                                    });
                                }
                        },

		function(){

                            $(".buNameform").on("click",".del-icon",function(){
                                    var $buId = $(this).parent().find('.buNameId').val();
                                    var $buName = $(this).parent().find('.bu-name').val();

                                    $.use('ui-dialog,ui-draggable', function(){
                                        //如有多个浮出层，请另加ID或class
                                        var dialog = $('.dialog-delete-bu').dialog({
                                            center: true,
                                            fixed:true,
                                            modal: true,
                                            shim: true,
                                            draggable: true,
                                        });

                                        $(".dialog-basic .mg-16").click(function(){
                                                $(".buNameform .buId").val($buId);
                                                $(".buNameform").submit();
                                        });                 
                                                         
                                        //请确保下面的事件绑定只在domReady的时候执行，可以不将以下代码放在use内
                                        $('.dialog-basic .btn-cancel, .dialog-basic .close').click(function(){
                                            dialog.dialog('close');
                                        });
                                });

                            });

                        },

                        function(){
                            $(".buNameform").on("click",".edit-icon",function(){
                                    var $buId = $(this).parent().find('.buNameId').val();
                                    $.ajax({ 
                                        type: "get",
                                        url: "add_bu_name.htm",
                                        data: { buId: $buId },
                                        dataType: "html",
                                        complete: function(){
                                            //alert("complete：function!");
                                        },
                                        success: function(data){

                                        $(".dialog-add-bu .dialog-content").html($(data).find(".addbuform"));

                                        $.use('ui-dialog,ui-draggable', function(){
                                                //如有多个浮出层，请另加ID或class
                                                var dialog = $('.dialog-add-bu').dialog({
                                                    center: true,
                                                    fixed:true,
                                                    modal: true,
                                                    shim: true,
                                                    draggable: true,
                                                });

                                                $(".dialog-add-bu .mg-16").click(function(){
                                                        $(".addbuform").submit();
                                                });                 
                                                                 
                                                //请确保下面的事件绑定只在domReady的时候执行，可以不将以下代码放在use内
                                                $('.dialog-add-bu .btn-cancel, .dialog-add-bu .close').click(function(){
                                                    dialog.dialog('close');
                                                });
                                        });


                                        },
                                        error:function(textStatus){
                                            //alert("zhang error!");
                                        }
                                    });

                            });
                        },

                        function(){
                            $(".condition").on("click",".create-icon",function(){
                                    $.ajax({ 
                                        type: "get",
                                        url: "add_bu_name.htm",
                                        dataType: "html",
                                        complete: function(){
                                            //alert("complete：function!");
                                        },
                                        success: function(data){

                                        $(".dialog-add-bu .dialog-content").html($(data).find(".addbuform"));
                                        $.use('ui-dialog,ui-draggable', function(){
                                                //如有多个浮出层，请另加ID或class
                                                var dialog = $('.dialog-add-bu').dialog({
                                                    center: true,
                                                    fixed:true,
                                                    modal: true,
                                                    shim: true,
                                                    draggable: true,
                                                });

                                                $(".dialog-add-bu .mg-16").click(function(){
                                                        $(".addbuform").submit();
                                                });                 
                                                                 
                                                //请确保下面的事件绑定只在domReady的时候执行，可以不将以下代码放在use内
                                                $('.dialog-add-bu .btn-cancel, .dialog-add-bu .close').click(function(){
                                                    dialog.dialog('close');
                                                });
                                        });


                                        },
                                        error:function(textStatus){
                                            //alert("zhang error!");
                                        }
                                    });
                            });
                        }
   
	];

    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });

})(jQuery,FE.tools);