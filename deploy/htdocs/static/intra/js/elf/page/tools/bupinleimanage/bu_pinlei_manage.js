;(function($,T){
	var readyFun = [

                        function(){
                            if ($(".action-success").val() == "Y"){
                                //$('.pinleiform').reload();
                                      $.use('ui-dialog', function(){
                                        if ( $(".operate-name").val() == "ADD"){
                                            var msg = "��� �ɹ�!"
                                        }else if ( $(".operate-name").val() == "MODIFY"){
                                            var msg = "�޸� �ɹ�!"
                                        }else if ( $(".operate-name").val() == "DELETE"){
                                            var msg = "ɾ�� �ɹ�!"
                                        }else if ( $(".operate-name").val() == "MOVE"){
                                            var msg = "ת�� �ɹ�!"
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
                                        var msg = "����ʧ�� : ���ִ���!"
                                    }else if ( $(".error-code").val() == "NAME_IS_REQUIRED"){
                                        var msg = "����ʧ�� : ����Ϊ��!"
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
                                                                 
                                                //��ȷ��������¼���ֻ��domReady��ʱ��ִ�У����Բ������´������use��
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

                                $('.dialog-add-pinlei h5').html("�༭Ʒ�� ");
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
                                                                 
                                                //��ȷ��������¼���ֻ��domReady��ʱ��ִ�У����Բ������´������use��
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
                                        //���ж�������㣬�����ID��class
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
                                                         
                                        //��ȷ��������¼���ֻ��domReady��ʱ��ִ�У����Բ������´������use��
                                        $('.dialog-basic .btn-cancel, .dialog-basic .close').click(function(){
                                            dialog.dialog('close');
                                        });
                                });

                            });
                        },

                        function(){
                            $(".pinleiform").on("click",".pinlei-move-icon",function(){

                                var $pinLeiId = $(this).parent().find('.pinleiNameId').val();
                                $('.dialog-add-pinlei h5').html("ת��Ʒ�� ");
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
                                                                 
                                                //��ȷ��������¼���ֻ��domReady��ʱ��ִ�У����Բ������´������use��
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