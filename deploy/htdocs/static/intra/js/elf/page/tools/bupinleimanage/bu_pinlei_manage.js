;(function($,T){
	var readyFun = [

                        function(){
                            if ($(".action-success").val() == "Y"){
                                //$('.pinleiform').reload();
                                      $.use('ui-dialog', function(){
                                        if ( $(".operate-name").val() == "ADD"){
                                            var msg = "添加 成功!"
                                        }else if ( $(".operate-name").val() == "MODIFY"){
                                            var msg = "修改 成功!"
                                        }else if ( $(".operate-name").val() == "DELETE"){
                                            var msg = "删除 成功!"
                                        }else if ( $(".operate-name").val() == "MOVE"){
                                            var msg = "转移 成功!"
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
                            $(".pinleiform").on("click",".pinlei-query",function(){
                                $(".pinleiform input[name='action']").val("");
                                $(".pinleiform").submit();
                            });
                       } ,

                       function(){
                         $(".condition").on("click",".pinlei-add",function(){
                                    $.ajax({ 
                                        type: "post",
                                        url: "add_pin_lei.htm",
                                        dataType: "html",
                                        complete: function(){
                                        },
                                        success: function(data){
                                        $(".dialog-add-pinlei .dialog-content").html($(data).find(".addpinleiform"));
                                        $.use('ui-dialog,ui-draggable', function(){
                                                var dialog = $('.dialog-add-pinlei').dialog({
                                                    center: true,
                                                    fixed:true,
                                                    modal: true,
                                                    shim: true,
                                                    draggable: true,
                                                });

                                                $(".dialog-add-pinlei .btn-ok").click(function(){
                                                        $(".addpinleiform").submit();
                                                });                 
                                                                 
                                                //请确保下面的事件绑定只在domReady的时候执行，可以不将以下代码放在use内
                                                $('.dialog-add-pinlei .btn-cancel, .dialog-add-pinlei .close').click(function(){
                                                    dialog.dialog('close');
                                                });
                                        });

                                        },
                                        error:function(textStatus){
                                        }
                                    });
                            });
                       },

                       function(){
                            $(".pinleiform").on("click",".pinlei-edit-icon",function(){

                                var $pinLeiId = $(this).parent().find('.pinleiNameId').val();

                                $('.dialog-add-pinlei h5').html("编辑品类 ");
                                $.ajax({ 
                                    type: "post",
                                    url: "add_pin_lei.htm",
                                    data: {pinLeiId: $pinLeiId },
                                    dataType: "html",
                                    complete: function(){
                                    },
                                    success: function(data){
                                        $(".dialog-add-pinlei .dialog-content").html($(data).find(".addpinleiform"));

                                        $.use('ui-dialog,ui-draggable', function(){
                                                var dialog = $('.dialog-add-pinlei').dialog({
                                                    center: true,
                                                    fixed:true,
                                                    modal: true,
                                                    shim: true,
                                                    draggable: true,
                                                });

                                                $(".dialog-add-pinlei .btn-ok").click(function(){
                                                        $(".addpinleiform").submit();
                                                });                 
                                                                 
                                                //请确保下面的事件绑定只在domReady的时候执行，可以不将以下代码放在use内
                                                $('.dialog-add-pinlei .btn-cancel, .dialog-add-pinlei .close').click(function(){
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

                            $(".pinleiform").on("click",".pinlei-del-icon",function(){

                                    var $pinleiNameId = $(this).parent().find('.pinleiNameId').val();
                                    var $pinLeiName = $(this).parent().find('.pinLeiName').val();

                                    $.use('ui-dialog,ui-draggable', function(){
                                        //如有多个浮出层，请另加ID或class
                                        var dialog = $('.dialog-delete-pinlei').dialog({
                                            center: true,
                                            fixed:true,
                                            modal: true,
                                            shim: true,
                                            draggable: true,
                                        });

                                        $(".dialog-basic .btn-ok").click(function(){
                                                $(".pinleiform .pinLeiId").val($pinleiNameId);
                                                $(".pinleiform").submit();
                                        });                 
                                                         
                                        //请确保下面的事件绑定只在domReady的时候执行，可以不将以下代码放在use内
                                        $('.dialog-basic .btn-cancel, .dialog-basic .close').click(function(){
                                            dialog.dialog('close');
                                        });
                                });

                            });
                        },

                        function(){
                            $(".pinleiform").on("click",".pinlei-move-icon",function(){

                                var $pinLeiId = $(this).parent().find('.pinleiNameId').val();
                                $('.dialog-add-pinlei h5').html("转移品类 ");
                                $.ajax({ 
                                    type: "post",
                                    url: "move_pin_lei.htm",
                                    data: {pinLeiId: $pinLeiId },
                                    dataType: "html",
                                    complete: function(){
                                    },
                                    success: function(data){
                                        
                                        $(".dialog-add-pinlei .dialog-content").html($(data).find(".addpinleiform"));

                                        $.use('ui-dialog,ui-draggable', function(){
                                                var dialog = $('.dialog-add-pinlei').dialog({
                                                    center: true,
                                                    fixed:true,
                                                    modal: true,
                                                    shim: true,
                                                    draggable: true,
                                                });

                                                $(".dialog-add-pinlei .btn-ok").click(function(){
                                                        $(".addpinleiform").submit();
                                                });                 
                                                                 
                                                //请确保下面的事件绑定只在domReady的时候执行，可以不将以下代码放在use内
                                                $('.dialog-add-pinlei .btn-cancel, .dialog-add-pinlei .close').click(function(){
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