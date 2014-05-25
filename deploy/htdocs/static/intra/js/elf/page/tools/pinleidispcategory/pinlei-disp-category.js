;(function($,T){
    var readyFun = [

                        function(){
                            if ($(".action-success").val() == "Y" 
                                 && ( $(".operate-name").val()  == "ADD" || $(".operate-name").val()  == "DELETE" ) ){
                                      $.use('ui-dialog', function(){
                                        var msg = "操作 成功!"
                                        if ( $(".operate-name").val() == "ADD"){
                                             msg = "添加 成功!"
                                        }else if ( $(".operate-name").val() == "DELETE"){
                                             msg = "删除 成功!"
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
                                    var msg = "操作 失败 !";
                                    if ( $(".error-code").val() == "NAME_IS_EXISTED"){
                                         msg = "操作失败 : 名字存在!"
                                    }else if ( $(".error-code").val() == "NAME_IS_REQUIRED"){
                                         msg = "操作失败 : 名字为空!"
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
                               _getPinleiBybuId();
                        },

                        function(){
                           $('#buId').change(function() {
                               _getPinleiBybuId();
                            });
                        },

                        function(){
                            $('.category-query').click(function(){
                                if ($('#pinLeiId').val() == "" || $('#pinLeiId').val() == null || $('#pinLeiId').val() == "请选择"){
                                    _showInfo("请选择品类！");
                                    return;
                                }
                                $('#event_submit_do_').attr('name','event_submit_do_queryCategory');
                                $('.pinleiform').submit();
                            });
                        },

                        function(){
                            $('.category-delete').click(function(){

                                var selectedId = $('#currpinLeiId').val();
                                if (selectedId=="" || selectedId== null ){
                                    _showInfo("当前的品类不存在！");
                                    return;
                                }
                                var delCatId = $('#delCatId').val();
                                if (delCatId == "" || delCatId == null){
                                    _showInfo("请选择需要从本品类移除的选项，可多选！");
                                    return;
                                }

                                $('#event_submit_do_').attr('name','event_submit_do_delCategory');
                                $('.pinleiform').submit();
                            });
                        },

                        function(){
                             $('.category-add').click(function(){

                                var selectedId = $('#currpinLeiId').val();
                                if (selectedId=="" || selectedId == null){
                                    _showInfo("当前的品类不存在！");
                                    return;
                                }
                                var addCatId = $('#addCatId').val();
                                if (addCatId == "" || addCatId== null ){
                                    _showInfo("请选择需要添加到本品类的选项，可多选！");
                                    return;
                                }

                                $('#event_submit_do_').attr('name','event_submit_do_addCategory');
                                $('.pinleiform').submit();
                            });
                        }
 
    ];

        function _showInfo(msg){
            $('.dialog-info-pinlei .msg').html(msg);
            $.use('ui-dialog,ui-draggable', function(){
                var dialog = $('.dialog-info-pinlei').dialog({
                center: true,
                fixed:true,
                modal: true,
                shim: true,
                draggable: true,
                });

                $(".dialog-basic .btn-ok").click(function(){
                     dialog.dialog('close');
               });                 
            });
        }

        function _getPinleiBybuId(){

            var $buId = $('#buId').val();
            if ($buId == ""){
                return;
            }

           $.ajax({ 
                    type: "post",
                    url: "get_pinlei_bybuId.htm",
                    data: { buId: $buId },
                    dataType: "html",
                    complete: function(){
                    },
                    success: function(data){
                        $('#pinLeiId option').remove();   
                        var currpinLeiId=$('#currpinLeiId').val();
                        var jsonArray=toJsonObj(data);
                        $('#pinLeiId').append("<option value=''>请选择</option>"); 
                        for(var e in jsonArray){
                            if (currpinLeiId == e){
                                $('#pinLeiId').append('<option value="' + e + '"selected>' + jsonArray[e] + '</option>'); 
                            }else{
                                $('#pinLeiId').append('<option value=' +e  + '>' + jsonArray[e]  + '</option>'); 
                            }
                        }
                    },
                    error:function(textStatus){
                    }
                });
        }

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